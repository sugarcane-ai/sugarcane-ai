import { z } from "zod";
import { promptEnvironment } from "./base";

export const generateInput = z
    .object({
        userId: z.string().optional(),

        environment: promptEnvironment.default(promptEnvironment.Enum.RELEASE),
        
        // Prompt Template identitication
        promptPackageId: z.string(),
        promptTemplateId: z.string(),
        version: z.string().optional(),

        // Template Data
        data: z.record(z.any()),
    })
    .strict()
export type GenerateInput = z.infer<typeof generateInput>;


export const generateOutput = z
    .object({
        id: z.string(),
        
        environment: promptEnvironment,

        version: z.string(),
        prompt: z.string(),
        completion: z.string(),

        latency: z.number(),
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),

        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),

    }).or(z.null())
export type GenerateOutput = z.infer<typeof generateOutput>;

