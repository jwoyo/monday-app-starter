import {useMonday} from '../../use-monday.ts';
import {trpc} from '../../trpc.ts';
import {AttentionBox, Button, Skeleton, TextField} from 'monday-ui-react-core';
import {AddSmall} from 'monday-ui-react-core/icons';
import React, {useCallback, useEffect, useState} from 'react';
import {addItemClassName, checklistClassName, checklistSkeletonClassName} from './Checklist.css.ts';
import {v4 as uuidv4} from 'uuid';
import {produce} from 'immer';
import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {getQueryKey} from '@trpc/react-query';
import {useQueryClient} from '@tanstack/react-query';


/**
 * checklist view
 * @return {ReactElement}
 */
export function Checklist() {
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
      state.items = [...state.items, {
        id: uuidv4(),
        type: 'item',
        title,
        isChecked: false,
        assigneeIds: [],
        isOptional: false,
      }];
    }) as ChecklistInFirestore;
    mutate({
      itemId: context!.itemId,
      checklist: newChecklist,
    });
  };

  if (query.isLoading) {
    return <div className={checklistClassName}>
      <div className={checklistSkeletonClassName}>
        <Skeleton height={20}/>
        <Skeleton height={20} width={200}/>
        <Skeleton height={20} width={200}/>
        <Skeleton height={20} width={300}/>
      </div>
    </div>;
  }
  if (query.isError) {
    return <AttentionBox title="Could not load checklist"
      text="We could not fetch the checklist from monday.com. Please try again later or contact app support."
      type={AttentionBox.types.DANGER}
    />;
  }

  return (
    <div className={checklistClassName}>
      <AddItem addItem={addItem}/>
      {query.data?.items.map((item) => <div key={item.id}>{JSON.stringify(item)}</div>)}
    </div>
  );
}

const EMPTY_CHECKLIST: ChecklistInFirestore = {
  items: [],
};

function AddItem({addItem}: {addItem: (title: string) => void}) {
  const [value, setValue] = useState('');
  const add = useCallback(() => {
    if (!value) {
      return;
    }
    setValue('');
    addItem(value);
  }, [value]);
  return <div className={addItemClassName}>
    <TextField
      value={value}
      onChange={(e) => setValue(e)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          add();
        }
      }}
      placeholder="Enter text for a new checklist item here"
    />
    <Button disabled={!value} size={Button.sizes.SMALL} rightIcon={AddSmall} onClick={add}>Add item</Button>
  </div>;
}
