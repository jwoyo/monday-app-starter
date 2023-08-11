import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {produce} from 'immer';
import {v4 as uuidv4} from 'uuid';

/**
 * builds a set of producers for the items array of a checklist. might be used for blueprint items as well as long as they are similar.
 * @param items
 * @returns {object} producers
 */
export function buildItemsProducers(items?: ChecklistInFirestore['items']) {
  const addItem = (title: string) => {
    return produce(items || [], (state) => {
      state.push({
        id: uuidv4(),
        type: 'item',
        title,
        isChecked: false,
        assigneeIds: [],
        isOptional: false,
      });
    });
  };

  const updateItem = (id: string, update: Partial<ChecklistInFirestore['items'][number]>) => {
    return produce(items || [], (state) => {
      if (!state) {
        return;
      }
      const itemIdx = state.findIndex((item) => item.id === id);
      const item = state[itemIdx];
      if (!item) {
        return;
      }
      const mergedItem = {...state[itemIdx], ...update};
      if (mergedItem.type === 'headline') {
        state[itemIdx] = {
          id: mergedItem.id,
          type: mergedItem.type,
          title: mergedItem.title,
        };
      }
      if (mergedItem.type === 'item') {
        state[itemIdx] = {
          id: mergedItem.id,
          type: mergedItem.type,
          title: mergedItem.title,
          isChecked: mergedItem.isChecked || false,
          assigneeIds: mergedItem.assigneeIds || [],
          isOptional: mergedItem.isOptional || false,
        };
      }
    });
  };

  const moveItem = (fromId: string, toId: string) => {
    return produce(items || [], (state) => {
      if (!state) {
        return;
      }
      const oldIndex = state.findIndex((item) => item.id === fromId);
      const newIndex = state.findIndex((item) => item.id === toId);
      const [removed] = state.splice(oldIndex, 1);
      state.splice(newIndex, 0, removed);
    });
  };

  const deleteItem = (id: string) => {
    return produce(items || [], (state) => {
      if (!state) {
        return;
      }
      const itemIdx = state.findIndex((item) => item.id === id);
      state.splice(itemIdx, 1);
    });
  };

  const uncheckItems = () => {
    return produce(items || [], (state) => {
      if (!state) {
        return;
      }
      return state.map((item) => {
        if (item.type === 'item') {
          return {
            ...item,
            isChecked: false,
          };
        }
        return item;
      });
    });
  };

  return {
    addItem,
    updateItem,
    moveItem,
    deleteItem,
    uncheckItems,
  };
}
