import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createLikeInput, getLikeInput } from "~/validators/like";

export const likeRouter = createTRPCRouter({
  createLike: protectedProcedure
    .input(createLikeInput)
    .mutation(async ({ input, ctx }) => {
      const { EntityId, EntityType, hasLiked, LikeId } = input;

      return ctx.prisma
        .$transaction(async (prisma) => {
          if (hasLiked) {
            // Delete the existing like from LikeUser table
            await prisma.likeUser.deleteMany({
              where: {
                userId: ctx.session?.user.id,
                likeId: LikeId,
              },
            });

            // Decrease likesCount in EntityLike by 1
            const updatedEntity = await prisma.like.update({
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

            return updatedEntity;
          } else {
            // Add userId in LikeUser table and increment the count by 1
            const newLike = await prisma.likeUser.create({
              data: {
                userId: ctx.session?.user.id!,
              },
            });

            const newEntityLike = await prisma.like.upsert({
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

            console.log("EntityLike created:", newEntityLike);

            return newLike;
          }
        })
        .catch((error) => {
          console.error("Error creating Like:", error);
          throw Error("Failed to create Like");
        });
    }),

  getLikes: publicProcedure
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
          return entityLike;
        })
        .then((result) => result)
        .catch((error) => {
          console.error("Error fetching Likes:", error);
          throw Error("Failed to fetch Likes");
        });
    }),
});
