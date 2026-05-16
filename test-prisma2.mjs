import { PrismaClient } from '@prisma/client';
try {
  console.log("DB URL:", process.env.DATABASE_URL);
  const prisma = new PrismaClient({ log: ['query'] });
  await prisma.$connect();
  console.log("Connected successfully!");
} catch (e) {
  console.error("PRISMA ERROR:", e);
}
