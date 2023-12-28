import { z } from "zod";

export const createLikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: z.string(),
    LikeId: z.string(),
    hasLiked: z.boolean(),
  })
  .strict();

export const getLikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: z.string(),
  })
  .strict();
