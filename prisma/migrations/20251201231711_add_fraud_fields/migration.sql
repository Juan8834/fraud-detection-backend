/*
  Warnings:

  - You are about to drop the column `fraudReason` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fraudReason",
ADD COLUMN     "fraudExplanation" TEXT;
