-- CreateTable
CREATE TABLE "Embedding" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scope1" TEXT,
    "scope2" TEXT,
    "clientUserId" TEXT,
    "identifier" TEXT NOT NULL,
    "chunk" TEXT NOT NULL,
    "doc" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_userId_projectId_identifier_chunk_key" ON "Embedding"("userId", "projectId", "identifier", "chunk");
