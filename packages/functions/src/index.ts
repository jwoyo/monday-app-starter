import {onRequest} from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import {checklistExpressMiddleware} from "./checklist.router";
import {MONDAY_APP_SECRET} from "./secrets";

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
