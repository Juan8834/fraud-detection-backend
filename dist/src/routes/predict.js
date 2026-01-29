"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/predict.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", (req, res) => {
    const { amount, merchant, location, date } = req.body;
    if (!amount || !merchant || !location || !date) {
        return res.status(400).json({ error: "All fields are required" });
    }
    // --- Simple fraud logic ---
    let prediction = "purchase";
    let riskScore = Math.floor(Math.random() * 30); // default low risk
    let fraudExplanation = null;
    // Example heuristics for fraud detection
    const highRiskMerchants = ["Laptop Store", "Jewelry Shop", "Electronics"];
    const oddHours = new Date(date).getHours() < 6 || new Date(date).getHours() > 22;
    let fraudFlag = false;
    if (amount > 1000)
        fraudFlag = true; // high-value transaction
    if (highRiskMerchants.some((m) => merchant.includes(m)))
        fraudFlag = true;
    if (oddHours)
        fraudFlag = true;
    if (Math.random() < 0.05)
        fraudFlag = true; // random occasional fraud
    if (fraudFlag) {
        prediction = "fraud";
        riskScore = Math.floor(Math.random() * 30 + 70); // 70-100%
        fraudExplanation = `Detected suspicious pattern${amount > 1000 ? " (high-value)" : ""}${oddHours ? " during odd hours" : ""}.`;
    }
    res.json({ prediction, riskScore, fraudExplanation });
});
exports.default = router;
