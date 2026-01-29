"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateFraud = evaluateFraud;
// Mock “risk history” for customers and employees
const riskyCustomers = [2, 5, 7]; // customer IDs with history
const riskyEmployees = [3]; // employee IDs flagged for suspicious behavior
const highRiskItems = [1]; // item IDs considered high-value/high-risk
function evaluateFraud({ amount, merchant, location, date, employeeId, customerId, itemId, }) {
    let riskScore = 0;
    let fraudType = null;
    let explanation = null;
    // --- Rule 1: High amount ---
    if (amount > 1000) {
        riskScore += 35;
        fraudType = "High-Value Transaction";
        explanation = "Transaction exceeds normal spending threshold.";
    }
    // --- Rule 2: Blacklisted merchants ---
    const riskyMerchants = ["Electronics Hub", "CryptoWorld", "FastCash"];
    if (riskyMerchants.includes(merchant)) {
        riskScore += 25;
        fraudType = "Suspicious Merchant";
        explanation = "Merchant is flagged for previous fraudulent activity.";
    }
    // --- Rule 3: Suspicious locations ---
    const highRiskLocations = ["Russia", "Nigeria", "China", "Unknown"];
    if (highRiskLocations.includes(location)) {
        riskScore += 30;
        fraudType = "High-Risk Location";
        explanation = "Transaction originated from a known fraud hotspot.";
    }
    // --- Rule 4: Impossible travel (mock) ---
    const recentUserLocation = "USA"; // mock: replace with real user location
    if (location !== recentUserLocation) {
        riskScore += 10;
        if (!fraudType) {
            fraudType = "Impossible Travel";
            explanation = "Transaction location differs from recent user activity.";
        }
    }
    // --- Rule 5: Customer risk history ---
    if (customerId && riskyCustomers.includes(customerId)) {
        riskScore += 20;
        fraudType = "Customer Risk History";
        explanation = "Customer has prior suspicious activity.";
    }
    // --- Rule 6: Employee-linked risk ---
    if (employeeId && riskyEmployees.includes(employeeId)) {
        riskScore += 15;
        fraudType = "Employee-Linked Risk";
        explanation = "Transaction processed by an employee flagged for suspicious behavior.";
    }
    // --- Rule 7: High-risk item ---
    if (itemId && highRiskItems.includes(itemId)) {
        riskScore += 20;
        fraudType = "High-Risk Item";
        explanation = "Item is known to be frequently targeted in fraud.";
    }
    // --- Optional random slight noise to simulate ML ---
    riskScore += Math.floor(Math.random() * 8);
    // Cap at 100
    riskScore = Math.min(100, riskScore);
    // Final classification
    const isFraud = riskScore >= 60 ? "fraud" : "purchase";
    return {
        prediction: isFraud,
        fraudType,
        fraudExplanation: explanation,
        riskScore,
    };
}
