-- CreateTable
CREATE TABLE "superAdmin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "superAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "superAdmin_email_key" ON "superAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "superAdmin_userId_key" ON "superAdmin"("userId");

-- CreateIndex
CREATE INDEX "superAdmin_email_idx" ON "superAdmin"("email");

-- CreateIndex
CREATE INDEX "superAdmin_isDeleted_idx" ON "superAdmin"("isDeleted");

-- AddForeignKey
ALTER TABLE "superAdmin" ADD CONSTRAINT "superAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
