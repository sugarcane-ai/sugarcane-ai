import { z, ZodError } from "zod";

enum responseType {
  TEXT = 1,
  IMAGE = 2,
  VIDEO = 3,
}

export const ErrorResponseSchema = z.object({
  code: z.number(),
  message: z.string().nullable(),
  vendorCode: z.number().nullable(),
  vendorMessage: z.string().nullable(),
});

export const textResponseV1 = z.object({
  completion: z.string(),
  v: z.number(),
  t: z.literal(responseType.TEXT),
});

export const imageResponseV1 = z.object({
  base64: z.string().optional(),
  v: z.number(),
  t: z.literal(responseType.IMAGE),
});

export const imageResponseV2 = z.object({
  url: z.string().url().optional(),
  v: z.number(),
  t: z.literal(responseType.IMAGE),
});

export const llmResponseDataSchema = z.union([
  textResponseV1,
  imageResponseV1,
  imageResponseV2,
]);

export const llmResponseSchema = z.object({
  data: llmResponseDataSchema.nullable(),
  error: ErrorResponseSchema.nullable(),
});

export const performanceMetrics = z.object({});

export const runResponseSchema = z.object({
  response: llmResponseSchema,
  performance: performanceMetrics,
});

export const getTextResponseV1 = function (
  text: string,
  v: number = 1,
): LlmResponse {
  return {
    data: {
      completion: text || "",
      v: v,
      t: responseType.TEXT,
    },
    error: null,
  };
};

export const getImageResponseV1 = function (
  base64: string,
  v: number = 1,
): LlmResponse {
  return {
    data: {
      base64: base64 || "",
      v: v,
      t: responseType.IMAGE,
    },
    error: null,
  };
};

export const getImageResponseV2 = function (
  url: string,
  v: number = 2,
): LlmResponse {
  return {
    data: {
      url: url,
      v: v,
      t: responseType.IMAGE,
    },
    error: null,
  };
};

export const getCompletionResponse = function (data: any): string {
  return data?.completion ?? data?.base64 ?? data?.url ?? "";
};

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type LlmResponse = z.infer<typeof llmResponseSchema>;
export type RunResponse = z.infer<typeof runResponseSchema>;
export type PerformanceMetrics = z.infer<typeof performanceMetrics>;
export type TextResponseV1 = z.infer<typeof textResponseV1>;
export type ImageResponseV1 = z.infer<typeof imageResponseV1>;
export type ImageResponseV2 = z.infer<typeof imageResponseV2>;
export type LlmResponseDataSchema = z.infer<typeof llmResponseDataSchema>;
