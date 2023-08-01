import {httpBatchLink} from '@trpc/client';
import type {AppRouter} from 'functions/checklist.router.ts';
import {useMonday} from './use-monday.ts';
import {createTRPCReact} from '@trpc/react-query';

const checklistFunctionUrl = import.meta.env.__FUNCTION_URL_CHECKLIST__;
export const trpc = createTRPCReact<AppRouter>();
export const useTrpcClient = () => {
  const monday = useMonday();
  return trpc.createClient({
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


