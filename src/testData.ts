import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("\n=== EMPLOYEES + TRANSACTIONS ===");
  const employees = await prisma.employee.findMany({
    include: {
      transactions: {
        include: {
          txItems: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(employees, null, 2));

  console.log("\n=== CUSTOMERS + TRANSACTIONS ===");
  const customers = await prisma.customer.findMany({
    include: {
      transactions: {
        include: {
          txItems: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(customers, null, 2));

  console.log("\n=== ITEMS + TRANSACTIONS ===");
  const items = await prisma.item.findMany({
    include: {
      txItems: {
        include: {
          transaction: {
            include: {
              employee: true,
              customer: true,
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(items, null, 2));

  console.log("\n=== ALL TRANSACTIONS (FULL RELATIONS) ===");
  const transactions = await prisma.transaction.findMany({
    include: {
      employee: true,
      customer: true,
      txItems: {
        include: {
          item: true,
        },
      },
    },
  });
  console.log(JSON.stringify(transactions, null, 2));
}

main()
  .catch((e) => {
    console.error("❌ TEST DATA ERROR", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
