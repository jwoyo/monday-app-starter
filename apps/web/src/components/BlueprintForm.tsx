import {BlueprintInFirestore, blueprintInFirestoreSchema} from 'functions/firestore.schemas.ts';
import {Controller, useForm, UseFormHandleSubmit} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {blueprintFormControlsCss, blueprintFormCss} from './BlueprintForm.css.ts';
import {Divider, Text, TextField} from 'monday-ui-react-core';
import {NAME_MAX_LENGTH} from 'bridge/constants.ts';
import {ChecklistItems} from './checklist/ChecklistItems.tsx';
import React, {ReactElement} from 'react';
import {buildItemsProducers} from '../producers.ts';

/**
 * blueprint form, used for creating and editing blueprints. submitElement is the element that will be used for submitting the form.
 * user is responsible for setting the loading state of the element as well as the onSubmit handler
 * @param onSubmit
 * @param submitElement
 * @constructor
 */
export function BlueprintForm({onSubmit, submitElement}: {onSubmit: (blueprint: BlueprintInFirestore) => void, submitElement: (onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>) => ReactElement}): ReactElement {
  const {control, setValue, handleSubmit, formState: {errors}} = useForm<BlueprintInFirestore>({
    resolver: zodResolver(blueprintInFirestoreSchema),
  });
  return (
    <form className={blueprintFormCss}>
      <Text size="small" weight="bold">Blueprint name</Text>
      <Controller
        name="name"
        control={control}
        render={({field}) => <TextField
          {...field}
          required
          size={TextField.sizes.SMALL}
          placeholder="Give this blueprint a meaningful name"
          validation={{status: errors.name?.message ? 'error' : undefined, text: errors.name?.message}}
          maxLength={NAME_MAX_LENGTH}/>
        }
      />
      <Text size="small" weight="bold">Items</Text>
      <Controller
        name="items"
        control={control}
        render={({field}) => {
          const {moveItem, deleteItem, addItem, updateItem} = buildItemsProducers(field.value);
          return <ChecklistItems
            onMoveItem={(fromId, toId) => setValue('items', moveItem(fromId, toId))}
            onDeleteItem={(id) => setValue('items', deleteItem(id))}
            onAddItem={(title) => setValue('items', addItem(title))}
            onChangeItem={(id, update) => setValue('items', updateItem(id, update))}
            defaultValue={field.value}/>;
        }}
      />
      <Divider/>
      <div className={blueprintFormControlsCss}>
        {submitElement(handleSubmit(onSubmit))}
      </div>
    </form>
  );
}
