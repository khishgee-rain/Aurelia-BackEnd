/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "rating" SET DATA TYPE TEXT;
