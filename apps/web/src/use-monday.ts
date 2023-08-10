import {useQuery} from '@tanstack/react-query';
import monday from 'monday-sdk-js';
import {
  MondayClientContext,
  MondayClientSessionToken,
  MondayClientSettings,
} from 'bridge/monday-client-context.types.ts';

/**
 * custom hook that uses the monday-sdk-js to get the context, settings, and sessionToken via postMessage.
 * @return {context}
 */
export function useMonday() {
  const context = useQuery({
    queryKey: ['monday', 'context'],
    queryFn: () => monday().get('context') as Promise<MondayClientContext>,
  });
  const settings = useQuery({
    queryKey: ['monday', 'settings'],
    queryFn: () => monday().get('settings') as Promise<MondayClientSettings>,
  });
  const sessionToken = useQuery({
    queryKey: ['monday', 'sessionToken'],
    queryFn: () => monday().get('sessionToken') as Promise<MondayClientSessionToken>,
  });
  return {
    contextQuery: context,
    settingsQuery: settings,
    sessionTokenQuery: sessionToken,
    context: context.data?.data,
    settings: settings.data?.data,
    sessionToken: sessionToken.data?.data,
  };
}

/**
 * Convenience hook to get the defined monday context that throws an error if it doesn't exist.
 */
export function useMondayContext() {
  const {context} = useMonday();
  if (!context) throw new Error('No monday context found');
  return context;
}
