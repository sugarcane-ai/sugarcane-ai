import { z } from "zod";

export const createKeyInput = z.object({
  name: z.string(),
  isActive: z.boolean().default(true),
  apiKey: z.string(),
  userId: z.string(),
  lastUsedAt: z.date().optional().nullable(),
});

export const getKeyInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();

export const getKeysInput = z
  .object({
    userId: z.string(),
  })
  .strict();

export const keySchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean().default(true),
  apiKey: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  lastUsedAt: z.date().nullable(),
  updatedAt: z.coerce.date(),
});

export const updateKeyInput = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean().default(true),
  apiKey: z.string(),
  userId: z.string(),
  lastUsedAt: z.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateKeyInput = z.infer<typeof createKeyInput>;
export type GetKeyInput = z.infer<typeof getKeyInput>;
export type GetKeysInput = z.infer<typeof getKeysInput>;
export const keyOutput = keySchema.or(z.null());
export type KeyOutput = z.infer<typeof keyOutput>;
export type UpdateKeyInput = z.infer<typeof updateKeyInput>;

export const keyListOutput = z.array(keySchema);
export type KeyListOutput = z.infer<typeof keyListOutput>;
