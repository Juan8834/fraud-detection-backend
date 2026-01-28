import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { evaluateFraud } from "./utils/fraudEngine";
import transactionsRouter from "./routes/transactions"; // ✅ import router

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Mount transactions routes
// ----------------------------------------------------
app.use("/transactions", transactionsRouter);

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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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

    const result = evaluateFraud({
      amount: Number(amount),
      merchant,
      location,
      date,
      employeeId: employeeId ? Number(employeeId) : undefined,
      customerId: customerId ? Number(customerId) : undefined,
      itemId: itemId ? Number(itemId) : undefined,
    });

    res.json(result);
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// ----------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
