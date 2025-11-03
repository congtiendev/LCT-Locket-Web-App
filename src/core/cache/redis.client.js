const Redis = require('ioredis');
const logger = require('@utils/logger');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error', err);
});

process.on('beforeExit', async () => {
  await redisClient.quit();
  logger.info('Redis disconnected');
});

module.exports = redisClient;
