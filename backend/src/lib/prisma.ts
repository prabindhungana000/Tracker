import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __foodJourneyPrisma__: PrismaClient | undefined;
}

const prisma = global.__foodJourneyPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__foodJourneyPrisma__ = prisma;
}

export default prisma;
