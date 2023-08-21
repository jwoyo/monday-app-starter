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
import {useTranslation} from 'react-i18next';

/**
 * modal that is used to pick a blueprint for a checklist.
 * @return {JSX.Element}
 */
export function PickBlueprintModal() {
  const {t} = useTranslation('blueprint');
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
    return <AttentionBox title={t('list.err')}
      type={AttentionBox.types.DANGER}
      text={t('list.err.text')}
    />;
  }

  if (!itemId) {
    return <AttentionBox title={t('pick.err')}
      type={AttentionBox.types.DANGER}
      text={t('pick.err.text')}
    />;
  }

  return <Modal
    headline={t('pick.title')}>
    <div className={listBlueprintsClassName}>
      <AttentionBox title={t('pick.help.title')}
        icon={Info}>
        {t('pick.help.text')}
      </AttentionBox>
      <BlueprintTable blueprints={data}
        onSelect={(blueprintId) => mutate({blueprintId, itemId: Number(itemId)})}
        scroll={{y: 300}}/>
    </div>
  </Modal>;
}
