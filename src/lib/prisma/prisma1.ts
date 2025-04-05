import { PrismaClient } from '../../../prisma/generated/client1';

declare global {
  var prisma: PrismaClient | undefined;
}

export const client1 = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = client1;

