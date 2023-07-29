import {TRPCError} from "@trpc/server";
import {verify} from "jsonwebtoken";
import type {Middleware} from "./checklist.server";
import {MONDAY_APP_SECRET} from "./secrets";
import {MondayJsonWebTokenDecoded} from "bridge/json-web-token.types";
export const buildRequireMondayAuthenticationMiddleware = (middleware: Middleware) => middleware((opts) => {
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
    },
  });
});
