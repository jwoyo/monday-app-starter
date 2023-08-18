import React from 'react';
import {trpc} from '../trpc.ts';
import {AttentionBox} from 'monday-ui-react-core';
import {Info} from 'monday-ui-react-core/icons';
import {listBlueprintsClassName} from './Blueprints.css.tsx';
import {useSearchParams} from 'react-router-dom';
import {Modal} from '@/misc/Modal.tsx';
import {BlueprintTable} from '@/blueprints/BlueprintTable.tsx';
import {BlueprintListSkeleton} from '@/blueprints/BlueprintListSkeleton.tsx';
import monday from 'monday-sdk-js';

/**
 * modal that is used to pick a blueprint for a checklist.
 * @return {JSX.Element}
 */
export function PickBlueprintModal() {
  const {data, isLoading, isError} = trpc.blueprint.getAllBlueprints.useQuery();
  const [params] = useSearchParams();
  const itemId = params.get('itemId');
  const {mutate} = trpc.blueprint.applyBlueprint.useMutation({
    onSuccess: () => {
      monday().execute('closeAppFeatureModal');
    },
  });

  if (isLoading) {
    return <BlueprintListSkeleton/>;
  }

  if (isError) {
    return <AttentionBox title="Could not fetch blueprints"
      type={AttentionBox.types.DANGER}
      text="If you see this message we could not fetch your blueprints. Please try again later or contact app support."
    />;
  }

  if (!itemId) {
    return <AttentionBox title="Could not find item context"
      type={AttentionBox.types.DANGER}
      text="If you see this message we could determine the correct item context. Please try again later or contact app support."
    />;
  }

  return <Modal
    headline="Use a blueprint">
    <div className={listBlueprintsClassName}>
      <AttentionBox title={'How to use blueprints?'}
        icon={Info}>
        Click a blueprint from below to use its items for the current checklist. Beware that this will overwrite your current checklist.
      </AttentionBox>
      <BlueprintTable blueprints={data}
        onSelect={(blueprintId) => mutate({blueprintId, itemId: Number(itemId)})}
        scroll={{y: 300}}/>
    </div>
  </Modal>;
}
