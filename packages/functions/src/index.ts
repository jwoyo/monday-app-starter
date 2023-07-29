import {onRequest, Request} from "firebase-functions/v2/https";
import {verify} from "jsonwebtoken";
import {defineSecret} from "firebase-functions/params";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import {createContext, router} from "./checklist.server";
import cors from "cors";

const MONDAY_APP_SECRET = defineSecret("MONDAY_APP_SECRET");

export const checklist_delete_me = onRequest({
  secrets: [MONDAY_APP_SECRET],
},
async (request, response) => {
  const session = await authenticateMondaySession(request);
  response.send(session);
});


const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router,
    createContext,
  })
);

export const checklist = onRequest(app);


const authenticateMondaySession = (request: Request) => {
  if (!request.headers.authorization) {
    throw new Error("No authorization header");
  }
  const jwt = request.headers.authorization.split(" ")[1];
  console.log("Verifying JWT:", jwt);
  return verify(jwt, MONDAY_APP_SECRET.value());
};

