/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'REFUND', 'EXCHANGE', 'VOID', 'NO_SALE');

-- CreateEnum
CREATE TYPE "ExceptionType" AS ENUM ('HIGH_VALUE_SALE', 'MULTIPLE_REFUNDS', 'NO_SALE_DRAWER', 'AFTER_HOURS', 'IMPOSSIBLE_TRAVEL', 'SUSPICIOUS_DEVICE', 'EMPLOYEE_FLAG', 'MANUAL_FLAG', 'OTHER');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'PENDING', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_itemId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isFlagged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "storeId" INTEGER;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shrinkRisk" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "deviceId",
DROP COLUMN "ipAddress",
DROP COLUMN "itemId",
DROP COLUMN "location",
DROP COLUMN "quantity",
DROP COLUMN "type",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "storeId" INTEGER,
ADD COLUMN     "transactionType" "TransactionType",
ALTER COLUMN "customerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionItem" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExceptionEvent" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "transactionId" INTEGER,
    "employeeId" INTEGER,
    "customerId" INTEGER,
    "eventType" "ExceptionType" NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExceptionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationCase" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "assignedToId" INTEGER,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "notes" JSONB,

    CONSTRAINT "InvestigationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationCaseOnTransaction" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "InvestigationCaseOnTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationCaseOnEmployee" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "InvestigationCaseOnEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationCaseOnCustomer" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "InvestigationCaseOnCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POS" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "terminalId" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "POS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CCTVEvent" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "clipPath" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CCTVEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_sku_key" ON "Item"("sku");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionEvent" ADD CONSTRAINT "ExceptionEvent_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionEvent" ADD CONSTRAINT "ExceptionEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionEvent" ADD CONSTRAINT "ExceptionEvent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionEvent" ADD CONSTRAINT "ExceptionEvent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCase" ADD CONSTRAINT "InvestigationCase_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCaseOnTransaction" ADD CONSTRAINT "InvestigationCaseOnTransaction_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "InvestigationCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCaseOnTransaction" ADD CONSTRAINT "InvestigationCaseOnTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCaseOnEmployee" ADD CONSTRAINT "InvestigationCaseOnEmployee_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "InvestigationCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCaseOnEmployee" ADD CONSTRAINT "InvestigationCaseOnEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCaseOnCustomer" ADD CONSTRAINT "InvestigationCaseOnCustomer_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "InvestigationCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationCaseOnCustomer" ADD CONSTRAINT "InvestigationCaseOnCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POS" ADD CONSTRAINT "POS_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CCTVEvent" ADD CONSTRAINT "CCTVEvent_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
