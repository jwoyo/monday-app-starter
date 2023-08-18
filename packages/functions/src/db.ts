import admin, {firestore} from 'firebase-admin';
import {
  BlueprintCreatePayload,
  BlueprintInFirestore,
  BlueprintUpdatePayload,
  ChecklistInFirestore,
  OAuthTokenInFirestore,
  WithId,
} from './firestore.schemas';
import {getFirestore} from 'firebase-admin/firestore';
import DocumentReference = firestore.DocumentReference;
import CollectionReference = firestore.CollectionReference;
import {BLUEPRINT_MAX, NAME_MAX_LENGTH} from 'bridge/constants';
import {v4 as uuidv4} from 'uuid';

import Timestamp = firestore.Timestamp;

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
}) => accountsCollection.doc(accountId.toString()).collection('blueprints')
    .withConverter({
      toFirestore: (blueprint: BlueprintInFirestore) => blueprint,
      // annoyingly, we have to convert Firestores absurd Timestamp type to a Date. superjson takes over the rest on the trcp transformation layer
      fromFirestore: (snapshot: firestore.QueryDocumentSnapshot<BlueprintInFirestore & {createdAt: Timestamp}>) => {
        const data = snapshot.data();
        return {
          ...snapshot.data(),
          createdAt: data.createdAt.toDate(),
        };
      },
    }) as CollectionReference<BlueprintInFirestore>;

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
  await doc.set(checklist);
  return checklist;
}
/**
 * Sets a checklist in the database by monday item id.
 * @param accountId
 * @param itemId
 * @param checklist
 */
export async function deleteChecklistForItemId({accountId, itemId}: {
    accountId: number,
    itemId: number,
}) {
  const doc = getChecklistCollection({accountId}).doc(itemId.toString());
  return doc.delete();
}

/**
 * Creates a blueprint
 * @param accountId
 * @param blueprint
 * @return {Promise<WithId<BlueprintInFirestore>>}
 */
export async function createBlueprint({accountId, blueprint}: {
    accountId: number,
    blueprint: BlueprintCreatePayload
}): Promise<WithId<BlueprintInFirestore>> {
  const blueprintCollection = getBlueprintCollection({accountId});
  const {count} = (await blueprintCollection.count().get()).data();
  if (count >= NAME_MAX_LENGTH) {
    throw new Error(`You have reached the maximum number of blueprints (${NAME_MAX_LENGTH}).`);
  }
  const doc = await blueprintCollection.doc();
  const newBlueprint = {...blueprint, createdAt: new Date()};
  await doc.set(newBlueprint);
  return {...newBlueprint, id: doc.id};
}

/**
 * Updates a blueprint by id, performs a merge.
 * @param accountId
 * @param blueprint
 */
export async function updateBlueprint({accountId, blueprint}: {
    accountId: number,
    blueprint: WithId<BlueprintUpdatePayload>
}) {
  const doc = await getBlueprintCollection({accountId}).doc(blueprint.id);
  const snapshot = await doc.get();
  const oldBlueprint = snapshot.data();
  if (!snapshot.exists || !oldBlueprint) {
    throw new Error(`Blueprint with id ${blueprint.id} does not exist.`);
  }
  // eslint-disable-next-line
  const {id, ...blueprintWithoutId} = blueprint;
  const newBlueprint = {...oldBlueprint, ...blueprintWithoutId};
  await doc.set(newBlueprint);
}

/**
 * Deletes a blueprint by id.
 * @param accountId
 * @param blueprintId
 */
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

/**
 * Gets all blueprints for an account. We limit the number of blueprints and do not offer pagination for now.
 * @param accountId
 * @return {Promise<WithId<BlueprintInFirestore>[]>}
 */
export async function getAllBlueprints({accountId}: {
    accountId: number
}): Promise<WithId<BlueprintInFirestore>[]> {
  const snapshot = await getBlueprintCollection({accountId})
      .limit(BLUEPRINT_MAX)
      .orderBy('createdAt', 'desc')
      .get();
  return snapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
}

/**
 * Applies a blueprint to a checklist. This will overwrite the current checklist. The blueprint must exist.
 * @param accountId
 * @param blueprintId
 * @param itemId
 */
export async function applyBlueprint({accountId, blueprintId, itemId}: {
    accountId: number,
    blueprintId: string
    itemId: number,
}) {
  const blueprintDocSnapshot= await getBlueprintCollection({accountId}).doc(blueprintId).get();
  const blueprint = blueprintDocSnapshot.data();
  if (!blueprintDocSnapshot.exists || !blueprint) {
    throw new Error(`Blueprint with id ${blueprintId} does not exist.`);
  }
  return setChecklistForItemId({
    accountId,
    itemId,
    checklist: {
      items: blueprint.items.map((item) => ({...item, id: uuidv4()})),
    },
  });
}
