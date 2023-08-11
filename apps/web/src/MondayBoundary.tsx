import React, {ReactElement} from 'react';
import {useMonday} from './use-monday.ts';
import {errorMessageStyles} from './App.css.ts';
import {AttentionBox} from 'monday-ui-react-core';
import {Info} from 'monday-ui-react-core/icons';

/**
 * responsible for showing an error message if the app is not opened in monday.com
 * @return {ReactElement}
 */
export function MondayBoundary({children}: { children: ReactElement }) {
  const {contextQuery} = useMonday();
  if (contextQuery.isLoading) {
    // Monday.com postMessage calls seem to load very fast, so we don't need to show a loading indicator.
    return <></>;
  }
  if (contextQuery.isError || (contextQuery.data && !contextQuery.data.data?.app?.id) || !contextQuery.data) {
    return <div className={errorMessageStyles}>
      <AttentionBox title="No monday.com context found"
        text="If you see this message you likely opened this application outside of monday.com"
        icon={Info}/>
    </div>;
  }
  return children;
}
