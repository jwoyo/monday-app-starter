import * as trpcExpress from "@trpc/server/adapters/express";
import type {inferAsyncReturnType} from "@trpc/server";
import {initTRPC} from "@trpc/server";
import {router} from "./checklist.router";

type Context = inferAsyncReturnType<typeof createContext>;
export const createContext = ({req}: trpcExpress.CreateExpressContextOptions): { authorization?: string } => {
  const authorization = req.headers.authorization;
  return ({
    authorization,
  });
};
export const checklistTRPC = initTRPC.context<Context>().create();
export const middleware = checklistTRPC.middleware;
export type AppRouter = typeof router;
export type Middleware = typeof middleware;

