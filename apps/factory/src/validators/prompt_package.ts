import { z } from "zod";
import { packageVisibility } from "./base";
import { templateSchema } from "./prompt_template";
import { RESERVED_NAMES } from "./reserved_names";

export const getPackagesInput = z
  .object({
    userId: z.string().optional(),
    visibility: packageVisibility.optional(),
  })
  .optional();
// .strict()
export type GetPackagesInput = z.infer<typeof getPackagesInput>;

export const getMarketPlacePackagesInput = z
  .object({
    pageNo: z.number().default(1),
    visibility: packageVisibility.optional(),
  })
  .optional();
export type GetMarketPlacePackagesInput = z.infer<
  typeof getMarketPlacePackagesInput
>;

export const getPackageInput = z
  .object({
    id: z.string().uuid(),
  })
  .strict()
  .required();
export type GetPackageInput = z.infer<typeof getPackageInput>;

export const createPackageInput = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Name must be at least 3 characters long.",
      })
      .max(30, {
        message: "Name must be at most 30 characters long.",
      })
      .regex(/^[a-z0-9-]+$/, {
        message:
          "Name must only contain lowercase letters, numbers, and hyphen.",
      })
      .transform((value) => value.toLowerCase())
      .refine((value) => !RESERVED_NAMES.includes(value), {
        message: "This name is reserved.",
      }),
    description: z.string().min(10, {
      message: "Description must be atleast 10 characters long",
    }),
    visibility: packageVisibility,
  })
  .strict()
  .required();

export type CreatePackageInput = z.infer<typeof createPackageInput>;

export const deletePackageInput = z
  .object({
    id: z.string(),
  })
  .strict();
export type DeletePackageInput = z.infer<typeof deletePackageInput>;

export const packageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  visibility: packageVisibility,
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  templates: z.array(templateSchema).optional(),
});

export const updatePackageInput = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    visibility: packageVisibility,
  })
  .strict()
  .required();

export type updatePackageInput = z.infer<typeof updatePackageInput>;

// export type UpdateVersionInput = z.infer<typeof UpdateVersionInput>;

export const packageOutput = packageSchema.or(z.null());
export type PackageOutput = z.infer<typeof packageOutput>;

export const packageListOutput = z.array(packageOutput);
export type PackageListOutput = z.infer<typeof packageListOutput>;
