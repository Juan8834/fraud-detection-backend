// src/routes/predict.ts
import { Router } from "express";

const router = Router();

interface PredictRequestBody {
  amount: number;
  merchant: string;
  location: string;
  date: string;
}

router.post("/", (req, res) => {
  const { amount, merchant, location, date } = req.body as PredictRequestBody;

  if (!amount || !merchant || !location || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // --- Simple fraud logic ---
  let prediction: "fraud" | "purchase" = "purchase";
  let riskScore = Math.floor(Math.random() * 30); // default low risk
  let fraudExplanation: string | null = null;

  // Example heuristics for fraud detection
  const highRiskMerchants = ["Laptop Store", "Jewelry Shop", "Electronics"];
  const oddHours = new Date(date).getHours() < 6 || new Date(date).getHours() > 22;

  let fraudFlag = false;

  if (amount > 1000) fraudFlag = true; // high-value transaction
  if (highRiskMerchants.some((m) => merchant.includes(m))) fraudFlag = true;
  if (oddHours) fraudFlag = true;
  if (Math.random() < 0.05) fraudFlag = true; // random occasional fraud

  if (fraudFlag) {
    prediction = "fraud";
    riskScore = Math.floor(Math.random() * 30 + 70); // 70-100%
    fraudExplanation = `Detected suspicious pattern${
      amount > 1000 ? " (high-value)" : ""
    }${oddHours ? " during odd hours" : ""}.`;
  }

  res.json({ prediction, riskScore, fraudExplanation });
});

export default router;
