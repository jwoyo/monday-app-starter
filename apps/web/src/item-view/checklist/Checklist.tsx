import {
  AttentionBox,
  Button,
  Checkbox,
  IconButton,
  Skeleton,
  Text,
  TextField,
} from 'monday-ui-react-core';
import {AddSmall, Erase, Note, Quote, Help, Completed, Edit} from 'monday-ui-react-core/icons';
import React, {useCallback, useState} from 'react';
import {
  addItemClassName,
  checklistClassName,
  checklistItemClassName, checklistItemsClassName, checklistItemsInnerClassName, checklistItemToolbarClassName,
  checklistSkeletonClassName,
} from './Checklist.css.ts';
import {useChecklist} from './use-checklist.ts';
import {
  ChecklistInFirestore,
  ChecklistItemHeadlineInFirestore,
  ChecklistItemInFirestore,
} from 'functions/firestore.schemas.ts';
import {Progress} from 'antd';

/**
 * checklist view
 * @return {ReactElement}
 */
export function Checklist() {
  const checklist = useChecklist();
  const {checklistQuery} = checklist;

  if (checklistQuery.isLoading) {
    return <div className={checklistClassName}>
      <div className={checklistSkeletonClassName}>
        <Skeleton height={20}/>
        <Skeleton height={20} width={200}/>
        <Skeleton height={20} width={200}/>
        <Skeleton height={20} width={300}/>
      </div>
    </div>;
  }

  if (checklistQuery.isError) {
    return <AttentionBox title="Could not load checklist"
      text="We could not fetch the checklist from monday.com. Please try again later or contact app support."
      type={AttentionBox.types.DANGER}
    />;
  }

  return (
    <div className={checklistClassName}>
      <ChecklistProgressBar/>
      <div>
        <ChecklistItems/>
      </div>
      <AddItem/>
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
  </div>;
}

function ChecklistItems() {
  const {checklist} = useChecklist();
  return <div className={checklistItemsClassName}>
    {
      checklist?.items.map((item) => <div className={checklistItemsInnerClassName}>
        {
          item.type === 'headline' ? <ChecklistItemHeadline key={item.id} item={item}/> : <ChecklistItem key={item.id} item={item}/>
        }
        <ChecklistItemToolbar item={item}/>
      </div>)
    }
  </div>;
}

function ChecklistItemHeadline({item}: {item: ChecklistItemHeadlineInFirestore}) {
  return <div className={checklistItemClassName}>
    <Text>{item.title}</Text>
  </div>;
}

function ChecklistItem({item}: {item: ChecklistItemInFirestore}) {
  const {updateItem} = useChecklist();
  return <div className={checklistItemClassName}>
    <Checkbox
      onChange={(e) => updateItem(item.id, {isChecked: e.target.checked})}
      defaultChecked={item.isChecked}
    />
    <Text style={{opacity: item.isOptional ? '0.6' : '1'}}>{item.title} {item.isOptional ? '(optional)' : ''}</Text>
  </div>;
}

function ChecklistItemToolbar({item}: {item: ChecklistInFirestore['items'][number]}) {
  const {updateItem} = useChecklist();
  const update = (update: Parameters<typeof updateItem>[1]) => () => updateItem(item.id, update);
  const iconProps = {
    kind: IconButton.kinds.SECONDARY, size: IconButton.sizes.XS,
  };
  return <div className={checklistItemToolbarClassName}>
    <IconButton icon={Edit}{...iconProps} ariaLabel="Edit item" />
    {item.type === 'item' && <IconButton icon={Note}{...iconProps} ariaLabel="Turn into headline" onClick={update( {type: 'headline'})} />}
    {item.type === 'headline' && <IconButton icon={Note}{...iconProps} ariaLabel="Turn into item" onClick={update( {type: 'item'})} />}
    {item.type === 'headline' && <IconButton icon={Completed}{...iconProps} disabled />}
    {item.type === 'item' && item.isOptional && <IconButton icon={Completed}{...iconProps} ariaLabel="Turn into mandatory item" onClick={update( {isOptional: false})} />}
    {item.type === 'item' && !item.isOptional && <IconButton icon={Completed}{...iconProps} ariaLabel="Turn into optional item" onClick={update( {isOptional: true})} />}
    <IconButton icon={Erase}{...iconProps} ariaLabel="Delete item" />
  </div>;
}

function ChecklistProgressBar() {
  const {checklist} = useChecklist();
  const items = checklist?.items.filter((item): item is ChecklistItemInFirestore => item.type === 'item');
  const value = items ? items.filter((item) => item.isChecked).length / items.length : 0;
  if (!checklist) {
    return <></>;
  }
  return <Progress
    style={{marginBottom: 0}}
    percent={Math.round(value * 100)}
  />;
}
