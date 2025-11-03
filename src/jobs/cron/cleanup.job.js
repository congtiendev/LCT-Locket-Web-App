const cron = require('node-cron');
const logger = require('@utils/logger');
const tokenRepository = require('@modules/auth/repositories/token.repository');

// Run every day at midnight
const cleanupJob = cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Running cleanup job...');

    // Delete expired tokens
    await tokenRepository.deleteExpired();

    logger.info('Cleanup job completed successfully');
  } catch (error) {
    logger.error('Cleanup job failed:', error);
  }
});

module.exports = cleanupJob;
