import {
  AttentionBox,
  Skeleton,
} from 'monday-ui-react-core';
import React from 'react';
import {
  checklistClassName,
  checklistSkeletonClassName,
} from './Checklist.css.ts';
import {useChecklist} from './use-checklist.ts';
import {
  ChecklistInFirestore,
  ChecklistItemInFirestore,
} from 'functions/firestore.schemas.ts';
import {Progress} from 'antd';
import {ChecklistItems} from '@/checklist/ChecklistItems.tsx';

/**
 * checklist view
 * @return {ReactElement}
 */
export function Checklist() {
  const {checklistQuery: {isLoading, isError}, checklist, moveItem, updateItem, addItem, deleteItem} = useChecklist();

  if (isLoading) {
    return <div className={checklistClassName}>
      <div className={checklistSkeletonClassName}>
        <div></div>
        <Skeleton height={20}
          fullWidth/>
        <div></div>
        <div></div>
        <Skeleton height={20}
          width={200}/>
        <Skeleton height={20}
          width={180}/>
        <Skeleton height={20}
          width={150}/>
        <Skeleton height={20}
          width={300}/>
        <div></div>
        <div></div>
        <Skeleton height={20}
          fullWidth/>
      </div>
    </div>;
  }

  if (isError) {
    return <AttentionBox title="Could not load checklist"
      text="We could not fetch the checklist from monday.com. Please try again later or contact app support."
      type={AttentionBox.types.DANGER}
    />;
  }

  return (
    <div className={checklistClassName}>
      <ChecklistProgressBar checklist={checklist}/>
      <div>
        <ChecklistItems
          isCheckable
          defaultValue={checklist?.items}
          onChangeItem={updateItem}
          onMoveItem={moveItem}
          onDeleteItem={deleteItem}
          onAddItem={addItem}/>
      </div>
    </div>
  );
}

function ChecklistProgressBar({checklist}: {checklist?: ChecklistInFirestore | null}) {
  const items = checklist?.items.filter((item): item is ChecklistItemInFirestore => item.type === 'item');
  const value = items ? items.filter((item) => item.isChecked).length / items.length : 0;
  if (!checklist || !items) {
    return <></>;
  }
  return <>
    <Progress
      style={{marginBottom: 0}}
      success={{percent: items.filter((i) => !i.isOptional).every((i) => i.isChecked) ? Math.round(value * 100) : 0}}
      percent={Math.round(value * 100)}
    /></>;
}
