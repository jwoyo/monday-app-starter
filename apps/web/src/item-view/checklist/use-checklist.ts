import {useMonday} from '../../use-monday.ts';
import {useQueryClient} from '@tanstack/react-query';
import {getQueryKey} from '@trpc/react-query';
import {trpc} from '../../trpc.ts';
import {produce} from 'immer';
import {v4 as uuidv4} from 'uuid';
import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';

export function useChecklist() {
  const {context} = useMonday();
  const queryClient = useQueryClient();
  const queryKey = getQueryKey( trpc.checklist.get, {itemId: context!.itemId}, 'query');
  const query = trpc.checklist.get.useQuery({itemId: context!.itemId});

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
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

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
    mutate({
      itemId: context!.itemId,
      checklist: newChecklist,
    });
  };

  return {
    checklistQuery: query,
    addItem,
  };
}

const EMPTY_CHECKLIST: ChecklistInFirestore = {
  items: [],
};
