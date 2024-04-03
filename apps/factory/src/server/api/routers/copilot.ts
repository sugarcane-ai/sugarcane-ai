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
      try {
        const copilot = await ctx.prisma.copilot.create({
          data: {
            ...input,
            userId: userId,
            settings: input.settings || {},
          },
        });
        return copilot as CopilotOutput;
      } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
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
