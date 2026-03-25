## Fraud Detection Dashboard - Backend

A backend server for the Fraud Detection Dashboard built with Node.js, Express, Prisma, and PostgreSQL (Neon). Handles transaction data, employee insights, and fraud prediction logic.

## 🚀 Features

Transaction Monitoring: Provides API endpoints to fetch, add, edit, and delete transactions.

Fraud Prediction: Evaluate transactions for potential fraud using a custom AI-powered engine.

Employee Insights: Track employee activity related to transaction monitoring.

Developer-Friendly: Full-stack ready with Prisma ORM for database interactions.

## 🛠 Tech Stack

Backend: Node.js, Express.js, Prisma ORM, PostgreSQL (Neon)

Authentication & Security: JWT or custom middleware

Tools: VS Code, Git, Postman

## 📂 Project Structure
backend/
├─ routes/              # API routes (transactions, employees)
├─ utils/               # Fraud evaluation engine, helper functions
├─ prisma/              # Prisma schema & migrations
├─ index.ts             # Main Express server
├─ package.json
└─ .env                 # Environment variables (DB connection)
```
## ⚙️ Installation & Setup

Prerequisites

Node.js v18+

npm or yarn

PostgreSQL (or Neon database)

Setup Steps

Navigate to backend:

cd backend

Install dependencies:

npm install

Create a .env file based on .env.example:

DATABASE_URL=postgresql://username:password@host:port/dbname
PORT=5000

Run Prisma migrations and generate client:

npx prisma migrate dev --name init
npx prisma generate

Start the backend server:

npm run dev
🖥 Usage

Test API endpoints via Postman or a REST client.

Base URL: http://localhost:5000

Endpoints include /transactions and /employees.
```

## 📈 Architecture

Backend exposes REST API routes.

Uses Prisma ORM for database operations.

Fraud evaluation uses custom logic inside utils/fraudEngine.ts.

Database stores transactions, employees, and fraud predictions for real-time access.

## 📝 License

MIT License © 2026 Juan Peralta
