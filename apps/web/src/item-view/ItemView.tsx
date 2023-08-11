import {Checklist} from '@/checklist/Checklist.tsx';
import {itemViewClassName, itemViewControlsClassName} from './ItemView.css.ts';
import {Divider} from 'monday-ui-react-core';
import monday from 'monday-sdk-js';
import {useMondayContext} from '@/use-monday.ts';
import {trpc} from '@/trpc.ts';
import {ChecklistOptionsButton} from '@/checklist/ChecklistOptionsButton.tsx';

/**
 * monday item view
 * @return {ReactElement}
 */
export function ItemView() {
  const {itemId} = useMondayContext();
  const {refetch} = trpc.checklist.get.useQuery({itemId});
  const onOpenModal = async (path: string) =>
    monday().execute('openAppFeatureModal', {
      url: import.meta.env.__MONDAY_APP_HOSTING_URL__ + path,
      urlParams: {itemId: itemId},
      width: 800,
      height: 600,
    }).then(() => path === '/module/blueprints/use' && handleBlueprintPick());

  const handleBlueprintPick = () => {
    refetch();
  };

  return <div className={itemViewClassName}>
    <Checklist/>
    <Divider direction={Divider.directions.HORIZONTAL} />
    <div className={itemViewControlsClassName}>
      <div>
        <ChecklistOptionsButton onOpenModal={onOpenModal}/>
      </div>
    </div>
  </div>;
}
