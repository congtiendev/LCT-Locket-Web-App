require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lct.com' },
    update: {},
    create: {
      email: 'admin@lct.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log('Created admin:', admin.email);

  // Create test users
  for (let i = 1; i <= 5; i++) {
    await prisma.user.upsert({
      where: { email: `user${i}@lct.com` },
      update: {},
      create: {
        email: `user${i}@lct.com`,
        password: hashedPassword,
        name: `Test User ${i}`,
        role: 'USER',
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
  }

  console.log('Created 5 test users');
  console.log('Seed completed!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
