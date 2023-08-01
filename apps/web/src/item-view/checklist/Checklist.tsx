import {AttentionBox, Button, Skeleton, TextField} from 'monday-ui-react-core';
import {AddSmall} from 'monday-ui-react-core/icons';
import React, {useCallback, useState} from 'react';
import {addItemClassName, checklistClassName, checklistSkeletonClassName} from './Checklist.css.ts';
import {useChecklist} from './use-checklist.ts';

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
      <AddItem/>
      {query.data?.items.map((item) => <div key={item.id}>{JSON.stringify(item)}</div>)}
    </div>
  );
}

function AddItem() {
  const {addItem} = useChecklist();
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
