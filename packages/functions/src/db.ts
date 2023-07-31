import admin, {firestore} from "firebase-admin";
import {OAuthTokenInFirestore, oauthTokenInFirestoreSchema} from "./firestore.schemas";
import {getFirestore} from "firebase-admin/firestore";
import DocumentReference = firestore.DocumentReference;

const app = admin.initializeApp();
const db = getFirestore(app);

/**
 * we get one OAuth access token per userId (uid) and account (actid). they do not expire.
 */
const accountsCollection = db.collection("accounts");
const getTokenDocument = ({accountId, userId}: { accountId: number, userId: number }) => accountsCollection.doc(accountId.toString()).collection("tokens").doc(userId.toString()) as DocumentReference<OAuthTokenInFirestore>;

/**
 * Adds a OAuth token to the database which finishes the OAuth dance with monday.
 * @param {OAuthTokenInFirestore} token: The OAuth token to add to the database.
 * @return {Promise<WriteResult>} A promise that resolves when the token has been added to the database.
 */
export function setGlobalOAuthToken(token: OAuthTokenInFirestore) {
  oauthTokenInFirestoreSchema.parse(token);
  return getTokenDocument({accountId: token.access_token_decoded.actid, userId: token.access_token_decoded.uid}).set(token);
}

/**
 * Gets a global OAuth token from the database by account id.
 * @param {number} accountId
 */
export async function getGlobalOAuthTokenByAccountId({accountId, userId}: { accountId: number, userId: number }) {
  const doc = await getTokenDocument({accountId, userId}).get();
  return doc.data() || null;
}
