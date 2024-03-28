import { prisma } from "~/server/db";
import {
  createTRPCRouter,
  promptMiddleware,
  protectedProcedure,
} from "~/server/api/trpc";
import { createDocsFromJson, createEmbeddings } from "~/utils/embeddings";
import {
  EmbeddingScopeType,
  createEmbeddingInput,
  createEmbeddingOutput,
  getEmbeddingInput,
  getEmbeddingOutput,
} from "~/validators/embedding";
import { UserId } from "~/validators/base";
import { z } from "zod";

export const embeddingRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/embeddings",
        tags: ["embedding"],
        summary: "Generate data embeddings",
      },
    })
    .input(createEmbeddingInput)
    // .use(promptMiddleware)
    .output(createEmbeddingOutput)
    .mutation(async ({ ctx, input }) => {
      // Break the json in to multiple small documents
      const userId = ctx.jwt?.id as string;
      const documents = createDocsFromJson(input.payload);

      const embeddings = await createEmbeddings(
        documents.map((d) => d.pageContent),
      );

      console.log(embeddings.length);

      const scope = getScopeWithDefault(input.scope);
      const rows = documents.map((doc, index) => ({
        userId: userId,

        ...scope,

        chunk: index.toString(),
        doc: doc.pageContent,
        embedding: embeddings[index],
        strategy: "biggestArray",
      }));

      const results = await Promise.all(
        rows.map(
          async (e) =>
            await ctx.prisma
              .$queryRaw`INSERT INTO "Embedding" ("userId", "projectId", "scope1", "scope2", "identifier", "chunk", "clientUserId", "doc", "embedding", "strategy")
      VALUES (${e.userId}, ${e.projectId}, ${e.scope1}, ${e.scope2}, ${e.identifier}, ${e.chunk}, ${e.clientUserId}, ${e.doc}, ${e.embedding}, ${e.strategy}) ON CONFLICT("userId", "projectId", "identifier", "chunk") DO UPDATE SET embedding = EXCLUDED.embedding, doc = EXCLUDED.doc, scope1 = EXCLUDED.scope1, scope2 = EXCLUDED.scope2`,
        ),
      );

      // await ctx.prisma.$executeRaw`
      // INSERT INTO "Embedding" ("userId", "projectId", "scope1", "scope2", "identifier", "chunk", "clientUserId", "embedding", "strategy")
      // VALUES ${Prisma.join(
      //   values.map((row) => {
      //     Prisma.sql`(${Prisma.join(row)})`;
      //   }),
      // )}
      // DO UPDATE SET embedding = EXCLUDED.embedding, doc = EXCLUDED.doc, scope1 = EXCLUDED.scope1, scope2 = EXCLUDED.scope2;`;

      return createEmbeddingOutput;
    }),
  lookup: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/embeddings/lookup",
        tags: ["embedding"],
        summary: "Get data embeddings",
      },
    })
    .input(getEmbeddingInput)
    .output(getEmbeddingOutput)
    .mutation(async ({ ctx, input }) => {
      // Break the json in to multiple small documents
      const userId = ctx.jwt?.id as string;

      const matches = await lookupEmbedding(
        userId,
        input.userQuery,
        input.scope,
      );
      return matches;
    }),
});

// EXPLAIN ANALYZE SELECT * FROM "Embedding" ORDER BY "Embedding"."embedding" <-> '[3,1,2]' LIMIT 5;

export const lookupEmbedding = async (
  userId: UserId,
  userQuery: string,
  scope: EmbeddingScopeType,
) => {
  const embeddings = await createEmbeddings([userQuery]);
  const userQueryEmbed = JSON.stringify(embeddings[0]);

  const matches =
    // await prisma.$queryRaw`SELECT doc, embedding <#> ${userQueryEmbed}::vector as similarity FROM "Embedding" ORDER BY "Embedding"."embedding" <#> ${userQueryEmbed}::vector LIMIT 5`;
    await prisma.$queryRaw`SELECT "id", "projectId", "identifier", "chunk", "doc", (embedding <#> ${userQueryEmbed}::vector) * -1 as similarity FROM "Embedding" ORDER BY similarity DESC LIMIT 5`;

  console.debug(matches);

  return matches;
};

// const similaritySearchFromEmb = async (
//   emb: number[],
//   matchThreshold: number = 0.75,
//   matchCount: number = 10,
// ) => {
//   // Convert numeric array to string
//   const embString = emb.join(",");

//   // Execute the SQL query
//   const result = await prisma.$queryRaw`WITH cte AS (
//     SELECT id, doc, (embedding <#> ARRAY[${embString}]) as similarity
//     FROM "Embedding"
//     ORDER BY similarity ASC
//     LIMIT ${matchCount}
//   )
//   SELECT * FROM cte
//   WHERE similarity < -${matchThreshold}`;

//   // Transform the result if needed
//   return result;
// };

export const getDocsbyScope = async (
  userId: UserId,
  scope: EmbeddingScopeType,
) => {
  const matches = await prisma.embedding.findMany({
    where: {
      userId: userId,
      ...getScopeWithDefault(scope),
    },
    select: {
      doc: true,
    },
  });

  return matches.map((m) => m.doc);
};

export const getScopeWithDefault = (
  scope: EmbeddingScopeType,
): EmbeddingScopeType => {
  return {
    projectId: scope.projectId,
    scope1: scope.scope1 || "scope1",
    scope2: scope.scope2 || "scope2",

    clientUserId: scope.clientUserId || "user-1234",
    identifier: scope.identifier,
  };
};
