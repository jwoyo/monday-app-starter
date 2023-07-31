import {checklistTRPC, mondaySessionUserProcedure, publicProcedure} from "./checklist.server";
import monday from "monday-sdk-js";
import {z} from "zod";
import {exchangeOAuthCodeForAccessToken} from "./monday-oauth-api";
import {getGlobalOAuthTokenByAccountId, setGlobalOAuthToken} from "./db";

export const router = checklistTRPC.router({
  getChecklist: mondaySessionUserProcedure
    .query(async (opts) => {
      console.log(JSON.stringify(opts));
      const api = monday();
      api.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3MTk5Mzg1NSwiYWFpIjoxOTQ1NTcsInVpZCI6NDYxNzI1MzUsImlhZCI6IjIwMjMtMDctMzFUMDk6NTE6MjUuNjk3WiIsInBlciI6Im1lOnJlYWQsYm9hcmRzOnJlYWQsYm9hcmRzOndyaXRlLHdvcmtzcGFjZXM6cmVhZCx3b3Jrc3BhY2VzOndyaXRlLHVzZXJzOnJlYWQsdXNlcnM6d3JpdGUsYWNjb3VudDpyZWFkLG5vdGlmaWNhdGlvbnM6d3JpdGUsdXBkYXRlczpyZWFkIiwiYWN0aWQiOjE3OTg4NDI2LCJyZ24iOiJldWMxIn0.GbmBP-Maq2Vam_M8SMBUzpRlKrCqqv7itf_7it-ERcs");
      api.api("query { users { id, name } }").then((res) => {
        console.log(JSON.stringify(res));
        /* { data: { users: [{id: 12312, name: "Bart Simpson"}, {id: 423423, name: "Homer Simpson"}] } } */
      });
      return "Success!";
    }),
  OAuth: checklistTRPC.router({
    exchangeCode: publicProcedure
      .input(
        z.object({
          code: z.string(),
        }),
      )
      .mutation(async (opts) => {
        const {code} = opts.input;
        const accessToken = await exchangeOAuthCodeForAccessToken(code);
        await setGlobalOAuthToken(accessToken);
      }),
    isSignedUp: mondaySessionUserProcedure.query(async (opts) => {
      return !!await getGlobalOAuthTokenByAccountId({accountId: opts.ctx.mondayContext.dat.account_id, userId: opts.ctx.mondayContext.dat.user_id});
    }),
  }),
});

export type AppRouter = typeof router;
