import {onRequest} from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import {MONDAY_APP_SECRET} from "./variables";
import * as trpcExpress from "@trpc/server/adapters/express";
import {createContext} from "./checklist.server";
import {router} from "./checklist.router";

export const checklistExpressMiddleware = trpcExpress.createExpressMiddleware({
  router,
  createContext,
});

const app = express()
  .use(
    cors({
      origin: ["*"], // TODO: restrict to actual origins
      credentials: true,
    })
  )
  .use(
    "/",
    checklistExpressMiddleware
  );

export const checklist = onRequest({secrets: [MONDAY_APP_SECRET]}, app);
