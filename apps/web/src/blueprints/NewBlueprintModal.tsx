import React, {useRef} from 'react';
import {BlueprintForm} from '../components/BlueprintForm.tsx';
import {Button} from 'monday-ui-react-core';
import {trpc} from '../trpc.ts';
import {BlueprintCreatePayload} from 'functions/firestore.schemas.ts';
import {useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {getQueryKey} from '@trpc/react-query';
import {Modal} from '../components/Modal.tsx';
import {AddSmall} from 'monday-ui-react-core/icons';

type Props = {};

export function NewBlueprintModal({}: Props) {
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

  return <Modal headline="Create new blueprint"
    controls={<div className="button-controls">
      <Button
        kind={Button.kinds.SECONDARY}
        size={Button.sizes.SMALL}
        onClick={() => navigate('/module/blueprints')}>Back</Button>
      <Button
        loading={isLoading}
        onClick={() => submitBtnRef.current?.click()}
        rightIcon={AddSmall}
        type={Button.types.SUBMIT}
        size={Button.sizes.SMALL}>Create blueprint</Button></div>}
  >
    <BlueprintForm
      submitBtnRef={submitBtnRef}
      onSubmit={onSubmit}/>
  </Modal>;
}
