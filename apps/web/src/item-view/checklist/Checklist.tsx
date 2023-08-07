import {
  AttentionBox,
  Button,
  Checkbox, EditableHeading,
  IconButton,
  Skeleton,
  TextField,
} from 'monday-ui-react-core';
import {AddSmall, Erase, Note, Completed, Edit} from 'monday-ui-react-core/icons';
import React, {ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {
  addItemClassName,
  checklistClassName,
  checklistItemTitleClassName, checklistItemsClassName, checklistItemsInnerClassName, checklistItemToolbarClassName,
  checklistSkeletonClassName, checklistItemTitleEditClassName,
} from './Checklist.css.ts';
import {useChecklist} from './use-checklist.ts';
import {
  ChecklistInFirestore,
  ChecklistItemInFirestore,
} from 'functions/firestore.schemas.ts';
import {Progress} from 'antd';
import {CHECKLIST_ITEM_MAX_LENGTH} from 'bridge/constants.ts';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import * as linkify from 'linkifyjs';
import Linkify from 'linkify-react';
import linkifyHtml from 'linkify-html';

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
      maxLength={CHECKLIST_ITEM_MAX_LENGTH}
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
  const {checklist, moveItem} = useChecklist();
  const [itemIds, setItemIds] = useState<string[]>(checklist?.items.map((item) => item.id) || []);
  useEffect(() => {
    setItemIds(checklist?.items.map((item) => item.id) || []);
  }, [checklist?.items]);
  if (!checklist) {
    return <></>;
  }
  const onDragEnd = (result: DropResult) => {
    if (result.destination?.index === undefined) {
      return;
    }
    const from = checklist.items[result.source.index];
    const to = checklist.items[result.destination.index];
    if (from === undefined || to === undefined || from.id === to.id) {
      return;
    }
    setItemIds((ids) => {
      const newIds = [...ids];
      const [deleted] = newIds.splice(result.source.index, 1);
      newIds.splice(result.destination!.index, 0, deleted);
      return newIds;
    });
    moveItem(from.id, to.id);
  };

  return <div className={checklistItemsClassName}><DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {itemIds
              .map((id) => checklist.items.find((i) => i.id === id))
              .filter((i): i is ChecklistItemInFirestore => !!i)
              .map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div key={item.id} className={'checklist-item-wrapper-' + item.type}>
                        <ChecklistItem key={item.id} item={item}/>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
  </div>;
}

function ChecklistItem({item}: { item: ChecklistInFirestore['items'][number] }) {
  const {updateItem} = useChecklist();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const ref = useRef<HTMLElement | null>(null);
  const update = useCallback((update: Parameters<typeof updateItem>[1]) => updateItem(item.id, update), [item, updateItem]);
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
                onChange={(e) => updateItem(item.id, {isChecked: e.target.checked})}
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
    <ChecklistItemToolbar item={item} onEdit={() => setIsEditing((v) => !v)}/>
  </div>;
}

function ChecklistItemToolbar({item, onEdit}: { item: ChecklistInFirestore['items'][number], onEdit: () => void }) {
  const {updateItem, deleteItem: deleteItemById} = useChecklist();
  const update = (update: Parameters<typeof updateItem>[1]) => () => updateItem(item.id, update);
  const deleteItem = () => deleteItemById(item.id);
  const iconProps = {
    kind: IconButton.kinds.SECONDARY, size: IconButton.sizes.XS,
  };
  return <div className={checklistItemToolbarClassName}>
    <IconButton icon={Edit}{...iconProps} ariaLabel="Edit item" onClick={onEdit}/>
    {item.type === 'item' &&
            <IconButton icon={Note}{...iconProps} ariaLabel="Turn into headline" onClick={update({type: 'headline'})}/>}
    {item.type === 'headline' &&
            <IconButton icon={Note}{...iconProps} ariaLabel="Turn into item" onClick={update({type: 'item'})}/>}
    {item.type === 'headline' && <IconButton icon={Completed}{...iconProps} disabled/>}
    {item.type === 'item' && item.isOptional &&
            <IconButton icon={Completed} {...iconProps} ariaLabel="Turn into mandatory item"
              onClick={update({isOptional: false})}/>}
    {item.type === 'item' && !item.isOptional &&
            <IconButton icon={Completed} {...iconProps} ariaLabel="Turn into optional item"
              onClick={update({isOptional: true})}/>}
    <IconButton icon={Erase}{...iconProps} ariaLabel="Delete item" onClick={deleteItem}/>
  </div>;
}

function ChecklistProgressBar() {
  const {checklist} = useChecklist();
  const items = checklist?.items.filter((item): item is ChecklistItemInFirestore => item.type === 'item');
  const value = items ? items.filter((item) => item.isChecked).length / items.length : 0;
  if (!checklist || !items) {
    return <></>;
  }
  return <>
    <Progress
      style={{marginBottom: 0}}
      /* success={{percent: items.filter((i) => !i.isOptional).every((i) => i.isChecked) ? 80 : 0}}*/
      success={{percent: items.filter((i) => !i.isOptional).every((i) => i.isChecked) ? Math.round(value * 100) : 0}}
      percent={Math.round(value * 100)}
    /></>;
}
