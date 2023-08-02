import {useMonday} from '../../use-monday.ts';
import {useQueryClient} from '@tanstack/react-query';
import {trpc} from '../../trpc.ts';
import {produce} from 'immer';
import {v4 as uuidv4} from 'uuid';
import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {useState} from 'react';
import {getQueryKey} from '@trpc/react-query';

export function useChecklist() {
  const {context} = useMonday();
  const queryClient = useQueryClient();
  const queryKey = getQueryKey( trpc.checklist.get, {itemId: context!.itemId}, 'query');
  const [isMutating, setIsMutating] = useState(false);
  const query = trpc.checklist.get.useQuery({itemId: context!.itemId}, {enabled: !isMutating});

  const {mutate} = trpc.checklist.set.useMutation({
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
      setIsMutating(false);
      await queryClient.invalidateQueries(queryKey);
    },
  });

  const mutateServerState = (checklist: ChecklistInFirestore) => {
    setIsMutating(true);
    return mutate({
      itemId: context!.itemId,
      checklist,
    });
  };

  const addItem = (title: string) => {
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
  };

  const updateItem = (id: string, update: Partial<ChecklistInFirestore['items'][number]>) => {
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
  };

  return {
    checklistQuery: query,
    addItem,
    updateItem,
    isMutating,
  };
}

const EMPTY_CHECKLIST: ChecklistInFirestore = {
  items: [],
};
