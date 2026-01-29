"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomPastDate(daysBack) {
    const now = new Date();
    const past = new Date(now);
    past.setDate(now.getDate() - getRandomInt(0, daysBack));
    past.setHours(getRandomInt(8, 22), getRandomInt(0, 59), getRandomInt(0, 59)); // 8am–10pm
    return past;
}
const fraudScenarios = [
    { type: "High-Risk Item", explanation: "High shrink-risk item frequently involved in fraud cases." },
    { type: "Suspicious Refund Pattern", explanation: "Multiple refunds processed by the same employee within a short period." },
    { type: "Employee Behavior Anomaly", explanation: "Employee transaction behavior deviates from historical baseline." },
    { type: "Customer Risk Spike", explanation: "Customer risk score increased due to repeated high-value purchases." },
    { type: "After-Hours Transaction", explanation: "Transaction occurred outside normal store operating hours." },
    { type: "Item Velocity Anomaly", explanation: "Item sold at unusually high frequency compared to historical norms." },
];
async function main() {
    console.log("🌱 Clearing existing data...");
    await prisma.transactionItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.item.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.store.deleteMany();
    console.log("🌱 Seeding new data...");
    // Stores
    const store1 = await prisma.store.create({ data: { name: "Main Street Store", location: "123 Main St" } });
    const store2 = await prisma.store.create({ data: { name: "Mall Outlet", location: "456 Mall Rd" } });
    const stores = [store1, store2];
    // Employees
    const employeeData = [
        { firstName: "Bob", lastName: "Johnson", role: "Cashier" },
        { firstName: "Alice", lastName: "Smith", role: "Manager" },
        { firstName: "John", lastName: "Doe", role: "Cashier" },
        { firstName: "Jane", lastName: "Roe", role: "Manager" },
        { firstName: "Mike", lastName: "Brown", role: "Cashier" },
        { firstName: "Sara", lastName: "Davis", role: "Manager" },
    ];
    const employees = [];
    for (const emp of employeeData) {
        const e = await prisma.employee.create({
            data: {
                ...emp,
                email: `${emp.firstName.toLowerCase()}.${emp.lastName.toLowerCase()}@example.com`,
                storeId: stores[getRandomInt(0, stores.length - 1)].id,
                suspicionScore: getRandomInt(0, 50),
                flaggedCount: getRandomInt(0, 5),
            },
        });
        employees.push(e);
    }
    // Customers
    const customerData = Array.from({ length: 15 }, (_, i) => ({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
    }));
    const customers = [];
    for (const c of customerData) {
        const cust = await prisma.customer.create({ data: c });
        customers.push(cust);
    }
    // Items
    const itemData = [
        { name: "Laptop", price: 1200 },
        { name: "Smartphone", price: 800 },
        { name: "Headphones", price: 150 },
        { name: "Monitor", price: 300 },
        { name: "Keyboard", price: 100 },
        { name: "Mouse", price: 50 },
        { name: "Tablet", price: 600 },
        { name: "Camera", price: 700 },
        { name: "Printer", price: 200 },
        { name: "Desk Lamp", price: 40 },
    ];
    const items = [];
    for (const i of itemData) {
        const item = await prisma.item.create({
            data: {
                ...i,
                stock: getRandomInt(5, 20),
                shrinkRisk: getRandomInt(0, 60),
            },
        });
        items.push(item);
    }
    // Transactions
    const transactionTypes = [client_1.TransactionType.SALE, client_1.TransactionType.REFUND, client_1.TransactionType.FRAUD];
    for (let i = 0; i < 50; i++) {
        const emp = employees[getRandomInt(0, employees.length - 1)];
        const cust = customers[getRandomInt(0, customers.length - 1)];
        const store = stores[getRandomInt(0, stores.length - 1)];
        const type = transactionTypes[getRandomInt(0, transactionTypes.length - 1)];
        const txItemsCount = getRandomInt(1, 5);
        const selectedItems = Array.from({ length: txItemsCount }, () => items[getRandomInt(0, items.length - 1)]);
        const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * getRandomInt(1, 5), // random quantity multiplier
        0);
        const fraudScenario = type === client_1.TransactionType.FRAUD
            ? fraudScenarios[getRandomInt(0, fraudScenarios.length - 1)]
            : null;
        await prisma.transaction.create({
            data: {
                employeeId: emp.id,
                customerId: cust.id,
                storeId: store.id,
                transactionType: type,
                totalAmount,
                riskScore: type === client_1.TransactionType.FRAUD ? getRandomInt(60, 100) : getRandomInt(0, 40),
                fraudType: fraudScenario?.type ?? null,
                fraudExplanation: fraudScenario?.explanation ?? null,
                createdAt: getRandomPastDate(30), // random timestamp in last 30 days
                txItems: {
                    create: selectedItems.map((item) => ({
                        itemId: item.id,
                        quantity: getRandomInt(1, 5),
                        unitPrice: item.price,
                    })),
                },
            },
        });
    }
    console.log("🌱 DONE — Database seeded with richer variety!");
}
main()
    .catch((e) => {
    console.error("❌ SEED ERROR", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
