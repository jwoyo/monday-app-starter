import {MONDAY_APP_CLIENT_ID, MONDAY_APP_HOSTING_URL, MONDAY_APP_SECRET} from "./variables";
import {OAuthTokenInFirestore} from "./firestore.schemas";
import {decode} from "jsonwebtoken";

/**
 * calls the monday.com OAuth API to exchange an OAuth code for an access token.
 * The access token is a JWT that contains the user's monday.com user ID and other information why we unwrap it to additionally persist it as access_token_decoded.
 * @param {string} code the OAuth code that monday.com provided to us in the redirect URL
 */
export async function exchangeOAuthCodeForAccessToken(code: string): Promise<OAuthTokenInFirestore> {
  const redirect_uri = (process.env["FUNCTIONS_EMULATOR"] === "true" ? "http://localhost:5173" : MONDAY_APP_HOSTING_URL.value()) + "/oauth/callback";
  const params = {
    code,
    client_id: MONDAY_APP_CLIENT_ID.value(),
    client_secret: MONDAY_APP_SECRET.value(),
    redirect_uri,
  };
  const response = await fetch("https://auth.monday.com/oauth2/token?" + new URLSearchParams(params), {
    method: "POST",
  });
  if (response.status !== 200) {
    console.error(await response.text());
    throw new Error("Failed to exchange OAuth code for access token");
  }
  const accessToken: {
        token_type: string
        access_token: string
        scope: string
    } = await response.json();
  const accessTokenJwtDecoded = decode(accessToken.access_token);
  if (typeof accessTokenJwtDecoded === "string") {
    throw new Error("Failed to decode access token JWT");
  }
  const accessTokenDecoded = accessTokenJwtDecoded as OAuthTokenInFirestore["access_token_decoded"];
  return {
    ...accessToken,
    access_token_decoded: accessTokenDecoded,
  };
}
