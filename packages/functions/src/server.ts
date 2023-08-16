import * as trpcExpress from '@trpc/server/adapters/express';
import type {inferAsyncReturnType} from '@trpc/server';
import {initTRPC} from '@trpc/server';
import {buildRequireMondayAuthenticationMiddlewares} from './monday.middleware';
import superjson from 'superjson';

/**
 * context object that is common to all procedures. specific procedures may add more properties to this object.
 */
type Context = inferAsyncReturnType<typeof createContext>;

/**
 * creates the context object for a request.
 * @param req
 * @return {{authorization: string}} The context object.
 */
export const createContext = ({req}: trpcExpress.CreateExpressContextOptions): { authorization?: string } => {
  const authorization = req.headers.authorization;
  return ({
    authorization,
  });
};
/**
 * configures trpc to use superjson for serialization on all procedures.
 */
export const trpc = initTRPC.context<Context>().create({
  transformer: superjson,
});
/**
 * the middleware object. This object is used to build middlewares.
 */
export const middleware = trpc.middleware;
/**
 * the public procedure. This procedure is not protected by any authentication middleware.
 */
export const publicProcedure = trpc.procedure;

const {mondayIsUserMiddleware, mondayIsAdminMiddleware, mondayIsOAuthUserMiddleware} = buildRequireMondayAuthenticationMiddlewares(middleware);
/**
 * procedure that requires that the user is a user in the given account. this doesn't guarantee that the user is signed up (went throw the OAuth 2.0 dance) and probably should only be used to check if the user is signed up.
 */
export const mondaySessionUserProcedure = publicProcedure.use(mondayIsUserMiddleware);
/**
 * procedure that requires that the user is signed up (went throw the OAuth 2.0 dance) and an admin in the given account.
 */
export const mondaySessionAdminProcedure = publicProcedure.use(mondayIsAdminMiddleware);
/**
 * procedure that requires that the user is signed up (went throw the OAuth 2.0 dance) and a user in the given account.
 */
export const mondayOAuthUserProcedure = publicProcedure.use(mondayIsOAuthUserMiddleware);

export type Middleware = typeof middleware;
