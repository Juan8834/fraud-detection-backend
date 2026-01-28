// A simple ML-style logistic regression model

// Coefficients learned from "imaginary training data"
// You can adjust these later.
const weights = {
  amount: 0.004,       // Large amounts increase risk
  weekend: 0.8,        // Weekends have more suspicious activity
  oddHour: 1.2,        // Activity during 1am–5am is higher risk
  merchantRisk: 1.5,   // High-risk merchant category
  locationMismatch: 1.0, // Unusual location vs normal patterns
  bias: -3.0           // Base bias (important!)
};

// Sigmoid function for logistic regression
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Fake merchant-risk categories
const riskyMerchants = ["pawn shop", "crypto atm", "liquor store", "casino"];

// Fake normal location for demonstration
const normalLocation = "New York";

export function predictFraud(input: {
  amount: number;
  merchant: string;
  location: string;
  date: string;
}) {
  const { amount, merchant, location, date } = input;

  const txDate = new Date(date);
  const hour = txDate.getHours();
  const day = txDate.getDay();

  // FEATURE ENGINEERING -------------------------

  const weekend = day === 0 || day === 6 ? 1 : 0;
  const oddHour = hour >= 1 && hour <= 5 ? 1 : 0;
  const merchantRisk = riskyMerchants.includes(merchant.toLowerCase()) ? 1 : 0;
  const locationMismatch = location !== normalLocation ? 1 : 0;

  // LINEAR MODEL --------------------------------

  const z =
    weights.amount * amount +
    weights.weekend * weekend +
    weights.oddHour * oddHour +
    weights.merchantRisk * merchantRisk +
    weights.locationMismatch * locationMismatch +
    weights.bias;

  const probability = sigmoid(z);

  const prediction = probability > 0.5 ? "Fraud" : "Legitimate";

  return {
    probability: Number(probability.toFixed(4)),
    prediction,
  };
}
