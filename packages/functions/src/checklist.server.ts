import type * as trpcExpress from "@trpc/server/adapters/express";
import type {inferAsyncReturnType} from "@trpc/server";
import {initTRPC} from "@trpc/server";

export const createContext = ({req, res}: trpcExpress.CreateExpressContextOptions): { name: string } => ({
  name: "test",
}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const router = t.router({
  asyncTest: t.procedure.query(async () => {
    return "Success!";
  }),
});

export type AppRouter = typeof router;
