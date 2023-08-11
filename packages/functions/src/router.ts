import {trpc, mondaySessionUserProcedure, publicProcedure, mondayOAuthUserProcedure} from './server';
import {z} from 'zod';
import {exchangeOAuthCodeForAccessToken} from './monday-oauth-api';
import {
  applyBlueprint,
  createBlueprint,
  deleteBlueprint, deleteChecklistForItemId,
  getAllBlueprints,
  getChecklistForItemId,
  getGlobalOAuthTokenByAccountId,
  setChecklistForItemId,
  setGlobalOAuthToken, updateBlueprint,
} from './db';
import {
  blueprintCreatePayloadSchema,
  blueprintUpdatePayloadSchema,
  checklistInFirestoreSchema,
  oauthTokenInFirestoreSchema,
} from './firestore.schemas';
import {checklistProcedure} from './checklist.procedure';

/**
 * trpc router for the app. it orchestrates the various procedures for crud operations + validation and OAuth handling.
 */
export const router = trpc.router({
  checklist: trpc.router({
    get: checklistProcedure
        .query(async (opts) => {
          const {itemId} = opts.input;
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          return await getChecklistForItemId({accountId, itemId});
        }),
    set: checklistProcedure
        .input(
            z.object({
              itemId: z.number(),
              checklist: checklistInFirestoreSchema,
            }))
        .mutation(async (opts) => {
          const {itemId, checklist} = opts.input;
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          return await setChecklistForItemId({accountId, itemId, checklist});
        }),
    delete: checklistProcedure
        .mutation(async (opts) => {
          const {itemId} = opts.input;
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          return await deleteChecklistForItemId({accountId, itemId});
        }),
  }),
  blueprint: trpc.router({
    getAllBlueprints: mondayOAuthUserProcedure
        .query(async (opts) => {
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          return getAllBlueprints({accountId});
        }),
    updateBlueprint: mondayOAuthUserProcedure
        .input(blueprintUpdatePayloadSchema)
        .mutation(async (opts) => {
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          return updateBlueprint({accountId, blueprint: opts.input});
        }),
    deleteBlueprint: mondayOAuthUserProcedure
        .input(z.object({blueprintId: z.string()}))
        .mutation(async (opts) => {
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          const {blueprintId} = opts.input;
          return deleteBlueprint({accountId, blueprintId});
        }),
    createBlueprint: mondayOAuthUserProcedure
        .input(blueprintCreatePayloadSchema)
        .mutation(async (opts) => {
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          const blueprint = opts.input;
          return createBlueprint({accountId, blueprint});
        }),
    applyBlueprint: checklistProcedure
        .input(z.object({blueprintId: z.string()}))
        .mutation(async (opts) => {
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          const {blueprintId, itemId} = opts.input;
          return applyBlueprint({accountId, blueprintId, itemId});
        }),
  }),
  OAuth: trpc.router({
    exchangeCode: publicProcedure
        .input(
            z.object({
              code: z.string(),
            }),
        )
        .mutation(async (opts) => {
          const {code} = opts.input;
          const accessToken = await exchangeOAuthCodeForAccessToken(code);
          oauthTokenInFirestoreSchema.parse(accessToken);
          await setGlobalOAuthToken(accessToken);
        }),
    isSignedUp: mondaySessionUserProcedure.query(async (opts) => {
      return !!await getGlobalOAuthTokenByAccountId({accountId: opts.ctx.mondayContext.dat.account_id, userId: opts.ctx.mondayContext.dat.user_id});
    }),
  }),
});

export type AppRouter = typeof router;
