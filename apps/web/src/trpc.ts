import {httpBatchLink} from '@trpc/client';
import type {AppRouter} from 'functions/router.ts';
import {useMonday} from './use-monday.ts';
import {createTRPCReact} from '@trpc/react-query';
import superjson from 'superjson';

/**
 * points to the checklist second gen gcp function url
 */
const checklistFunctionUrl = import.meta.env.__FUNCTION_URL_CHECKLIST__;

/**
 * creates a trpc client suitable for usage in react. should be used to access trpc functionality in a type safe manner
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * bare trpc client to be injected into trpc.Provider. configures the client to use the checklistFunctionUrl with the monday session token
 * @returns {TRPCClient<AppRouter>}
 */
export const useTrpcClient = () => {
  const monday = useMonday();
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: checklistFunctionUrl,
        headers: () => ({
          Authorization: monday.sessionToken ? 'JWT ' + monday.sessionToken : '',
        }),
      }),
    ],
  });
};

