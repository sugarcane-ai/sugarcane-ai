import { z } from "zod";

export const LikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: z.string(),
  })
  .strict();
export const UnlikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: z.string(),
    LikeId: z.string(),
  })
  .strict();

export const getLikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: z.string(),
  })
  .strict();

export const LikePublicOutput = z
  .object({
    likesCount: z.number(),
  })
  .strict();
