import React, {ReactElement} from 'react';
import {useMonday} from './use-monday.ts';
import {errorMessageStyles} from './App.css.ts';
import {AttentionBox} from 'monday-ui-react-core';
import {Info} from 'monday-ui-react-core/icons';
import {useTranslation} from 'react-i18next';

/**
 * responsible for showing an error message if the app is not opened in monday.com
 * @return {ReactElement}
 */
export function MondayBoundary({children}: { children: ReactElement }) {
  const {t} = useTranslation();
  const {contextQuery, context} = useMonday();
  if (contextQuery.isLoading) {
    // Monday.com postMessage calls seem to load very fast, so we don't need to show a loading indicator.
    return <></>;
  }
  // we won't render children if we don't have a proper context as nearly all components rely on that
  if (contextQuery.isError || (contextQuery.data && !contextQuery.data.data?.app?.id) || !contextQuery.data || !context) {
    return <div className={errorMessageStyles}>
      <AttentionBox title={t('context.err.title')}
        text={t('context.err.text')}
        icon={Info}/>
    </div>;
  }
  return children;
}
