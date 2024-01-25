import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  registerEvent: protectedProcedure
    .input(
      z.object({ registerId: z.string(), referral: z.string().optional() }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const alreadyRegistered = await ctx.prisma.event.findFirst({
        where: {
          id: input.registerId,
          eventUsers: {
            some: {
              userId: ctx.session?.user.id,
            },
          },
        },
      });

      if (alreadyRegistered) {
        return {
          message: "Already Registered",
        };
      }
      const eventUser = await ctx.prisma.eventUser.create({
        data: {
          userId: ctx.session!.user.id,
          referral: input.referral,
        },
      });
      await ctx.prisma.event.upsert({
        where: {
          id: input.registerId,
        },
        update: {
          eventUsers: {
            connect: { id: eventUser.id },
          },
        },
        create: {
          id: input.registerId,
          eventUsers: {
            connect: { id: eventUser.id },
          },
        },
      });
      return {
        message: "Event Registration Successful",
      };
    }),
});
