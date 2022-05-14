/*
  Warnings:

  - You are about to drop the column `incognito` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "isUpdatedByAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "incognito";
