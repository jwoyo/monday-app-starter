import * as trpcExpress from '@trpc/server/adapters/express';
import type {inferAsyncReturnType} from '@trpc/server';
import {initTRPC} from '@trpc/server';
import {buildRequireMondayAuthenticationMiddlewares} from './monday.middleware';

type Context = inferAsyncReturnType<typeof createContext>;
export const createContext = ({req}: trpcExpress.CreateExpressContextOptions): { authorization?: string } => {
  const authorization = req.headers.authorization;
  return ({
    authorization,
  });
};
export const trpc = initTRPC.context<Context>().create();
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;

const {mondayIsUserMiddleware, mondayIsAdminMiddleware, mondayIsOAuthUserMiddleware} = buildRequireMondayAuthenticationMiddlewares(middleware);
export const mondaySessionUserProcedure = publicProcedure.use(mondayIsUserMiddleware);
export const mondaySessionAdminProcedure = publicProcedure.use(mondayIsAdminMiddleware);
export const mondayOAuthUserProcedure = publicProcedure.use(mondayIsOAuthUserMiddleware);

export type Middleware = typeof middleware;
