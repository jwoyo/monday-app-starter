import * as trpcExpress from "@trpc/server/adapters/express";
import type {inferAsyncReturnType} from "@trpc/server";
import {initTRPC} from "@trpc/server";
import {buildRequireMondayAuthenticationMiddlewares} from "./monday.middleware";

type Context = inferAsyncReturnType<typeof createContext>;
export const createContext = ({req}: trpcExpress.CreateExpressContextOptions): { authorization?: string } => {
  const authorization = req.headers.authorization;
  return ({
    authorization,
  });
};
export const checklistTRPC = initTRPC.context<Context>().create();
export const middleware = checklistTRPC.middleware;
export const publicProcedure = checklistTRPC.procedure;

const {mondayIsUserMiddleware, mondayIsAdminMiddleware} =
    buildRequireMondayAuthenticationMiddlewares(middleware);
export const mondayUserProcedure = publicProcedure.use(mondayIsUserMiddleware);
export const mondayAdminProcedure = publicProcedure.use(mondayIsAdminMiddleware);

export type Middleware = typeof middleware;
