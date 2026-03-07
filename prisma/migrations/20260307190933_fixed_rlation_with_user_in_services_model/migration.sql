/*
  Warnings:

  - You are about to drop the column `UserId` on the `Service` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_UserId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "UserId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
