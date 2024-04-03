import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  CopilotOutput,
  copilotListOutput,
  copilotOutput,
  createCopilotInput,
  getCopilotsInput,
  CopilotListOutput,
  updateCopilotInput,
} from "~/validators/copilot";

export const copilotRouter = createTRPCRouter({
  createCopilot: protectedProcedure
    .input(createCopilotInput)
    .output(copilotOutput)
    .mutation(async ({ ctx, input }) => {
      console.log(
        `create copilot input -------------- ${JSON.stringify(input)}`,
      );

      const userId = ctx.jwt?.id as string;

      const copilot = await ctx.prisma.copilot.create({
        data: {
          ...input,
          settings: input.settings || {},
        },
      });
      return copilot as CopilotOutput;
    }),

  getCopilots: protectedProcedure
    .input(getCopilotsInput)
    .output(copilotListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`copilot input -------------- ${JSON.stringify(input)}`);

      const copilots = await ctx.prisma.copilot.findMany({
        where: {
          userId: ctx.jwt?.id as string,
        },
      });

      return copilots as CopilotListOutput;
    }),

  updateCopilot: protectedProcedure
    .input(updateCopilotInput)
    .output(copilotOutput)
    .mutation(async ({ ctx, input }) => {
      console.log(
        `update copilot input -------------- ${JSON.stringify(input)}`,
      );
      const userId = ctx.jwt?.id as string;
      const copilot = await ctx.prisma.copilot.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          settings: input.settings || {},
        },
      });

      return copilot as CopilotOutput;
    }),
});
