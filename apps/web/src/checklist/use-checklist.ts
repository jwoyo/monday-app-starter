import {useMondayContext, useMondaySettings} from '@/use-monday.ts';
import {useIsMutating, useQueryClient} from '@tanstack/react-query';
import {trpc} from '@/trpc.ts';
import {ChecklistInFirestore, ChecklistItemInFirestore} from 'functions/firestore.schemas.ts';
import {useCallback} from 'react';
import {getQueryKey} from '@trpc/react-query';
import {buildItemsProducers} from '@/producers.ts';
import {useMondayClient} from '@/graphql.ts';

/**
 * handles query and mutation management for a single checklist in the item view.
 *
 * @returns {object} checklist and server state operations
 */
export function useChecklist() {
  const context = useMondayContext();
  const settings = useMondaySettings();
  const mondayClient = useMondayClient();
  const queryClient = useQueryClient();
  const queryKey = getQueryKey( trpc.checklist.get, {itemId: context.itemId}, 'query');
  const {mutate} = trpc.checklist.set.useMutation({
    onMutate: async ({checklist}) => {
      await queryClient.cancelQueries(queryKey);
      const previousChecklist = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, checklist);
      return {previousChecklist};
    },
    onError: (error, data, context) => {
      queryClient.setQueriesData(queryKey, context?.previousChecklist);
    },
    onSuccess: async ({items}) => {
      if (!settings.progress_column) {
        return;
      }
      const columnConfiguration = Object.entries(settings.progress_column).find(([, value]) => value);
      const [boardId] = context.boardIds;
      if (!columnConfiguration || !boardId) {
        return;
      }
      const [columnId] = columnConfiguration;
      if (!columnId) {
        return;
      }
      const checkableItems = items?.filter((item): item is ChecklistItemInFirestore => item.type === 'item') || [];
      const percentage = Math.round((checkableItems.filter((item) => item.isChecked).length / checkableItems.length) * 100);
      if (!items.length) {
        return;
      }
      // drop errors for now
      mondayClient.setItemValue({
        boardId: boardId,
        itemId: context.itemId,
        columnId,
        value: percentage.toString(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const runningMutationCount = useIsMutating([['checklist', 'set']]);
  const query = trpc.checklist.get.useQuery({itemId: context.itemId}, {enabled: runningMutationCount === 0});
  const mutateServerState = useCallback((checklist: ChecklistInFirestore) => {
    return mutate({
      itemId: context.itemId,
      checklist,
    });
  }, [context, mutate]);

  const addItem = useCallback((title: string) => {
    const {addItem} = buildItemsProducers(query.data?.items);
    const newItems = addItem(title);
    mutateServerState({items: newItems});
  }, [mutateServerState, query.data]);

  const updateItem = useCallback((id: string, update: Partial<ChecklistInFirestore['items'][number]>) => {
    const {updateItem} = buildItemsProducers(query.data?.items);
    const newItems = updateItem(id, update);
    mutateServerState({items: newItems});
  }, [query.data, mutateServerState]);

  const moveItem = useCallback((fromId: string, toId: string) => {
    const {moveItem} = buildItemsProducers(query.data?.items);
    const newItems = moveItem(fromId, toId);
    mutateServerState({items: newItems});
  }, [query.data, mutateServerState]);

  const deleteItem = useCallback((id: string) => {
    const {deleteItem} = buildItemsProducers(query.data?.items);
    const newItems = deleteItem(id);
    mutateServerState({items: newItems});
  }, [query.data, mutateServerState]);

  return {
    checklistQuery: query,
    checklist: query.data,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
  };
}
