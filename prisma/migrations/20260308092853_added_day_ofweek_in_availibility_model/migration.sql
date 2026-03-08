/*
  Warnings:

  - Added the required column `dayOfweek` to the `Avalibility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avalibility" ADD COLUMN     "dayOfweek" INTEGER NOT NULL;
