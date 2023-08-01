import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {ChecklistInFirestore} from 'functions/firestore.schemas.ts';
import {v4 as uuidv4} from 'uuid';

const EMPTY_CHECKLIST: ChecklistInFirestore = {
  items: [],
};

type State = {
    checklist: ChecklistInFirestore | null
}

type Unpacked<T> = T extends (infer U)[] ? U : never;
type Item = Unpacked<ChecklistInFirestore['items']>

type Actions = {
    setChecklist: (checklist: ChecklistInFirestore | null) => void
    updateChecklist: (update: Partial<ChecklistInFirestore> | null) => void
    updateItem: (id: Item['id'], update: Partial<Item>) => void
    addItem: (title: Item['title']) => void
}

export const useChecklistStore = create(
    immer<State & Actions>((set) => ({
      checklist: null,
      setChecklist: (checklist: ChecklistInFirestore | null) => {
        set((state) => {
          state.checklist = checklist || EMPTY_CHECKLIST;
        });
      },
      updateChecklist: (update?: Partial<ChecklistInFirestore> | null) => {
        set((state) => {
          state.checklist = {...(state.checklist || EMPTY_CHECKLIST), ...update};
        });
      },
      updateItem: (id: Item['id'], update: Partial<Item>) => {
        set((state) => {
          if (!state.checklist) {
            return;
          }
          const itemIdx = state.checklist.items.findIndex((item) => item.id === id);
          const item = state.checklist.items[itemIdx];
          if (!item) {
            return;
          }
          const mergedItem = {...state.checklist.items[itemIdx], ...update};
          if (mergedItem.type === 'headline') {
            state.checklist.items[itemIdx] = {
              id: mergedItem.id,
              type: mergedItem.type,
              title: mergedItem.title,
            };
          }
          if (mergedItem.type === 'item') {
            state.checklist.items[itemIdx] = {
              id: mergedItem.id,
              type: mergedItem.type,
              title: mergedItem.title,
              isChecked: mergedItem.isChecked || false,
              assigneeIds: mergedItem.assigneeIds || [],
              isOptional: mergedItem.isOptional || false,
            };
          }
        });
      },
      addItem: (title: Item['title']) => {
        set((state) => {
          if (!state.checklist) {
            return;
          }
          state.checklist.items.push({
            id: uuidv4(),
            type: 'item',
            title,
            isChecked: false,
            assigneeIds: [],
            isOptional: false,
          });
        });
      },
    }))
);
