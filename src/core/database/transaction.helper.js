const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const executeTransaction = async (callback) => prisma.$transaction(callback);

module.exports = {
  executeTransaction,
};
