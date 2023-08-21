import React, {useCallback, useState} from 'react';
import {addItemClassName} from '@/checklist/Checklist.css.ts';
import {Button, TextField} from 'monday-ui-react-core';
import {CHECKLIST_ITEM_MAX_LENGTH} from 'bridge/constants.ts';
import {AddSmall} from 'monday-ui-react-core/icons';
import {useTranslation} from 'react-i18next';

/**
 * button and text field to add a new checklist item, placed at the bottom of the checklist
 * @param onAdd
 * @return {React.ReactElement}
 */
export function AddItem({onAdd}: { onAdd: (title: string) => void }) {
  const {t} = useTranslation('checklist');
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
      placeholder={t('add.item.placeholder')}
    />
    <Button disabled={!value}
      size={Button.sizes.SMALL}
      rightIcon={AddSmall}
      onClick={add}>Add item</Button>
  </div>;
}
