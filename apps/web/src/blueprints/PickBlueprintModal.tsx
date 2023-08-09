import React from 'react';
import {trpc} from '../trpc.ts';
import {AttentionBox, Button} from 'monday-ui-react-core';
import {Info} from 'monday-ui-react-core/icons';
import {listBlueprintsClassName} from './Blueprints.css.tsx';
import {useNavigate} from 'react-router-dom';
import {Modal} from '@/misc/Modal.tsx';
import {BlueprintTable} from '@/blueprints/BlueprintTable.tsx';
import {BlueprintListSkeleton} from '@/blueprints/BlueprintListSkeleton.tsx';

type Props = {};

export function PickBlueprintModal({}: Props) {
  const {data, isLoading, isError} = trpc.blueprint.getAllBlueprints.useQuery();
  const navigate = useNavigate();
  if (isLoading) {
    return <BlueprintListSkeleton/>;
  }

  if (isError) {
    return <AttentionBox title="Could not fetch blueprints"
      type={AttentionBox.types.DANGER}
      text="If you see this message we could not fetch your blueprints. Please try again later or contact app support."
    />;
  }

  return <Modal
    headline="Use a blueprint">
    <div className={listBlueprintsClassName}>
      <AttentionBox title={'How to use blueprints?'} icon={Info}>
        Click a blueprint from below to use its items for the current checklist. Beware that this will overwrite your current checklist.
      </AttentionBox>
      <BlueprintTable blueprints={data} onSelect={(id) => navigate('/module/blueprints/' + id)} scroll={{y: 300}}/>
    </div>
  </Modal>;
}
