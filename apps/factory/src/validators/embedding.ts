import { z } from "zod";
import { stringOpt } from "./base";

export const embeddingScopeSchema = z.object({
  projectId: z.string(),
  scope1: stringOpt.default(""),
  scope2: stringOpt.default(""),
  clientUserId: stringOpt,
  identifier: z.string(),
});

export type EmbeddingScopeType = z.infer<typeof embeddingScopeSchema>;

export const createEmbeddingInput = z.object({
  userId: stringOpt,
  scope: embeddingScopeSchema,
  payload: z.any(),
  strategy: stringOpt,
});
// .strict()
export type CreateEmbeddingInput = z.infer<typeof createEmbeddingInput>;

export const createEmbeddingOutput = z.object({
  id: z.string(),
  payload: z.record(z.any()),
  strategy: stringOpt,
});
// .strict()
export type CreateEmbeddingOutput = z.infer<typeof createEmbeddingOutput>;

export const getEmbeddingInput = z.object({
  userId: stringOpt,
  scope: embeddingScopeSchema,
  userQuery: z.string(),
});
// .strict()
export type GetEmbeddingInput = z.infer<typeof getEmbeddingInput>;

export const getEmbeddingOutput = z.array(
  z.object({
    id: z.string(),
    projectId: z.string(),
    identifier: z.string(),
    chunk: z.string(),
    doc: z.string(),
    similarity: z.number(),
  }),
);
// .strict()
export type GetEmbeddingOutput = z.infer<typeof getEmbeddingOutput>;
