"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
// Prisma reads DATABASE_URL from .env automatically
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Root test route
app.get("/", (req, res) => res.send("Backend running!"));
// Test route to fetch all employees
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
