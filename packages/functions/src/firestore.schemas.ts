import {z} from 'zod';

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


const checklistItemInFirestoreItemSchema = z.object({
  id: z.string(),
  type: z.enum(['item']),
  title: z.string(),
  isChecked: z.boolean(),
  assigneeIds: z.array(z.string()),
  isOptional: z.boolean(),
});
const checklistItemHeadlineInFirestoreItemSchema = z.object({
  id: z.string(),
  type: z.enum(['headline']),
  title: z.string(),
});

export const checklistInFirestoreSchema = z.object({
  items: z.array(
      checklistItemInFirestoreItemSchema.or(
          checklistItemHeadlineInFirestoreItemSchema
      )),
});

export type ChecklistInFirestore = z.infer<typeof checklistInFirestoreSchema>;
export type ChecklistItemInFirestore = z.infer<typeof checklistItemInFirestoreItemSchema>;
export type ChecklistItemHeadlineInFirestore = z.infer<typeof checklistItemHeadlineInFirestoreItemSchema>;
