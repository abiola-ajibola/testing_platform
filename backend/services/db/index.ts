import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
