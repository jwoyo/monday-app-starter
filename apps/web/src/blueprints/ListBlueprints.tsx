import React from 'react';
import {trpc} from '../trpc.ts';
import {AttentionBox, Link, ListItem, Skeleton, Text} from 'monday-ui-react-core';
import {blueprintsSkeletonClassName} from './Blueprints.css.tsx';
import {Table} from 'antd';
type Props = {};

export function ListBlueprints({}: Props) {
  const {data, isLoading, isError} = trpc.blueprint.getAllBlueprints.useQuery();

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

  return <div>
    <Table
      columns={
        [
          {
            title: <Text size='small'>Name</Text>,
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Link text={name}/>,
          },
          {
            title: <Text size='small'>Number of items</Text>,
            dataIndex: 'items',
            key: 'items',
            width: 200,
            render: (items: number) => <Text size='small'>{items} items</Text>,
          },
        ]
      }
      pagination={false}
      dataSource={data
          .map((blueprint) => ({
            key: blueprint.id,
            name: blueprint.name,
            items: blueprint.items.length,
          }))}
      scroll={{y: 440}}
    />
  </div>;
}
