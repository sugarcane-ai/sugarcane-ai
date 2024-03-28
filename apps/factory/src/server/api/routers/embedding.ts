import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createDocsFromJson, createEmbeddings } from "~/utils/embeddings";
import {
  CreateEmbeddingOutput,
  EmbeddingScopeType,
  EmbeddingsSchema,
  createEmbeddingInput,
  createEmbeddingOutput,
  getEmbeddingInput,
} from "~/validators/embedding";
import { UserId } from "~/validators/base";

export const embeddingRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/copilots/{copilotId}/embeddings",
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
        copilotId: input.copilotId,

        ...scope,

        chunk: index.toString(),
        doc: doc.pageContent,
        embedding: embeddings[index],
        // embedding: "[1,2,3]",
        strategy: "biggestArray",
      }));

      const results = await Promise.all(
        rows.map(
          async (e) =>
            await ctx.prisma
              .$executeRaw`INSERT INTO "Embedding" ("userId", "copilotId", "scope1", "scope2", "groupId", "chunk", "clientUserId", "doc", "embedding", "strategy")
      VALUES (${e.userId}, ${e.copilotId}, ${e.scope1}, ${e.scope2}, ${e.groupId}, ${e.chunk}, ${e.clientUserId}, ${e.doc}, ${e.embedding}, ${e.strategy}) ON CONFLICT("userId", "copilotId", "clientUserId", "scope1", "scope2", "groupId", "chunk") DO UPDATE SET embedding = EXCLUDED.embedding, doc = EXCLUDED.doc`,
        ),
      );

      const output: CreateEmbeddingOutput = {
        count: results.reduce((total, current) => total + current, 0),
        strategy: "unknown",
      };

      // const results = await ctx.prisma.$executeRaw;

      // const sql = `INSERT INTO "Embedding" ("userId", "copilotId", "scope1", "scope2", "identifier", "chunk", "clientUserId", "doc", "embedding", "strategy")
      // VALUES ${[rows[0]]
      //   .map(
      //     (e) =>
      //       `(${e.userId}, ${e.copilotId}, ${e.scope1}, ${e.scope2}, ${
      //         e.identifier
      //       }, ${e.chunk}, ${e.clientUserId}, ${e.doc}, ${JSON.stringify(
      //         e.embedding,
      //       )}::vector, ${e.strategy})`,
      //   )
      //   .join(",")}
      // DO UPDATE SET embedding = EXCLUDED.embedding, doc = EXCLUDED.doc, scope1 = EXCLUDED.scope1, scope2 = EXCLUDED.scope2;`;

      // await ctx.prisma
      //   .$executeRaw`INSERT INTO "Embedding" ("userId", "copilotId")
      // VALUES ${[rows[0]]
      //   .map((e) => `("${e.userId}", "${e.copilotId}")`)
      //   .join(",")}
      // DO UPDATE SET embedding = EXCLUDED.embedding, doc = EXCLUDED.doc, scope1 = EXCLUDED.scope1, scope2 = EXCLUDED.scope2;`;

      // console.log(sql);
      // const results = await ctx.prisma.$executeRaw`${sql}`;

      // Prisma.sql`(${Prisma.join(row)})`;

      // debugger;

      // const output: CreateEmbeddingOutput = {
      //   count: results,
      //   strategy: "unknown",
      // };

      return output;
    }),
  lookup: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/copilots/{copilotId}/embeddings/lookup",
        tags: ["embedding"],
        summary: "Get data embeddings",
      },
    })
    .input(getEmbeddingInput)
    .output(EmbeddingsSchema)
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
): Promise<EmbeddingsSchema> => {
  const embeddings = await createEmbeddings([userQuery]);
  const userQueryEmbed = JSON.stringify(embeddings[0]);

  const matches =
    // await prisma.$queryRaw`SELECT doc, embedding <#> ${userQueryEmbed}::vector as similarity FROM "Embedding" ORDER BY "Embedding"."embedding" <#> ${userQueryEmbed}::vector LIMIT 5`;
    await prisma.$queryRaw`SELECT "id", "copilotId", "groupId", "chunk", "doc", (embedding <#> ${userQueryEmbed}::vector) * -1 as similarity FROM "Embedding" ORDER BY similarity DESC LIMIT 5`;

  console.debug(matches);

  return matches as EmbeddingsSchema;
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
    clientUserId: scope.clientUserId || "user-1234",

    scope1: scope.scope1 || "scope1",
    scope2: scope.scope2 || "scope2",

    groupId: scope.groupId,
  };
};
