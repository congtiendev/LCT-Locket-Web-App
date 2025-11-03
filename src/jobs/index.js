const logger = require('@utils/logger');
const cleanupJob = require('./cron/cleanup.job');
const reportJob = require('./cron/report.job');

const startJobs = () => {
  logger.info('Starting cron jobs...');

  cleanupJob.start();
  reportJob.start();

  logger.info('All cron jobs started successfully');
};

const stopJobs = () => {
  logger.info('Stopping cron jobs...');

  cleanupJob.stop();
  reportJob.stop();

  logger.info('All cron jobs stopped');
};

module.exports = {
  startJobs,
  stopJobs,
};
