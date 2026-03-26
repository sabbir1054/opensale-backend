/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `postAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `postAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "postAddress" ADD COLUMN     "postId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "wishlist" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_userId_postId_key" ON "wishlist"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "postAddress_postId_key" ON "postAddress"("postId");

-- AddForeignKey
ALTER TABLE "postAddress" ADD CONSTRAINT "postAddress_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
