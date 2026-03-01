import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { loadEnv } from 'vite';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getConnectionString(): string {
  // process.env.DATABASE_URL is available in production (Node adapter)
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // In dev, Vite doesn't populate process.env — load from .env manually
  const env = loadEnv('', process.cwd(), '');
  return env.DATABASE_URL;
}

function createPrismaClient() {
  const connectionString = getConnectionString();
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
