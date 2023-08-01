import {className} from './ItemView.css.ts';
import {useMonday} from '../use-monday.ts';
import {trpc} from '../trpc.ts';

/**
 * monday item view
 * @return {ReactElement}
 */
export function ItemView() {
  const {context, sessionToken, settings} = useMonday();
  trpc.getChecklist.useQuery({itemId: context!.itemId});
  return (
    <div className={className}>
            Hey there!
      <pre>{JSON.stringify({context, sessionToken, settings}, null, 2)}</pre>
    </div>
  );
}
