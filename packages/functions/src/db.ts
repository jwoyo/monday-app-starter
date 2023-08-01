import admin, {firestore} from 'firebase-admin';
import {ChecklistInFirestore, OAuthTokenInFirestore} from './firestore.schemas';
import {getFirestore} from 'firebase-admin/firestore';
import DocumentReference = firestore.DocumentReference;
import CollectionReference = firestore.CollectionReference;

const app = admin.initializeApp();
const db = getFirestore(app);

/**
 * we get one OAuth access token per userId (uid) and account (actid). they do not expire.
 */
const accountsCollection = db.collection('accounts');
const getTokenDocument = ({accountId, userId}: { accountId: number, userId: number }) => accountsCollection.doc(accountId.toString()).collection('tokens').doc(userId.toString()) as DocumentReference<OAuthTokenInFirestore>;
const getChecklistCollection = ({accountId}: { accountId: number }) => accountsCollection.doc(accountId.toString()).collection('checklists') as CollectionReference<ChecklistInFirestore>;

/**
 * Adds a OAuth token to the database which finishes the OAuth dance with monday.
 * @param {OAuthTokenInFirestore} token: The OAuth token to add to the database.
 * @return {Promise<WriteResult>} A promise that resolves when the token has been added to the database.
 */
export function setGlobalOAuthToken(token: OAuthTokenInFirestore) {
  return getTokenDocument({accountId: token.access_token_decoded.actid, userId: token.access_token_decoded.uid}).set(token);
}

/**
 * Gets a global OAuth token from the database by account id.
 * @param {number} accountId
 * @param {number} userId
 */
export async function getGlobalOAuthTokenByAccountId({accountId, userId}: { accountId: number, userId: number }) {
  const snapshot = await getTokenDocument({accountId, userId}).get();
  return snapshot.data() || null;
}


/**
 * Gets a checklist from the database by monday item id.
 * @param accountId
 * @param itemId
 */
export async function getChecklistForItemId({accountId, itemId}: { accountId: number, itemId: number }) {
  const snapshot = await getChecklistCollection({accountId}).doc(itemId.toString()).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data() || null;
}

/**
 * Sets a checklist in the database by monday item id.
 * @param accountId
 * @param itemId
 * @param checklist
 */
export async function setChecklistForItemId({accountId, itemId, checklist}: { accountId: number, itemId: number, checklist: ChecklistInFirestore }) {
  const doc = getChecklistCollection({accountId}).doc(itemId.toString());
  return doc.set(checklist);
}

