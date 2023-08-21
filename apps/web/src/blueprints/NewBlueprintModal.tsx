import React, {useRef} from 'react';
import {BlueprintForm} from '@/blueprints/BlueprintForm.tsx';
import {AttentionBox, Button} from 'monday-ui-react-core';
import {trpc} from '../trpc.ts';
import {BlueprintCreatePayload} from 'functions/firestore.schemas.ts';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {getQueryKey} from '@trpc/react-query';
import {Modal} from '../misc/Modal.tsx';
import {AddSmall, Info} from 'monday-ui-react-core/icons';
import {useChecklist} from '@/checklist/use-checklist.ts';
import {BlueprintListSkeleton} from '@/blueprints/BlueprintListSkeleton.tsx';
import {useTranslation} from 'react-i18next';

/**
 * modal to create a new blueprint
 * @return {JSX.Element}
 */
export function NewBlueprintModal() {
  const {t} = useTranslation('blueprint');
  const [searchParams] = useSearchParams();
  const fromItemId = searchParams.get('fromItemId') || false;
  const queryClient = useQueryClient();
  const blueprintQueryKey = getQueryKey(trpc.blueprint);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const {mutate, isLoading} = trpc.blueprint.createBlueprint.useMutation({
    onSuccess: () => {
      queryClient.cancelQueries(blueprintQueryKey);
    },
    onSettled: async () => {
      await queryClient.removeQueries(blueprintQueryKey);
      navigate('/module/blueprints');
    },
  });
  const navigate = useNavigate();
  const onSubmit = (blueprint: BlueprintCreatePayload) => {
    mutate(blueprint);
  };
  const {checklistQuery} = useChecklist();


  if (fromItemId && checklistQuery.isLoading) {
    return <BlueprintListSkeleton/>;
  }

  if (checklistQuery.isError) {
    return <AttentionBox title={t('new.err')}
      text={t('new.err.text')}
      icon={Info}/>;
  }

  return <Modal headline={t('new.title')}
    controls={<div className="button-controls">
      <Button
        kind={Button.kinds.SECONDARY}
        size={Button.sizes.SMALL}
        onClick={() => navigate('/module/blueprints')}>{t('back')}</Button>
      <Button
        loading={isLoading}
        onClick={() => submitBtnRef.current?.click()}
        rightIcon={AddSmall}
        type={Button.types.SUBMIT}
        size={Button.sizes.SMALL}>Create blueprint</Button></div>}
  >
    <BlueprintForm
      defaultValue={fromItemId && checklistQuery.data ? {...checklistQuery.data, name: ''} : undefined}
      submitBtnRef={submitBtnRef}
      onSubmit={onSubmit}/>
  </Modal>;
}
