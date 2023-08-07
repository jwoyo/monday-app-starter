import admin, {firestore} from 'firebase-admin';
import {BlueprintInFirestore, ChecklistInFirestore, OAuthTokenInFirestore, WithId} from './firestore.schemas';
import {getFirestore} from 'firebase-admin/firestore';
import DocumentReference = firestore.DocumentReference;
import CollectionReference = firestore.CollectionReference;
import {BLUEPRINT_MAX, NAME_MAX_LENGTH} from 'bridge/constants';

const app = admin.initializeApp();
const db = getFirestore(app);

/**
 * we get one OAuth access token per userId (uid) and account (actid). they do not expire.
 */
const accountsCollection = db.collection('accounts');
const getTokenDocument = ({accountId, userId}: {
    accountId: number,
    userId: number
}) => accountsCollection.doc(accountId.toString()).collection('tokens').doc(userId.toString()) as DocumentReference<OAuthTokenInFirestore>;
const getChecklistCollection = ({accountId}: {
    accountId: number
}) => accountsCollection.doc(accountId.toString()).collection('checklists') as CollectionReference<ChecklistInFirestore>;
const getBlueprintCollection = ({accountId}: {
    accountId: number
}) => accountsCollection.doc(accountId.toString()).collection('blueprints') as CollectionReference<BlueprintInFirestore>;

/**
 * Adds a OAuth token to the database which finishes the OAuth dance with monday.
 * @param {OAuthTokenInFirestore} token: The OAuth token to add to the database.
 * @return {Promise<WriteResult>} A promise that resolves when the token has been added to the database.
 */
export function setGlobalOAuthToken(token: OAuthTokenInFirestore) {
  return getTokenDocument({
    accountId: token.access_token_decoded.actid,
    userId: token.access_token_decoded.uid,
  }).set(token);
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
export async function setChecklistForItemId({accountId, itemId, checklist}: {
    accountId: number,
    itemId: number,
    checklist: ChecklistInFirestore
}) {
  const doc = getChecklistCollection({accountId}).doc(itemId.toString());
  return doc.set(checklist);
}

export async function createBlueprint({accountId, blueprint}: {
    accountId: number,
    blueprint: BlueprintInFirestore
}): Promise<WithId<BlueprintInFirestore>> {
  const blueprintCollection = getBlueprintCollection({accountId});
  const {count} = (await blueprintCollection.count().get()).data();
  if (count >= NAME_MAX_LENGTH) {
    throw new Error(`You have reached the maximum number of blueprints (${NAME_MAX_LENGTH}).`);
  }
  const doc = await blueprintCollection.doc();
  await doc.set(blueprint);
  return {...blueprint, id: doc.id};
}

export async function updateBlueprint({accountId, blueprint}: {
    accountId: number,
    blueprint: WithId<BlueprintInFirestore>
}) {
  const doc = await getBlueprintCollection({accountId}).doc(blueprint.id);
  const snapshot = await doc.get();
  if (!snapshot.exists) {
    throw new Error(`Blueprint with id ${blueprint.id} does not exist.`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...blueprintWithoutId} = blueprint;
  await doc.set(blueprintWithoutId);
}

export async function deleteBlueprint({accountId, blueprintId}: {
    accountId: number,
    blueprintId: string
}) {
  const doc = await getBlueprintCollection({accountId}).doc(blueprintId);
  const snapshot = await doc.get();
  if (!snapshot.exists) {
    throw new Error(`Blueprint with id ${blueprintId} does not exist.`);
  }
  await doc.delete();
}

export async function getAllBlueprints({accountId}: {
    accountId: number
}): Promise<WithId<BlueprintInFirestore>[]> {
  const snapshot = await getBlueprintCollection({accountId})
      .limit(BLUEPRINT_MAX)
      .orderBy('name')
      .get();
  return snapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
}
