import React from 'react';
import {Table} from 'antd';
import {Link, Text} from 'monday-ui-react-core';
import {BlueprintInFirestore, WithId} from 'functions/firestore.schemas.ts';
import {useTranslation} from 'react-i18next';

type Props = {
    onSelect: (blueprintId: string) => void;
    blueprints: WithId<BlueprintInFirestore>[];
    scroll?: {y: number};
};

/**
 * Table of blueprints, with name, number of items and creation date.
 * sorts in client and relies on the fact that we lazily skipped pagination for blueprints
 * @param onSelect
 * @param blueprints
 * @param scroll
 * @constructor
 */
export function BlueprintTable({
  onSelect,
  blueprints,
  scroll,
}: Props) {
  const {t} = useTranslation('blueprint');
  return (
    <Table
      scroll={scroll}
      columns={
        [
          {
            title: <Text size='small'>{t('table.head.name')}</Text>,
            dataIndex: 'name',
            key: 'name',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name: string, {key}) => <Link text={name}
              onClick={(e) => {
                e.preventDefault();
                onSelect(key);
              }}/>,
          },
          {
            title: <Text size='small'>{t('table.head.number')}</Text>,
            dataIndex: 'items',
            key: 'items',
            width: 200,
            sorter: (a, b) => a.items - b.items,
            render: (items: number) => <Text size='small'>{items} items</Text>,
          },
          {
            title: <Text size='small'>{t('table.head.created.at')}</Text>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
            render: (createdAt: Date) => <Text size='small'>{createdAt.toLocaleString()}</Text>,
          },
        ]
      }
      pagination={false}
      dataSource={blueprints
          .map((blueprint) => ({
            key: blueprint.id,
            name: blueprint.name,
            items: blueprint.items.length,
            createdAt: blueprint.createdAt,
          }))}
      bordered
    />
  );
}
