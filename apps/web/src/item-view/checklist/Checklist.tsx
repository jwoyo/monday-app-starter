import {AttentionBox, Button, Checkbox, LinearProgressBar, Skeleton, Text, TextField} from 'monday-ui-react-core';
import {AddSmall} from 'monday-ui-react-core/icons';
import React, {useCallback, useState} from 'react';
import {
  addItemClassName,
  checklistClassName,
  checklistItemClassName, checklistItemsClassName,
  checklistSkeletonClassName,
} from './Checklist.css.ts';
import {useChecklist} from './use-checklist.ts';
import {
  ChecklistItemHeadlineInFirestore,
  ChecklistItemInFirestore,
} from 'functions/firestore.schemas.ts';

/**
 * checklist view
 * @return {ReactElement}
 */
export function Checklist() {
  const {checklistQuery: query} = useChecklist();
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
      <ChecklistProgressBar/>
      <ChecklistItems/>
      <AddItem/>
    </div>
  );
}

function AddItem() {
  const {addItem, isMutating} = useChecklist();
  const [value, setValue] = useState('');
  const add = useCallback(() => {
    if (!value) {
      return;
    }
    setValue('');
    addItem(value);
  }, [addItem, value]);
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
    {JSON.stringify(isMutating)}
  </div>;
}

function ChecklistItems() {
  const {checklistQuery: {data: checklist}} = useChecklist();
  return <div className={checklistItemsClassName}>
    {
      checklist?.items.map((item) => {
        if (item.type === 'headline') {
          return <ChecklistItemHeadline key={item.id} item={item}/>;
        }
        return <ChecklistItem key={item.id} item={item}/>;
      })
    }
  </div>;
}

function ChecklistItemHeadline({item}: { item: ChecklistItemHeadlineInFirestore }) {
  return <div className={checklistItemClassName}>
    <Text>{item.title}</Text>
  </div>;
}

function ChecklistItem({item}: { item: ChecklistItemInFirestore }) {
  const {updateItem} = useChecklist();
  return <div className={checklistItemClassName}>
    <Checkbox
      onChange={(e) => updateItem(item.id, {isChecked: e.target.checked})}
      defaultChecked={item.isChecked}
    />
    <Text>{item.title}</Text>
  </div>;
}

function ChecklistProgressBar() {
  const {checklistQuery: {data: checklist}} = useChecklist();
  const items = checklist?.items.filter((item): item is ChecklistItemInFirestore => item.type === 'item');
  const value = items ? items.filter((item) => item.isChecked).length / items.length : 0;
  if (!checklist) {
    return <></>;
  }
  return <LinearProgressBar
    size={LinearProgressBar.sizes.LARGE as never}
    indicateProgress
    value={value * 100}
  />;
}
