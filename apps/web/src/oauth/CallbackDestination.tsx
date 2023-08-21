import React, {useEffect, useState} from 'react';
import {trpc} from '../trpc.ts';
import {AttentionBox, Skeleton} from 'monday-ui-react-core';
import {ThumbsUp} from 'monday-ui-react-core/icons';
import {useTranslation} from 'react-i18next';

/**
 * This component is responsible for handling the OAuth callback from monday.com.
 * @return {ReactElement}
 */
export function CallbackDestination() {
  const {t} = useTranslation();
  const {mutate, isSuccess, isError} = trpc.OAuth.exchangeCode.useMutation({});
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  useEffect(function reactToCallbackOnComponentLoad() {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    if (error) {
      const errorDescription = searchParams.get('error_description');
      setRejectionError(error + (errorDescription ? ': ' + errorDescription : ''));
      return;
    }
    const code = searchParams.get('code');
    if (!code) {
      return;
    }
    mutate({code});
  }, [mutate]);

  useEffect(function closeWindowOnSuccess() {
    if (isSuccess) {
      window.opener?.postMessage('success', '*');
      window.close();
    }
  }, [isSuccess]);

  if (isSuccess) {
    return <AttentionBox
      title={t('oauth.success.title')}
      text={t('oauth.success.text')}
      type={AttentionBox.types.SUCCESS}
      icon={ThumbsUp}/>;
  }

  if (isError) {
    return <AttentionBox
      title={t('oauth.err.title')}
      text={t('oauth.err.text')}
      type={AttentionBox.types.DANGER}/>;
  }

  if (rejectionError) {
    return <AttentionBox title={rejectionError}
      text={t('oauth.err.retry.text')}
      type={AttentionBox.types.DANGER}/>;
  }

  return (
    <Skeleton width={660}
      height={84}/>
  );
}

