import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import React, {useCallback, useRef, useState} from 'react';
import Linkify from 'linkify-react';
import {
  checklistItemsInnerClassName,
  checklistItemTitleClassName,
  checklistItemTitleEditClassName,
} from '@/checklist/Checklist.css.ts';
import {Checkbox, EditableHeading} from 'monday-ui-react-core';
import {ChecklistItemToolbar} from './ChecklistItemToolbar.tsx';

/**
 * Singe checklist item component to be rendered as part of a checklist
 * @param item
 * @param onChange
 * @param onDelete
 * @param isCheckable
 * @returns {JSX.Element}
 */
export function ChecklistItem({item, onChange, onDelete, isCheckable}: { item: ChecklistInFirestore['items'][number], onChange: (update: Partial<ChecklistInFirestore['items'][number]>) => void, onDelete: () => void, isCheckable?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const ref = useRef<HTMLElement | null>(null);
  const update = useCallback((update: Partial<ChecklistInFirestore['items'][number]>) => onChange(update), [onChange]);
  const onSave = useCallback(() => {
    if (item.title !== title) {
      update({title});
    }
    setIsEditing(false);
  }, [update, setIsEditing, title, item.title]);
  const editableText = item.title;
  const visibleText = item.title + (item.type === 'item' && item.isOptional ? ' (optional)' : '');
  const LinkifiedElement = <Linkify as=""
    options={{defaultProtocol: 'https', target: '_blank'}}>
    {visibleText}
  </Linkify>;
  return <div className={checklistItemsInnerClassName}>
    <div className={checklistItemTitleClassName}>
      {
        item.type === 'item' && (isCheckable ? <Checkbox
          disabled={!isCheckable}
          onChange={(e) => onChange({isChecked: e.target.checked})}
          checked={item.isChecked}
        /> : <div>-</div>)

      }
      <div className={checklistItemTitleEditClassName}
        onClick={() => setIsEditing(true)}
        ref={(r) => {
          ref.current = r;
          if (!r || !isEditing) {
            return;
          }
          // focus prop is broken, so we do this instead
          setTimeout(() => {
            const input = r.querySelector('h5');
            input?.click();
          });
        }}>
        <div className={'item-type-' + item.type + (item.type === 'item' && item.isOptional ? ' optional' : '')}>
          <EditableHeading disabled={!isEditing}
            onChange={setTitle}
            onBlur={onSave}
            type={EditableHeading.types.h5}
            /* EditableHeading luckily also works with jsx elements from linkify but is not typed accordingly */
            value={isEditing ? editableText : LinkifiedElement as unknown as string}/>
        </div>
      </div>
    </div>
    <ChecklistItemToolbar
      item={item}
      onEdit={() => setIsEditing((v) => !v)}
      onUpdate={(u) => onChange(u)}
      onDelete={onDelete}
    />
  </div>;
}
