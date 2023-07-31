import {z} from "zod";

export const oauthTokenInFirestoreSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
  access_token_decoded: z.object({
    aai: z.number(),
    uid: z.number(),
    iad: z.string(),
    per: z.string(),
    actid: z.number(),
    rgn: z.string(),
  }),
  scope: z.string(),
});

export type OAuthTokenInFirestore = z.infer<typeof oauthTokenInFirestoreSchema>;
