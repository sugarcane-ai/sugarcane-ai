import { z, ZodError } from "zod";

export enum ResponseType {
  TEXT = 1,
  IMAGE = 2,
  CODE = 3,
  VIDEO = 4,
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
  t: z.literal(ResponseType.TEXT),
});

export const imageResponseV1 = z.object({
  base64: z.string(),
  v: z.number(),
  t: z.literal(ResponseType.IMAGE),
});

export const imageResponseV2 = z.object({
  url: z.string().url(),
  v: z.number(),
  t: z.literal(ResponseType.IMAGE),
});

export const codeResponseV1 = z.object({
  completion: z.string(),
  v: z.number(),
  t: z.literal(ResponseType.CODE),
});

export const llmResponseDataSchema = z.union([
  textResponseV1,
  imageResponseV1,
  imageResponseV2,
  codeResponseV1,
]);

export const llmResponseSchema = z.object({
  data: llmResponseDataSchema.nullable(),
  error: ErrorResponseSchema.nullable(),
});

export const performanceMetrics = z.object({});

export const runResponseSchema = z.object({
  response: llmResponseSchema.nullable(),
  performance: performanceMetrics.nullable(),
});

export const getTextResponseV1 = function (text: string): LlmResponse {
  return {
    data: {
      completion: text || "",
      v: 1,
      t: ResponseType.TEXT,
    },
    error: null,
  };
};

export const getCodeResponseV1 = function (text: string): LlmResponse {
  return {
    data: {
      completion: text || "",
      v: 1,
      t: ResponseType.CODE,
    },
    error: null,
  };
};

export const getImageResponseV1 = function (base64: string): LlmResponse {
  return {
    data: {
      base64: base64 || "",
      v: 1,
      t: ResponseType.IMAGE,
    },
    error: null,
  };
};

export const getImageResponseV2 = function (url: string): LlmResponse {
  return {
    data: {
      url: url,
      v: 2,
      t: ResponseType.IMAGE,
    },
    error: null,
  };
};

// TODO:
export const getCompletionResponse = function (data: any): string {
  return data?.completion ?? data?.base64 ?? data?.url ?? "";
};

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type LlmResponse = z.infer<typeof llmResponseSchema>;
export type RunResponse = z.infer<typeof runResponseSchema>;
export type PerformanceMetrics = z.infer<typeof performanceMetrics>;
export type TextResponseV1 = z.infer<typeof textResponseV1>;
export type CodeResponseV1 = z.infer<typeof codeResponseV1>;
export type ImageResponseV1 = z.infer<typeof imageResponseV1>;
export type ImageResponseV2 = z.infer<typeof imageResponseV2>;
export type LlmResponseDataSchema = z.infer<typeof llmResponseDataSchema>;
