import { PrismaClient } from '../../../prisma/generated/client2';


declare global {
  var prisma2: PrismaClient | undefined;
}

export const client2 = globalThis.prisma2 || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalThis.prisma2 = client2;
