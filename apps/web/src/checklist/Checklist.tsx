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
import {useTranslation} from 'react-i18next';

/**
 * checklist view
 * @return {ReactElement}
 */
export function Checklist() {
  const {t} = useTranslation('checklist');
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
    return <AttentionBox title={t('loading.error.title')}
      text={t('loading.error.text')}
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

/**
 * checklist progress bar
 * @param checklist
 * @return {ReactElement}
 */
function ChecklistProgressBar({checklist}: {checklist?: ChecklistInFirestore | null}) {
  const items = checklist?.items.filter((item): item is ChecklistItemInFirestore => item.type === 'item');
  const value = items ? items.filter((item) => item.isChecked).length / items.length : 0;
  if (!checklist || !items) {
    return <></>;
  }
  return <>
    <Progress
      strokeColor={'var(--primary-color)'}
      style={{marginBottom: 0}}
      success={{
        percent: items.filter((i) => !i.isOptional).every((i) => i.isChecked) ? Math.round(value * 100) : 0,
        strokeColor: 'var(--color-success)',
      }}
      percent={Math.round(value * 100)}
    /></>;
}
