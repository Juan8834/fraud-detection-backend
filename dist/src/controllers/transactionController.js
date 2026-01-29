"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = getTransactions;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET all transactions with items, employees, customers, store
async function getTransactions(req, res) {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                store: true,
                employee: true,
                customer: true,
                txItems: {
                    include: {
                        item: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        const reformatted = transactions.map((tx) => {
            // Correctly convert txItems → items
            const items = tx.txItems.map((ti) => ({
                id: ti.id,
                itemId: ti.itemId,
                name: ti.item?.name || "Unknown",
                quantity: ti.quantity,
                unitPrice: ti.unitPrice, // ← your real price
                total: ti.quantity * ti.unitPrice,
            }));
            return {
                id: tx.id,
                storeId: tx.storeId,
                employeeId: tx.employeeId,
                customerId: tx.customerId,
                createdAt: tx.createdAt,
                transactionType: tx.transactionType,
                fraudType: tx.fraudType,
                fraudExplanation: tx.fraudExplanation,
                riskScore: tx.riskScore,
                // What the frontend expects
                items: items,
                totalAmount: tx.totalAmount,
                store: tx.store,
                employee: tx.employee,
                customer: tx.customer,
            };
        });
        res.json(reformatted);
    }
    catch (err) {
        console.error("❌ Error fetching transactions", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
}
