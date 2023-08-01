import {TRPCError} from '@trpc/server';
import {verify} from 'jsonwebtoken';
import type {Middleware} from './server';
import {MONDAY_APP_SECRET} from './variables';
import {MondayJsonWebTokenDecoded} from 'bridge/json-web-token.types';
import {getGlobalOAuthTokenByAccountId} from './db';
import {buildMondayGraphQLClientOnBehalfOfUser} from './graphql';

/**
 * Build middlewares that require Monday authentication. We pass in the middleware object to reduce circular dependencies.
 *
 * @param {Middleware} middleware The middleware object.
 * @return {{mondayIsUserMiddleware: Middleware, mondayIsAdminMiddleware: Middleware}} The middlewares.
 */
export const buildRequireMondayAuthenticationMiddlewares = (middleware: Middleware) => {
  const baseMondayMiddleware = middleware(async (opts) => {
    const authorization = opts.ctx.authorization;
    if (!authorization) {
      throw new TRPCError({code: 'UNAUTHORIZED'});
    }
    const jwt = authorization.split(' ')[1];
    const jwtVerified = verify(jwt, MONDAY_APP_SECRET.value());
    if (typeof jwtVerified === 'string') {
      throw new TRPCError({code: 'BAD_REQUEST'});
    }
    const mondayJwtVerified = jwtVerified as MondayJsonWebTokenDecoded;
    return opts.next({
      ctx: {
        mondayContext: mondayJwtVerified,
        mondayToken: jwt,
      },
    });
  });

  /**
   * this middleware requires that the user is signed up for OAuth, which is needed for backend calls to the monday.com api on behalf of the user.
   */
  const mondayIsOAuthUserMiddleware = baseMondayMiddleware.unstable_pipe(async (opts) => {
    const userOAuth = await getGlobalOAuthTokenByAccountId({
      accountId: opts.ctx.mondayContext.dat.account_id,
      userId: opts.ctx.mondayContext.dat.user_id,
    });
    if (!userOAuth) {
      throw new TRPCError({code: 'UNAUTHORIZED', message: 'User is not signed up for OAuth.'});
    }
    return opts.next({
      ctx: {
        mondayClient: buildMondayGraphQLClientOnBehalfOfUser(userOAuth.access_token),
      },
    });
  });

  const mondayIsUserMiddleware = baseMondayMiddleware.unstable_pipe((opts) => {
    if (opts.ctx.mondayContext.dat.is_view_only || !opts.ctx.mondayContext.dat.account_id) {
      throw new TRPCError({code: 'UNAUTHORIZED'});
    }
    return opts.next();
  });

  const mondayIsAdminMiddleware = baseMondayMiddleware.unstable_pipe((opts) => {
    if (!opts.ctx.mondayContext.dat.is_admin || !opts.ctx.mondayContext.dat.account_id) {
      throw new TRPCError({code: 'UNAUTHORIZED'});
    }
    return opts.next();
  });

  return {
    mondayIsUserMiddleware,
    mondayIsOAuthUserMiddleware: mondayIsUserMiddleware.unstable_pipe(mondayIsOAuthUserMiddleware),
    mondayIsAdminMiddleware,
    mondayIsOAuthAdminMiddleware: mondayIsAdminMiddleware.unstable_pipe(mondayIsOAuthUserMiddleware),
  };
};
