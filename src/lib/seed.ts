import { PrismaClient } from '@prisma/client';
import { hashPassword, generateApiKey } from './auth';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword('testpass123');
  const apiKey = generateApiKey();
  const user = await prisma.user.upsert({
    where: { email: 'test@scenara.dev' },
    update: {},
    create: {
      email: 'test@scenara.dev',
      name: 'Test User',
      passwordHash,
      apiKey,
    },
  });
  console.log('Seed user created:', user.id, user.email, 'apiKey:', user.apiKey);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
