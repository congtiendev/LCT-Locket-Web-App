const { PrismaClient } = require('@prisma/client');
const logger = require('@utils/logger');

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

prisma
  .$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error('Database connection failed', error);
    process.exit(1);
  });

process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
});

module.exports = prisma;
