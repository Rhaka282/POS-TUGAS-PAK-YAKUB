import { PrismaClient } from '@prisma/client';
import config from './prisma.config.ts';

try {
  const prisma = new PrismaClient(config);
  await prisma.$connect();
  console.log("Connected successfully!");
} catch (e) {
  console.error("PRISMA ERROR:", e);
}
