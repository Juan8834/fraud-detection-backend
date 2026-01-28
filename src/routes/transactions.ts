import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/* ======================
   GET /transactions
====================== */
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        employee: true,
        customer: true,
        txItems: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map Prisma enum to friendly labels
    const typeMap: Record<string, string> = {
      SALE: "Purchase",
      REFUND: "Refund",
      EXCHANGE: "Exchange",
      VOID: "Void",
      NO_SALE: "No Sale",
      FRAUD: "Fraud", // 🔥 crucial
    };

    const reformatted = transactions.map((tx) => {
      const items = tx.txItems.map((ti) => ({
        id: ti.id,
        itemId: ti.itemId,
        name: ti.item?.name ?? "Unknown Item",
        quantity: ti.quantity ?? 0,
        unitPrice: ti.unitPrice ?? 0,
        total: (ti.quantity ?? 0) * (ti.unitPrice ?? 0),
        shrinkRisk: ti.item?.shrinkRisk ?? 0,
      }));

      const totalAmount =
        tx.totalAmount ?? items.reduce((sum, item) => sum + item.total, 0);

      // Determine if this transaction should be flagged as fraud
      const isFraud =
        (tx.riskScore ?? 0) >= 75 ||
        !!tx.fraudType ||
        tx.caseStatus === "PENDING" ||
        tx.caseStatus === "CLOSED";

      return {
        id: tx.id,
        createdAt: tx.createdAt,
        transactionType: tx.transactionType, // keep enum
        type: tx.transactionType ? typeMap[tx.transactionType] ?? "Unknown" : "Unknown", // friendly label
        isFraud,
        totalAmount,
        riskScore: tx.riskScore,
        fraudType: tx.fraudType,
        fraudExplanation: tx.fraudExplanation,
        employee: tx.employee,
        customer: tx.customer,
        items,
        caseStatus: tx.caseStatus ?? "OPEN",
        caseNotes: tx.caseNotes ?? [],
        lastUpdated: tx.lastUpdated ?? tx.createdAt,
      };
    });

    res.json(reformatted);
  } catch (err) {
    console.error("❌ ERROR FETCHING TRANSACTIONS", err);
    res.status(500).json({ error: "Failed to load transactions" });
  }
});

/* ======================
   PATCH /transactions/:id/case
   Update case status + notes
====================== */
router.patch("/:id/case", async (req, res) => {
  const transactionId = Number(req.params.id);
  const { caseStatus, caseNotes } = req.body;

  if (!caseStatus || !Array.isArray(caseNotes)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const updatedTx = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        caseStatus,
        caseNotes,
        lastUpdated: new Date(),
      },
      include: {
        employee: true,
        customer: true,
        txItems: {
          include: { item: true },
        },
      },
    });

    const typeMap: Record<string, string> = {
      SALE: "Purchase",
      REFUND: "Refund",
      EXCHANGE: "Exchange",
      VOID: "Void",
      NO_SALE: "No Sale",
      FRAUD: "Fraud",
    };

    const items = updatedTx.txItems.map((ti) => ({
      id: ti.id,
      itemId: ti.itemId,
      name: ti.item?.name ?? "Unknown Item",
      quantity: ti.quantity ?? 0,
      unitPrice: ti.unitPrice ?? 0,
      total: (ti.quantity ?? 0) * (ti.unitPrice ?? 0),
      shrinkRisk: ti.item?.shrinkRisk ?? 0,
    }));

    const totalAmount =
      updatedTx.totalAmount ?? items.reduce((sum, item) => sum + item.total, 0);

    const isFraud =
      (updatedTx.riskScore ?? 0) >= 75 ||
      !!updatedTx.fraudType ||
      updatedTx.caseStatus === "PENDING" ||
      updatedTx.caseStatus === "CLOSED";

    res.json({
      id: updatedTx.id,
      createdAt: updatedTx.createdAt,
      transactionType: updatedTx.transactionType,
      type: updatedTx.transactionType
        ? typeMap[updatedTx.transactionType] ?? "Unknown"
        : "Unknown",
      isFraud,
      totalAmount,
      riskScore: updatedTx.riskScore,
      fraudType: updatedTx.fraudType,
      fraudExplanation: updatedTx.fraudExplanation,
      employee: updatedTx.employee,
      customer: updatedTx.customer,
      items,
      caseStatus: updatedTx.caseStatus ?? "OPEN",
      caseNotes: updatedTx.caseNotes ?? [],
      lastUpdated: updatedTx.lastUpdated,
    });
  } catch (err) {
    console.error("❌ ERROR UPDATING CASE", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

export default router;
