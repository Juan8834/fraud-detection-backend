"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const fraudEngine_1 = require("./utils/fraudEngine");
const transactions_1 = __importDefault(require("./routes/transactions")); // ✅ import router
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ----------------------------------------------------
// Mount transactions routes
// ----------------------------------------------------
app.use("/transactions", transactions_1.default);
// ----------------------------------------------------
// Root route
// ----------------------------------------------------
app.get("/", (req, res) => res.send("Backend running!"));
// ----------------------------------------------------
// Employees route
// ----------------------------------------------------
app.get("/employees", async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
});
// ----------------------------------------------------
// Customers route
// ----------------------------------------------------
app.get("/customers", async (req, res) => {
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});
// ----------------------------------------------------
// Items route
// ----------------------------------------------------
app.get("/items", async (req, res) => {
    try {
        const items = await prisma.item.findMany();
        res.json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});
// ----------------------------------------------------
// ML Prediction Endpoint (uses fraudEngine.ts)
// ----------------------------------------------------
app.post("/predict", async (req, res) => {
    try {
        const { amount, merchant, location, date, employeeId, customerId, itemId } = req.body;
        if (!amount || !merchant || !location || !date) {
            return res.status(400).json({
                error: "Missing required fields: amount, merchant, location, date",
            });
        }
        const result = (0, fraudEngine_1.evaluateFraud)({
            amount: Number(amount),
            merchant,
            location,
            date,
            employeeId: employeeId ? Number(employeeId) : undefined,
            customerId: customerId ? Number(customerId) : undefined,
            itemId: itemId ? Number(itemId) : undefined,
        });
        res.json(result);
    }
    catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Prediction failed" });
    }
});
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
