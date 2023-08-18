import React from 'react';
import {trpc} from '../trpc.ts';
import {AttentionBox, Button} from 'monday-ui-react-core';
import {listBlueprintsClassName} from './Blueprints.css.tsx';
import {useNavigate} from 'react-router-dom';
import {AddSmall} from 'monday-ui-react-core/icons';
import {Modal} from '@/misc/Modal.tsx';
import {BlueprintTable} from '@/blueprints/BlueprintTable.tsx';
import {BlueprintListSkeleton} from '@/blueprints/BlueprintListSkeleton.tsx';

/**
 * modal to list all blueprints
 * @return {JSX.Element}
 */
export function ListBlueprintsModal() {
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
    headline="Your checklist blueprints"
    controls={<Button size={Button.sizes.SMALL}
      rightIcon={AddSmall}
      onClick={() => navigate('/module/blueprints/create')}>Add a blueprint</Button>
    }>
    <div className={listBlueprintsClassName}>
      <BlueprintTable blueprints={data}
        onSelect={(id) => navigate('/module/blueprints/' + id)}
        scroll={{y: 360}} />
    </div>
  </Modal>;
}
