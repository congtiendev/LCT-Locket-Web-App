require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('Resetting database...');

  try {
    // Reset database
    console.log('Running prisma migrate reset...');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

    console.log('Database reset completed!');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
