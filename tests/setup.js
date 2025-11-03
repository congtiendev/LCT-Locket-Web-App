const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
  console.log('Test environment cleaned up');
});

beforeEach(async () => {
  // Clean database before each test if needed
});

afterEach(async () => {
  // Cleanup after each test if needed
});
