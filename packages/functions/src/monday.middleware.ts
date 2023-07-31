import {TRPCError} from "@trpc/server";
import {verify} from "jsonwebtoken";
import type {Middleware} from "./checklist.server";
import {MONDAY_APP_SECRET} from "./variables";
import {MondayJsonWebTokenDecoded} from "bridge/json-web-token.types";

/**
 * Build middlewares that require Monday authentication. We pass in the middleware object to reduce circular dependencies.
 *
 * @param middleware {middleware} The middleware object.
 * @return {{mondayIsUserMiddleware: Middleware, mondayIsAdminMiddleware: Middleware}} The middlewares.
 */
export const buildRequireMondayAuthenticationMiddlewares = (middleware: Middleware) => {
  const baseMondayMiddleware = middleware((opts) => {
    const authorization = opts.ctx.authorization;
    if (!authorization) {
      throw new TRPCError({code: "UNAUTHORIZED"});
    }
    const jwt = authorization.split(" ")[1];
    const jwtVerified = verify(jwt, MONDAY_APP_SECRET.value());
    if (typeof jwtVerified === "string") {
      throw new TRPCError({code: "BAD_REQUEST"});
    }
    const mondayJwtVerified = jwtVerified as MondayJsonWebTokenDecoded;
    return opts.next({
      ctx: {
        mondayContext: mondayJwtVerified,
        mondayToken: jwt,
      },
    });
  });
  const mondayIsUserMiddleware = baseMondayMiddleware.unstable_pipe((opts) => {
    if (opts.ctx.mondayContext.dat.is_view_only || !opts.ctx.mondayContext.dat.account_id) {
      throw new TRPCError({code: "UNAUTHORIZED"});
    }
    return opts.next();
  });

  const mondayIsAdminMiddleware = baseMondayMiddleware.unstable_pipe((opts) => {
    if (!opts.ctx.mondayContext.dat.is_admin || !opts.ctx.mondayContext.dat.account_id) {
      throw new TRPCError({code: "UNAUTHORIZED"});
    }
    return opts.next();
  });

  return {
    mondayIsUserMiddleware,
    mondayIsAdminMiddleware,
  };
};
