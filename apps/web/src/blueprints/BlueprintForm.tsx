import {
  BlueprintCreatePayload,
  blueprintCreatePayloadSchema,
} from 'functions/firestore.schemas.ts';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {blueprintFormCss} from './BlueprintForm.css.ts';
import {Text, TextField} from 'monday-ui-react-core';
import {NAME_MAX_LENGTH} from 'bridge/constants.ts';
import {ChecklistItems} from '@/checklist/ChecklistItems.tsx';
import React, {ReactElement, Ref} from 'react';
import {buildItemsProducers} from '@/producers.ts';
import {useTranslation} from 'react-i18next';

/**
 * provides a form to create a new blueprint or edit an existing one
 *
 * @param onSubmit
 * @param onCancel
 * @param submitBtnRef
 * @param defaultValue
 * @constructor
 */
export function BlueprintForm({onSubmit, submitBtnRef, defaultValue}: {
    onSubmit: (blueprint: BlueprintCreatePayload) => void,
    submitBtnRef?: Ref<HTMLButtonElement>,
    defaultValue?: BlueprintCreatePayload}): ReactElement {
  const {t} = useTranslation('blueprint');
  const {control, setValue, handleSubmit, formState: {errors}} = useForm<BlueprintCreatePayload>({
    resolver: zodResolver(blueprintCreatePayloadSchema),
    defaultValues: defaultValue && {
      name: defaultValue.name,
      items: defaultValue.items,
    },
  });
  return (
    <form className={blueprintFormCss}>
      <Text size="small"
        weight="bold">{t('form.name')}</Text>
      <Controller
        name="name"
        control={control}
        render={({field}) => <TextField
          {...field}
          required
          size={TextField.sizes.SMALL}
          placeholder={t('form.name.placeholder')}
          validation={{status: errors.name?.message ? 'error' : undefined, text: t(errors.name?.message || '')}}
          maxLength={NAME_MAX_LENGTH}/>
        }
      />
      <Text size="small"
        weight="bold">{t('form.items')}</Text>
      <Controller
        name="items"
        control={control}
        render={({field}) => {
          const {moveItem, deleteItem, addItem, updateItem} = buildItemsProducers(field.value);
          return <div>
            <ChecklistItems
              onMoveItem={(fromId, toId) => setValue('items', moveItem(fromId, toId))}
              onDeleteItem={(id) => setValue('items', deleteItem(id))}
              onAddItem={(title) => setValue('items', addItem(title))}
              onChangeItem={(id, update) => setValue('items', updateItem(id, update))}
              defaultValue={field.value}/>
            {errors.items?.message && <Text size="small"
              className={'error-text'}>{t(errors.items?.message)}</Text>}
          </div>;
        }}
      />
      <button hidden
        ref={submitBtnRef}
        onClick={handleSubmit(onSubmit)}
        type="submit"/>
    </form>
  );
}
