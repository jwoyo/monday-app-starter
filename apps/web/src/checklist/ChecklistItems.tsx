import React, {useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {checklistItemsClassName} from '@/checklist/Checklist.css.ts';
import {ChecklistInFirestore, ChecklistItemInFirestore} from 'functions/firestore.schemas.ts';
import {ChecklistItem} from './ChecklistItem.tsx';
import {AddItem} from './ChecklistAddItem.tsx';

export function ChecklistItems({defaultValue, onMoveItem, onChangeItem, onAddItem, onDeleteItem, isCheckable}: {
    defaultValue?: ChecklistInFirestore['items'],
    onMoveItem: (fromId: string, toId: string) => void
    onChangeItem: (id: string, update: Partial<ChecklistInFirestore['items'][number]>) => void
    onDeleteItem: (id: string) => void
    onAddItem: (title: string) => void
    isCheckable?: boolean
}) {
  const items = defaultValue;
  const [itemIds, setItemIds] = useState<string[]>(items?.map((item) => item.id) || []);
  useEffect(() => {
    setItemIds(items?.map((item) => item.id) || []);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!items) {
      return;
    }
    if (result.destination?.index === undefined) {
      return;
    }
    const from = items[result.source.index];
    const to = items[result.destination.index];
    if (from === undefined || to === undefined || from.id === to.id) {
      return;
    }
    setItemIds((ids) => {
      const newIds = [...ids];
      const [deleted] = newIds.splice(result.source.index, 1);
      newIds.splice(result.destination!.index, 0, deleted);
      return newIds;
    });
    onMoveItem(from.id, to.id);
  };

  return <div className={checklistItemsClassName}>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {itemIds
                .map((id) => items?.find((i) => i.id === id))
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
                          <ChecklistItem key={item.id} item={item} onChange={(u) => onChangeItem(item.id, u)} onDelete={() => onDeleteItem(item.id)} isCheckable={isCheckable}/>
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
    <AddItem onAdd={onAddItem}/>
  </div>;
}
