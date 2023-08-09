import {useMonday} from '@/use-monday.ts';
import {useIsMutating, useQueryClient} from '@tanstack/react-query';
import {trpc} from '@/trpc.ts';
import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {useCallback} from 'react';
import {getQueryKey} from '@trpc/react-query';
import {buildItemsProducers} from '@/producers.ts';

/**
 * handles query and mutation management for a single checklist in the item view.
 *
 * @returns {object} checklist and server state operations
 */
export function useChecklist() {
  const {context} = useMonday();
  const queryClient = useQueryClient();
  const queryKey = getQueryKey( trpc.checklist.get, {itemId: context!.itemId}, 'query');
  const mutationKey = ['checklist', 'set'];
  const {mutate} = trpc.checklist.set.useMutation({
    mutationKey,
    onMutate: async ({checklist}) => {
      await queryClient.cancelQueries({queryKey});
      const previousChecklist = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, checklist);
      return {previousChecklist};
    },
    onError: (error, data, context) => {
      queryClient.setQueriesData(queryKey, context?.previousChecklist);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(queryKey);
    },
  });
  const runningMutationCount = useIsMutating([mutationKey]);
  const query = trpc.checklist.get.useQuery({itemId: context!.itemId}, {enabled: runningMutationCount === 0});

  const mutateServerState = useCallback((checklist: ChecklistInFirestore) => {
    return mutate({
      itemId: context!.itemId,
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