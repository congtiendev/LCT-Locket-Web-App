const Bull = require('bull');
const logger = require('@utils/logger');

// Check if Redis should be disabled
const DISABLE_REDIS = process.env.DISABLE_REDIS === 'true';

const createQueue = (name, options = {}) => {
  if (DISABLE_REDIS) {
    logger.warn(`Queue ${name} disabled: Redis not available`);
    return {
      process: () => logger.info(`Mock queue ${name}: process() called`),
      add: () => logger.info(`Mock queue ${name}: add() called`),
      on: () => {},
      close: () => Promise.resolve(),
    };
  }

  const queue = new Bull(name, {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
    ...options,
  });

  queue.on('error', (error) => {
    logger.error(`Queue ${name} error:`, error);
  });

  queue.on('failed', (job, err) => {
    logger.error(`Job ${job.id} in queue ${name} failed:`, err);
  });

  queue.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue ${name} completed`);
  });

  return queue;
};

const emailQueue = createQueue('email');
const notificationQueue = createQueue('notification');

module.exports = {
  createQueue,
  emailQueue,
  notificationQueue,
};
