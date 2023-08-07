import {BlueprintInFirestore, blueprintInFirestoreSchema} from 'functions/firestore.schemas.ts';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {blueprintFormControlsCss, blueprintFormCss} from './BlueprintForm.css.ts';
import {Divider, Text, TextField} from 'monday-ui-react-core';
import {NAME_MAX_LENGTH} from 'bridge/constants.ts';
import {ChecklistItems} from './checklist/ChecklistItems.tsx';
import {produce} from 'immer';
import {v4 as uuidv4} from 'uuid';
import React, {ReactElement} from 'react';

export function BlueprintForm({onSubmit, submitElement}: {onSubmit: (blueprint: BlueprintInFirestore) => void, submitElement: ReactElement}) {
  const {control, setValue, handleSubmit, formState: {errors}} = useForm<BlueprintInFirestore>({
    resolver: zodResolver(blueprintInFirestoreSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={blueprintFormCss}>
      <Text size="small" weight="bold">Blueprint name</Text>
      <Controller
        name="name"
        control={control}
        render={({field}) => <TextField
          {...field}
          size={TextField.sizes.SMALL}
          placeholder="Give this blueprint a meaningful name"
          validation={{status: errors.name?.message ? 'error' : 'success', text: errors.name?.message}}
          maxLength={NAME_MAX_LENGTH}/>
        }
      />
      <Text size="small" weight="bold">Items</Text>
      <Controller
        name="items"
        control={control}
        render={({field}) =>
          <ChecklistItems
            onMoveItem={(fromId, toId) => {
              setValue('items', produce(field.value || [], (state) => {
                const oldIndex = state.findIndex((item) => item.id === fromId);
                const newIndex = state.findIndex((item) => item.id === toId);
                const [removed] = state.splice(oldIndex, 1);
                state.splice(newIndex, 0, removed);
              }));
            }}
            onDeleteItem={(id) => {
              setValue('items', produce(field.value || [], (state) => {
                if (!state) {
                  return;
                }
                const itemIdx = state.findIndex((item) => item.id === id);
                state.splice(itemIdx, 1);
              }));
            }}
            onAddItem={(title) => {
              setValue('items', produce(field.value || [], (state) => {
                state.push({
                  id: uuidv4(),
                  type: 'item',
                  title,
                  isChecked: false,
                  assigneeIds: [],
                  isOptional: false,
                });
              }));
            }}
            onChangeItem={(id, update) => {
              setValue('items', produce(field.value || [], (state) => {
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
              }));
            }}
            defaultValue={field.value}/>}
      />
      <Divider/>
      <div className={blueprintFormControlsCss}>
        {submitElement}
      </div>
    </form>
  );
}
