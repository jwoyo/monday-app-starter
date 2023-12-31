import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {IconButton} from 'monday-ui-react-core';
import {checklistItemToolbarClassName} from '@/checklist/Checklist.css.ts';
import {Erase, Note, Completed, Edit} from 'monday-ui-react-core/icons';
import React from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Checklist item toolbar to appear on hover to edit, delete, and update items
 * @param item
 * @param onEdit
 * @param onDelete
 * @param onUpdate
 * @return {ReactElement}
 */
export function ChecklistItemToolbar({item, onEdit, onDelete, onUpdate}: {
  item: ChecklistInFirestore['items'][number],
  onEdit: () => void,
  onDelete: () => void,
  onUpdate: (update: Partial<ChecklistInFirestore['items'][number]>) => void,
}) {
  const {t} = useTranslation('checklist');
  const deleteItem = () => onDelete();
  const iconProps = {
    kind: IconButton.kinds.SECONDARY, size: IconButton.sizes.XS,
  };
  return <div className={checklistItemToolbarClassName}>
    <IconButton icon={Edit}
      {...iconProps}
      ariaLabel={t('toolbar.edit.item')}
      onClick={onEdit}/>
    {item.type === 'item' &&
            <IconButton icon={Note}
              {...iconProps}
              ariaLabel={t('toolbar.into.headline')}
              onClick={() => onUpdate({type: 'headline'})}/>}
    {item.type === 'headline' &&
            <IconButton icon={Note}
              {...iconProps}
              ariaLabel={t('toolbar.into.item')}
              onClick={() => onUpdate({type: 'item'})}/>}
    {item.type === 'headline' && <IconButton icon={Completed}
      {...iconProps}
      disabled/>}
    {item.type === 'item' && item.isOptional &&
            <IconButton icon={Completed}
              {...iconProps}
              ariaLabel={t('toolbar.into.mandatory.item')}
              onClick={() => onUpdate({isOptional: false})}/>}
    {item.type === 'item' && !item.isOptional &&
            <IconButton icon={Completed}
              {...iconProps}
              ariaLabel={t('toolbar.into.optional.item')}
              onClick={() => onUpdate({isOptional: true})}/>}
    <IconButton icon={Erase}
      {...iconProps}
      ariaLabel={t('toolbar.delete.item')}
      onClick={deleteItem}/>
  </div>;
}
