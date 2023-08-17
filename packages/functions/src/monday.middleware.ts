import {TRPCError} from '@trpc/server';
import {verify} from 'jsonwebtoken';
import type {Middleware} from './server';
import {MONDAY_APP_SECRET, MONDAY_APP_SIGNING_SECRET} from './variables';
import {MondayIntegrationWebHookJsonWebTokenDecoded, MondayJsonWebTokenDecoded} from 'bridge/json-web-token.types';
import {getGlobalOAuthTokenByAccountId} from './db';
import {buildMondayGraphQLClientOnBehalfOfUser} from './graphql';
import {SecretParam} from 'firebase-functions/lib/params/types';

/**
 * Build middlewares that require Monday authentication. We pass in the middleware object to reduce circular dependencies.
 *
 * @param {Middleware} middleware The middleware object.
 * @return {{mondayIsUserMiddleware: Middleware, mondayIsAdminMiddleware: Middleware}} The middlewares.
 */
export const buildRequireMondayAuthenticationMiddlewares = (middleware: Middleware) => {
  const baseMondayMiddleware = middleware(async (opts) => {
    const jwt = parseJwtFromAuthorizationHeader<MondayJsonWebTokenDecoded>({
      authorization: opts.ctx.authorization,
      secret: MONDAY_APP_SECRET,
    });
    return opts.next({
      ctx: {
        mondayContext: jwt,
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

export const buildRequireMondayWebtriggerAuthenticationMiddleware = (middleware: Middleware) => {
  return middleware((opts) => {
    const jwt = parseJwtFromAuthorizationHeader<MondayIntegrationWebHookJsonWebTokenDecoded>({
      authorization: opts.ctx.authorization,
      secret: MONDAY_APP_SIGNING_SECRET,
    });
    return opts.next({
      ctx: {
        mondayContext: jwt,
      },
    });
  });
};

/**
 * Parse a monday JWT from an authorization header.
 * @param authorization
 * @param secret
 * @return {MondayJsonWebTokenDecoded | MondayIntegrationWebHookJsonWebTokenDecoded}
 */
function parseJwtFromAuthorizationHeader<T extends MondayJsonWebTokenDecoded | MondayIntegrationWebHookJsonWebTokenDecoded>({
  authorization,
  secret,
}: {
  authorization?: string,
  secret: SecretParam
}) {
  if (!authorization) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }
  const segments = authorization.split(' ');
  const jwt = segments[1] || segments[0];
  const jwtVerified = verify(jwt, secret.value());

  if (typeof jwtVerified === 'string') {
    throw new TRPCError({code: 'BAD_REQUEST'});
  }
  return jwtVerified as T;
}
