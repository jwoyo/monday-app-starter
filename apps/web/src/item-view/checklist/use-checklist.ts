import {useMonday} from '../../use-monday.ts';
import {useIsMutating, useQueryClient} from '@tanstack/react-query';
import {trpc} from '../../trpc.ts';
import {produce} from 'immer';
import {v4 as uuidv4} from 'uuid';
import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {useCallback} from 'react';
import {getQueryKey} from '@trpc/react-query';

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
    const newChecklist = produce(query.data || EMPTY_CHECKLIST, (state) => {
      state.items.push({
        id: uuidv4(),
        type: 'item',
        title,
        isChecked: false,
        assigneeIds: [],
        isOptional: false,
      });
    });
    mutateServerState(newChecklist);
  }, [mutateServerState, query.data]);

  const updateItem = useCallback((id: string, update: Partial<ChecklistInFirestore['items'][number]>) => {
    const newChecklist = produce(query.data!, (state) => {
      if (!state) {
        return;
      }
      const itemIdx = state.items.findIndex((item) => item.id === id);
      const item = state.items[itemIdx];
      if (!item) {
        return;
      }
      const mergedItem = {...state.items[itemIdx], ...update};
      if (mergedItem.type === 'headline') {
        state.items[itemIdx] = {
          id: mergedItem.id,
          type: mergedItem.type,
          title: mergedItem.title,
        };
      }
      if (mergedItem.type === 'item') {
        state.items[itemIdx] = {
          id: mergedItem.id,
          type: mergedItem.type,
          title: mergedItem.title,
          isChecked: mergedItem.isChecked || false,
          assigneeIds: mergedItem.assigneeIds || [],
          isOptional: mergedItem.isOptional || false,
        };
      }
    });
    mutateServerState(newChecklist);
  }, [query.data, mutateServerState]);

  const moveItem = useCallback((fromId: string, toId: string) => {
    const newChecklist = produce(query.data!, (state) => {
      if (!state) {
        return;
      }
      const oldIndex = state.items.findIndex((item) => item.id === fromId);
      const newIndex = state.items.findIndex((item) => item.id === toId);
      const [removed] = state.items.splice(oldIndex, 1);
      state.items.splice(newIndex, 0, removed);
    });
    mutateServerState(newChecklist);
  }, [query.data, mutateServerState]);

  const deleteItem = useCallback((id: string) => {
    const newChecklist = produce(query.data!, (state) => {
      if (!state) {
        return;
      }
      const itemIdx = state.items.findIndex((item) => item.id === id);
      state.items.splice(itemIdx, 1);
    });
    mutateServerState(newChecklist);
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

const EMPTY_CHECKLIST: ChecklistInFirestore = {
  items: [],
};
