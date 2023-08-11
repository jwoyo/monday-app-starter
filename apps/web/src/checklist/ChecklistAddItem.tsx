import React, {useCallback, useState} from 'react';
import {addItemClassName} from '@/checklist/Checklist.css.ts';
import {Button, TextField} from 'monday-ui-react-core';
import {CHECKLIST_ITEM_MAX_LENGTH} from 'bridge/constants.ts';
import {AddSmall} from 'monday-ui-react-core/icons';

export function AddItem({onAdd}: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('');
  const add = useCallback(() => {
    if (!value) {
      return;
    }
    setValue('');
    onAdd(value);
  }, [onAdd, value]);
  return <div className={addItemClassName}>
    <TextField
      maxLength={CHECKLIST_ITEM_MAX_LENGTH}
      value={value}
      onChange={(e) => setValue(e)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          add();
          e.preventDefault();
        }
      }}
      placeholder="Enter text for a new checklist item here"
    />
    <Button disabled={!value}
      size={Button.sizes.SMALL}
      rightIcon={AddSmall}
      onClick={add}>Add item</Button>
  </div>;
}
