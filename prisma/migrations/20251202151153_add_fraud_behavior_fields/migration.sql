-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "historicalFlags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "riskLevel" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "flaggedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "suspicionScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "location" TEXT;
