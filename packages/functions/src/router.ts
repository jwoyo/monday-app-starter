import {trpc, mondaySessionUserProcedure, publicProcedure} from './server';
import {z} from 'zod';
import {exchangeOAuthCodeForAccessToken} from './monday-oauth-api';
import {getChecklistForItemId, getGlobalOAuthTokenByAccountId, setChecklistForItemId, setGlobalOAuthToken} from './db';
import {checklistInFirestoreSchema, oauthTokenInFirestoreSchema} from './firestore.schemas';
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
    set: checklistProcedure.input(
        z.object({
          itemId: z.number(),
          checklist: checklistInFirestoreSchema,
        }))
        .mutation(async (opts) => {
          const {itemId, checklist} = opts.input;
          const {account_id: accountId} = opts.ctx.mondayContext.dat;
          return await setChecklistForItemId({accountId, itemId, checklist});
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
