import { z } from "zod";
import {
  InputJsonValue,
  StatusStateSchema,
} from "~/generated/prisma-client-zod.ts";

export const createCopilotInput = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    copilotType: z.string(),
    settings: InputJsonValue.nullable(),
    userId: z.string(),
    status: StatusStateSchema,
  })
  .strict();

export const getCopilotInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();

export const getCopilotsInput = z
  .object({
    userId: z.string(),
  })
  .strict();

export const updateCopilotInput = createCopilotInput
  .extend({
    id: z.string(),
  })
  .strict();

export const copilotSchema = createCopilotInput
  .extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type CreateCopilotInput = z.infer<typeof createCopilotInput>;
export type GetCopilotInput = z.infer<typeof getCopilotInput>;
export type UpdateCopilotInput = z.infer<typeof updateCopilotInput>;
export type CopilotSchema = z.infer<typeof copilotSchema>;
export const copilotOutput = copilotSchema.or(z.null());
export type CopilotOutput = z.infer<typeof copilotOutput>;
export const copilotListOutput = z.array(copilotSchema);
export type CopilotListOutput = z.infer<typeof copilotListOutput>;
