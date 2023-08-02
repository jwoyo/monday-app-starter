import React, {ReactElement, useState} from 'react';
import {trpc} from '../trpc.ts';
import {useMutation} from '@tanstack/react-query';
import {errorMessageStyles, signUpMessageChildStyles, signUpMessageStyles} from '../App.css.ts';
import {AttentionBox, Button, Text} from 'monday-ui-react-core';
import {Card} from 'antd';


/**
 * responsible for showing a sign-up message if we do not have an access token for the current user
 * @return {ReactElement}
 */
export function MondayOAuthBoundary({children}: { children: ReactElement }) {
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
      <AttentionBox title="Connection error"
        type={AttentionBox.types.DANGER}
        text="Could not connect to server. This should not happen. Please reload or contact app support."/>
    </div>;
  }
  if (isSignedUp.data === false) {
    return <Card >
      <div className={signUpMessageStyles}>
        <div className={signUpMessageChildStyles}>
          <Text>
            Welcome! checklists app is ready to use. Connect you account to get started.
          </Text>
          <div>
            <Button color={Button.colors.BRAND} onClick={() => signUp.mutate()}>Get started</Button>
          </div>
        </div>
      </div>
    </Card>;
  }
  return children;
}
