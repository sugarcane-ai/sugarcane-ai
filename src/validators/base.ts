import { z } from "zod";
import { OverridableStringUnion } from "@mui/types";
import { ChipPropsColorOverrides } from "@mui/material/Chip";

export const username = z.string();
export type Username = z.infer<typeof username>;

export const promptPackage = z.string();
export type PromptPackage = z.infer<typeof promptPackage>;

export const userId = z.string().nullable();
export type UserId = z.infer<typeof userId>;

export const packageId = z.string().nullable();
export type PackageId = z.infer<typeof packageId>;

export const promptEnvironment = z.enum(["DEV", "PREVIEW", "RELEASE"]);
export type PromptEnvironment = z.infer<typeof promptEnvironment>;

export const userPackage = z.object({
  username: username,
  packagename: promptPackage,
});

export const providers = [
  ["openai", "OpenAI"],
  ["llama2", "Llama2"],
];

export const models = {
  openai: [
    ["davinci", "Davinci"],
    ["gpt-3.5-turbo", "Gpt 3.5 Turbo"],
    ["gpt-4", "Gpt 4"],
  ],
  llama2: [
    ["7b", "7B"],
    ["13b", "13B"],
    ["70b", "70B"],
  ],
};
export const packageVisibility = z.enum(["PUBLIC", "PRIVATE"]);
export type PackageVisibility = z.infer<typeof packageVisibility>;

export const stringOpt = z.union([z.string(), z.undefined()]);
export type StringOpt = z.infer<typeof stringOpt>;

export const publicUserSchema = z.object({
  name: z.string().nullable(),
  image: z.string().nullable(),
});
export type PublicUserSchem = z.infer<typeof publicUserSchema>;

export type colorType = OverridableStringUnion<
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning",
  ChipPropsColorOverrides
>;
