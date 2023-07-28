import {onRequest, Request} from "firebase-functions/v2/https";
import {verify} from "jsonwebtoken";
import {defineSecret} from "firebase-functions/params";

const MONDAY_APP_SECRET = defineSecret("MONDAY_APP_SECRET");

export const helloWorld = onRequest({
  secrets: [MONDAY_APP_SECRET]},
async (request, response) => {
  const session = await authenticateMondaySession(request);
  response.send(session);
});

const authenticateMondaySession = (request: Request) => {
  if (!request.headers.authorization) {
    throw new Error("No authorization header");
  }
  const jwt = request.headers.authorization.split(" ")[1];
  console.log("Verifying JWT:", jwt);
  return verify(jwt, MONDAY_APP_SECRET.value());
};