import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  LikeInput,
  LikePublicOutput,
  UnlikeInput,
  getLikeInput,
} from "~/validators/like";

export const likeRouter = createTRPCRouter({
  likeEntity: protectedProcedure
    .input(LikeInput)
    .mutation(async ({ input, ctx }) => {
      const { EntityId, EntityType } = input;

      try {
        const newLike = await ctx.prisma.likeUser.create({
          data: {
            userId: ctx.session?.user.id!,
          },
        });

        const entityLike = await ctx.prisma.like.upsert({
          where: {
            EntityId_EntityType: {
              EntityId,
              EntityType,
            },
          },
          create: {
            likes: {
              connect: {
                id: newLike.id,
              },
            },
            EntityId,
            EntityType,
            likesCount: 1,
          },
          update: {
            likes: {
              connect: {
                id: newLike.id,
              },
            },
            likesCount: {
              increment: 1,
            },
          },
        });

        return entityLike.id;
      } catch (error) {
        console.error("Error creating Like:", error);
        throw Error("Failed to create Like");
      }
    }),

  unlikeEntity: protectedProcedure
    .input(UnlikeInput)
    .mutation(async ({ input, ctx }) => {
      const { EntityId, EntityType, LikeId } = input;

      try {
        // Delete the existing like from LikeUser table
        await ctx.prisma.likeUser.deleteMany({
          where: {
            userId: ctx.session?.user.id,
            likeId: LikeId,
          },
        });

        // Decrease likesCount in EntityLike by 1
        const updatedEntity = await ctx.prisma.like.update({
          where: {
            EntityId_EntityType: {
              EntityId,
              EntityType,
            },
          },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        });

        console.log("Like deleted and Entity updated:", updatedEntity);
        return updatedEntity;
      } catch (error) {
        console.error("Error deleting Like:", error);
        throw Error("Failed to delete Like");
      }
    }),

  getLikes: publicProcedure
    .input(getLikeInput)
    .output(LikePublicOutput)
    .query(async ({ input, ctx }) => {
      const { EntityId, EntityType } = input;

      return ctx.prisma
        .$transaction(async (prisma) => {
          const entityLike = await prisma.like.findUnique({
            where: {
              EntityId_EntityType: {
                EntityId,
                EntityType,
              },
            },
          });

          const result = {
            likesCount: entityLike?.likesCount || 0,
          };
          return result;
        })
        .catch((error) => {
          console.error("Error fetching Likes:", error);
          throw Error("Failed to fetch Likes");
        });
    }),

  UserLikeCheck: protectedProcedure
    .input(getLikeInput)
    .query(async ({ input, ctx }) => {
      const { EntityId, EntityType } = input;

      return ctx.prisma
        .$transaction(async (prisma) => {
          const entityLike = await prisma.like.findUnique({
            where: {
              EntityId_EntityType: {
                EntityId,
                EntityType,
              },
            },
            include: { likes: true },
          });

          const result = {
            likeId: "",
            hasLiked: false,
          };

          if (entityLike) {
            const userLike = entityLike.likes.find(
              (like) => like.userId === ctx.session?.user.id,
            );
            if (userLike) {
              result.hasLiked = true;
              result.likeId = entityLike.id;
            }
          }
          return result;
        })
        .catch((error) => {
          console.error("Error fetching Likes:", error);
          throw Error("Failed to fetch Likes");
        });
    }),
});
