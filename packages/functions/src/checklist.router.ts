import {checklistTRPC, createContext, middleware} from "./checklist.server";
import * as trpcExpress from "@trpc/server/adapters/express";
import {buildRequireMondayAuthenticationMiddleware} from "./monday.middleware";

const requireMonday = buildRequireMondayAuthenticationMiddleware(middleware);
export const router = checklistTRPC.router({
  asyncTest: checklistTRPC.procedure
    .use(requireMonday)
    .query(async (opts) => {
      return "Success!";
    }),
});

export const checklistExpressMiddleware = trpcExpress.createExpressMiddleware({
  router,
  createContext,
});

