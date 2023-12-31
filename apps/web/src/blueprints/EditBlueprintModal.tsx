import React, {useRef} from 'react';
import {AttentionBox, Button} from 'monday-ui-react-core';
import {trpc} from '../trpc.ts';
import {BlueprintCreatePayload} from 'functions/firestore.schemas.ts';
import {useNavigate, useParams} from 'react-router-dom';
import {getQueryKey} from '@trpc/react-query';
import {useQueryClient} from '@tanstack/react-query';
import {Modal} from '../misc/Modal.tsx';
import {Edit} from 'monday-ui-react-core/icons';
import {DeleteBlueprintButton} from './DeleteBlueprintButton.tsx';
import {BlueprintForm} from '@/blueprints/BlueprintForm.tsx';
import {useTranslation} from 'react-i18next';

/**
 * modal to edit a blueprint, identified by the blueprintId in the URL
 * @return {JSX.Element}
 */
export function EditBlueprintModal() {
  const {t} = useTranslation('blueprint');
  const {blueprintId} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const blueprintQueryKey = getQueryKey(trpc.blueprint.getAllBlueprints);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const {mutate, isLoading} = trpc.blueprint.updateBlueprint.useMutation({
    onMutate: () => {
      queryClient.cancelQueries(blueprintQueryKey);
    },
    onSettled: async () => {
      await queryClient.removeQueries(blueprintQueryKey);
      navigate('/module/blueprints');
    },
  });
  const {data} = trpc.blueprint.getAllBlueprints.useQuery();
  const blueprint = data?.find((b) => b.id === blueprintId);
  const onSubmit = (blueprint: BlueprintCreatePayload) => {
    if (!blueprintId) {
      console.warn('Blueprint ID is not set. This should not happen.');
      return;
    }
    mutate({...blueprint, id: blueprintId});
  };
  if (!blueprint) {
    return <AttentionBox>
      {t('err.fetching')}
    </AttentionBox>;
  }
  return <Modal headline="Edit blueprint"
    controls={<div className="button-controls">
      <Button
        kind={Button.kinds.SECONDARY}
        size={Button.sizes.SMALL}
        onClick={() => navigate('/module/blueprints')}>{t('back')}</Button>
      <Button
        loading={isLoading}
        onClick={() => submitBtnRef.current?.click()}
        rightIcon={Edit}
        type={Button.types.SUBMIT}
        size={Button.sizes.SMALL}>{t('update')}</Button></div>}
    secondaryControls={<DeleteBlueprintButton blueprintId={blueprint.id}/>}
  >
    <BlueprintForm
      defaultValue={blueprint}
      submitBtnRef={submitBtnRef}
      onSubmit={onSubmit}/>
  </Modal>;
}
