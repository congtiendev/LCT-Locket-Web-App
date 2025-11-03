const cron = require('node-cron');
const logger = require('@utils/logger');

// Run every Monday at 9 AM
const reportJob = cron.schedule('0 9 * * 1', async () => {
  try {
    logger.info('Running weekly report job...');

    // TODO: Generate and send weekly report

    logger.info('Weekly report job completed successfully');
  } catch (error) {
    logger.error('Weekly report job failed:', error);
  }
});

module.exports = reportJob;
