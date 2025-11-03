const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const cleanDatabase = async () => {
  const tables = ['Token', 'User'];

  for (const table of tables) {
    await prisma[table.toLowerCase()].deleteMany({});
  }
};

const createTestUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

module.exports = {
  cleanDatabase,
  createTestUser,
  prisma,
};
