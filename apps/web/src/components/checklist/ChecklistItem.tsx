import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import React, {useCallback, useRef, useState} from 'react';
import Linkify from 'linkify-react';
import {
  checklistItemsInnerClassName,
  checklistItemTitleClassName,
  checklistItemTitleEditClassName,
} from '../../item-view/checklist/Checklist.css.ts';
import {Checkbox, EditableHeading} from 'monday-ui-react-core';
import {ChecklistItemToolbar} from './ChecklistItemToolbar.tsx';


export function ChecklistItem({item, onChange, onDelete, isCheckable}: { item: ChecklistInFirestore['items'][number], onChange: (update: Partial<ChecklistInFirestore['items'][number]>) => void, onDelete: () => void, isCheckable?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const ref = useRef<HTMLElement | null>(null);
  const update = useCallback((update: Partial<ChecklistInFirestore['items'][number]>) => onChange(update), [onChange]);
  const onSave = useCallback(() => {
    update({title});
    setIsEditing(false);
  }, [update, setIsEditing, title]);
  const editableText = item.title;
  const visibleText = item.title + (item.type === 'item' && item.isOptional ? ' (optional)' : '');
  const LinkifiedElement = <Linkify as="" options={{defaultProtocol: 'https', target: '_blank'}}>
    {visibleText}
  </Linkify>;
  return <div className={checklistItemsInnerClassName}>
    <div className={checklistItemTitleClassName}>
      {
        item.type === 'item' &&
                <Checkbox
                  disabled={!isCheckable}
                  onChange={(e) => onChange({isChecked: e.target.checked})}
                  defaultChecked={item.isChecked}
                />
      }
      <div className={checklistItemTitleEditClassName} onClick={() => setIsEditing(true)} ref={(r) => {
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
          <EditableHeading disabled={!isEditing} onChange={setTitle} onBlur={onSave} type={EditableHeading.types.h5} value={isEditing ? editableText : LinkifiedElement as any}/>
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
