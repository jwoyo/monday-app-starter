import React, {useState} from 'react';
import {Button} from 'monday-ui-react-core';
import {trpc} from '../trpc.ts';
import {useQueryClient} from '@tanstack/react-query';
import {getQueryKey} from '@trpc/react-query';
import {useNavigate} from 'react-router-dom';

type Props = {blueprintId: string};

export function DeleteBlueprintButton({blueprintId}: Props) {
  const queryClient = useQueryClient();
  const blueprintQueryKey = getQueryKey(trpc.blueprint);
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const {mutate, isLoading} = trpc.blueprint.deleteBlueprint.useMutation({
    onSuccess: () => {
      queryClient.cancelQueries(blueprintQueryKey);
    },
    onSettled: async () => {
      await queryClient.removeQueries(blueprintQueryKey);
      navigate('/module/blueprints');
    },
  });

  if (isUnlocked) {
    return <Button
      loading={isLoading}
      onClick={() => mutate({blueprintId})}
      kind={Button.kinds.PRIMARY}
      color={Button.colors.NEGATIVE}
      size={Button.sizes.SMALL}
    > Delete blueprint (click again to confirm)</Button>;
  }

  return (
    <Button
      onClick={() => setIsUnlocked(true)}
      kind={Button.kinds.SECONDARY}
      size={Button.sizes.SMALL}
    >
            Delete blueprint</Button>
  );
}

