import {Checklist} from '@/checklist/Checklist.tsx';
import {itemViewClassName, itemViewControlsClassName} from './ItemView.css.ts';
import {Button, Divider} from 'monday-ui-react-core';
import {Download, Upload} from 'monday-ui-react-core/icons';
import monday from 'monday-sdk-js';
import {useMonday, useMondayContext} from '@/use-monday.ts';
import {useQueryClient} from '@tanstack/react-query';
import {getQueryKey} from '@trpc/react-query';
import {trpc} from '@/trpc.ts';

/**
 * monday item view
 * @return {ReactElement}
 */
export function ItemView() {
  const {itemId} = useMondayContext();
  const {refetch} = trpc.checklist.get.useQuery({itemId});
  const openModal = async (path: string) =>
    monday().execute('openAppFeatureModal', {
      url: import.meta.env.__MONDAY_APP_HOSTING_URL__ + path,
      urlParams: {itemId: itemId},
      width: 800,
      height: 600,
    });

  const handleBlueprintPick = () => {
    refetch();
  };

  return <div className={itemViewClassName}>
    <Checklist/>
    <Divider direction={Divider.directions.HORIZONTAL} />
    <div className={itemViewControlsClassName}>
      <Button leftIcon={Download} size={Button.sizes.XS} kind={Button.kinds.TERTIARY} onClick={() => openModal('/module/blueprints/create')}>Save as blueprint</Button>
      <Button leftIcon={Upload} size={Button.sizes.XS} kind={Button.kinds.TERTIARY} onClick={() => openModal('/module/blueprints/use').then(handleBlueprintPick)}>Load from blueprint</Button>
    </div>
  </div>;
}
