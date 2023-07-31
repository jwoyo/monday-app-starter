import {checklistTRPC, mondayUserProcedure} from "./checklist.server";

export const router = checklistTRPC.router({
  getChecklist: mondayUserProcedure
    .query(async (opts) => {
      console.log(opts);
      return "Success!";
    }),
});

export type AppRouter = typeof router;