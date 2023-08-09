import React from 'react';
import {trpc} from '../trpc.ts';
import {AttentionBox, Button, Label, Link, Skeleton, Text} from 'monday-ui-react-core';
import {blueprintsSkeletonClassName, listBlueprintsClassName} from './Blueprints.css.tsx';
import {Table} from 'antd';
import {useNavigate} from 'react-router-dom';
import {AddSmall} from 'monday-ui-react-core/icons';
import {Modal} from '@/misc/Modal.tsx';

type Props = {};

export function ListBlueprintsModal({}: Props) {
  const {data, isLoading, isError} = trpc.blueprint.getAllBlueprints.useQuery();
  const navigate = useNavigate();
  if (isLoading) {
    return <div className={blueprintsSkeletonClassName}>
      <Skeleton height={20} width={300}/>
      <Skeleton height={20} width={280}/>
      <Skeleton height={20} width={280}/>
      <Skeleton height={20} width={350}/>
      <Skeleton height={20} width={310}/>
    </div>;
  }

  if (isError) {
    return <AttentionBox title="Could not fetch blueprints"
      type={AttentionBox.types.DANGER}
      text="If you see this message we could not fetch your blueprints. Please try again later or contact app support."
    />;
  }

  return <Modal
    headline="Your checklist blueprints"
    controls={<Button size={Button.sizes.SMALL} rightIcon={AddSmall}
      onClick={() => navigate('/module/blueprints/create')}>Add a blueprint</Button>
    }>
    <div className={listBlueprintsClassName}>
      <Table
        scroll={{y: 380}}
        columns={
          [
            {
              title: <Text size='small'>Name</Text>,
              dataIndex: 'name',
              key: 'name',
              render: (name: string, {key}) => <Link text={name} onClick={(e) => {
                e.preventDefault();
                navigate('/module/blueprints/' + key);
              }}/>,
            },
            {
              title: <Text size='small'>Number of items</Text>,
              dataIndex: 'items',
              key: 'items',
              width: 200,
              render: (items: number) => <Text size='small'>{items} items</Text>,
            },
            {
              title: <Text size='small'>Created at</Text>,
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 200,
              render: (createdAt: Date) => <Text size='small'>{createdAt.toLocaleString()}</Text>,
            },
          ]
        }
        pagination={false}
        dataSource={data
            .map((blueprint) => ({
              key: blueprint.id,
              name: blueprint.name,
              items: blueprint.items.length,
              createdAt: blueprint.createdAt,
            }))}
        bordered
      />
    </div>
  </Modal>;
}
