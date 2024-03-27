import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createKeyInput,
  getKeyInput,
  getKeysInput,
  keyOutput,
  keyListOutput,
  updateKeyInput,
} from "~/validators/key_management";

export const keyManagmentRouter = createTRPCRouter({
  createKey: protectedProcedure
    .input(createKeyInput)
    .output(keyOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      console.log(`create keys -------------- ${JSON.stringify(input)}`);

      const key = await ctx.prisma.keyManagement.create({
        data: {
          name: input.name,
          apiKey: input.apiKey,
          userId: userId,
        },
      });
      return key;
    }),

  getKey: protectedProcedure
    .input(getKeyInput)
    .output(keyOutput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const query = {
        userId: ctx.jwt?.id as string,
        id: input.id,
      };

      const key = await ctx.prisma.keyManagement.findFirst({
        where: query,
      });

      return key;
    }),

  getKeys: protectedProcedure
    .input(getKeysInput)
    .output(keyListOutput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const keys = await ctx.prisma.keyManagement.findMany({
        where: {
          userId: userId,
        },
      });
      return keys;
    }),

  updateKey: protectedProcedure
    .input(updateKeyInput)
    .output(keyOutput)
    .mutation(async ({ ctx, input }) => {
      const data = {
        name: input.name,
        apiKey: input.apiKey,
      };
      const key = await ctx.prisma.keyManagement.update({
        where: {
          id: input.id,
        },
        data: data,
      });

      return key;
    }),

  // deleteKey: protectedProcedure
  //   .input(getKeyInput)
  //   .output(keyOutput)
  //   .mutation(async ({ ctx, input }) => {
  //     const userId = ctx.jwt?.id as string;

  //     const query = {
  //       userId: userId,
  //       id: input.id,
  //     };

  //     const key = await ctx.prisma.keyManagement.delete({
  //       where: query,
  //     });

  //     return key;
  //   }),
});
