import React from 'react';
import {BlueprintForm} from '../components/BlueprintForm.tsx';
import {Button} from 'monday-ui-react-core';
import {trpc} from '../trpc.ts';
import {BlueprintInFirestore} from 'functions/firestore.schemas.ts';
type Props = {};

export function NewBlueprint({}: Props) {
  const {mutate, isLoading} = trpc.blueprint.createBlueprint.useMutation();
  const onSubmit = (blueprint: BlueprintInFirestore) => {
    mutate(blueprint);
  };
  return <BlueprintForm submitElement={
    (onSubmit) => <Button loading={isLoading} onClick={onSubmit} type={Button.types.SUBMIT} size={Button.sizes.SMALL}>Create blueprint</Button>
  } onSubmit={onSubmit}/>;
}
