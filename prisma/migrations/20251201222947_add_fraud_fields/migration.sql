-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fraudReason" TEXT,
ADD COLUMN     "fraudType" TEXT,
ADD COLUMN     "riskScore" INTEGER;
