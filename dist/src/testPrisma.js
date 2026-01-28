"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const employees = await prisma.employee.findMany();
    console.log(employees);
}
main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
