import React, {ReactElement} from 'react';
import {trpc} from '../trpc.ts';
import {useMutation} from '@tanstack/react-query';
import {errorMessageStyles, signUpMessageChildStyles, signUpMessageStyles} from '../App.css.ts';
import {AttentionBox, Button, Heading, Text} from 'monday-ui-react-core';


/**
 * responsible for showing a sign-up message if we do not have an access token for the current user
 * @return {ReactElement}
 */
export function MondayOAuthBoundary({children}: { children: ReactElement }) {
  const isSignedUp = trpc.OAuth.isSignedUp.useQuery();
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
    return <div className={signUpMessageStyles}>
      <div className={signUpMessageChildStyles}>
        <Heading value="Welcome to checklists" size={Heading.sizes.SMALL}/>
        <Text>
                    Hey there! checklists is ready to use. Connect you account to get started.
        </Text>
        <Button onClick={() => signUp.mutate()}>Connect account</Button>
      </div>
    </div>;
  }
  return children;
}
