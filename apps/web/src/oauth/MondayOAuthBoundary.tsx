import React, {ReactElement, useState} from 'react';
import {trpc} from '../trpc.ts';
import {useMutation} from '@tanstack/react-query';
import {errorMessageStyles, signUpMessageChildStyles, signUpMessageStyles} from '../App.css.ts';
import {AttentionBox, Button, Text} from 'monday-ui-react-core';
import {Card} from 'antd';
import {useTranslation} from 'react-i18next';

/**
 * responsible for showing a sign-up message if we do not have an access token for the current user
 * @return {ReactElement}
 */
export function MondayOAuthBoundary({children}: { children: ReactElement }) {
  const {t} = useTranslation();
  const [hasBeenSuccessFullySignedUp, setHasBeenSuccessFullySignedUp] = useState(false);
  const isSignedUp = trpc.OAuth.isSignedUp.useQuery(undefined, {
    enabled: !hasBeenSuccessFullySignedUp,
    onSettled: (data) => {
      setHasBeenSuccessFullySignedUp(data === true);
    },
  });
  const signUp = useMutation(async () => {
    const redirectUri = import.meta.env.__MONDAY_APP_HOSTING_URL__ + '/oauth/callback';
    const clientId = import.meta.env.__MONDAY_APP_CLIENT_ID__;
    const url = 'https://auth.monday.com/oauth2/authorize?' + new URLSearchParams({client_id: clientId, redirect_uri: redirectUri}).toString();
    const popup = window.open(url);
    if (!popup) {
      return;
    }
    popup.onmessage = (event) => {
      if (event.data !== 'success') {
        return;
      }
      isSignedUp.refetch();
    };
  });
  if (isSignedUp.isLoading) {
    // we could show a loading indicator here
    return <></>;
  }
  if (isSignedUp.isError) {
    return <div className={errorMessageStyles}>
      <AttentionBox title={t('oauth.err.connection.title')}
        type={AttentionBox.types.DANGER}
        text={t('oauth.err.connection.text')}/>
    </div>;
  }
  if (isSignedUp.data === false) {
    return <Card >
      <div className={signUpMessageStyles}>
        <div className={signUpMessageChildStyles}>
          <Text>
            {t('oauth.start.text')}
          </Text>
          <div>
            <Button color={Button.colors.BRAND}
              onClick={() => signUp.mutate()}>{t('oauth.start.button.text')}</Button>
          </div>
        </div>
      </div>
    </Card>;
  }
  return children;
}
