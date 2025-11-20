require('dotenv').config();
require('module-alias/register');
const app = require('./src/app');
const logger = require('./src/shared/utils/logger');
const config = require('./src/config');

// Import Socket.IO
const socketConfig = require('./src/config/socket.config');
const { initializeSocket } = require('./src/socket');

// Import queue processors
const { emailQueue, notificationQueue } = require('./src/core/queue/bull.config');
const processEmail = require('./src/core/queue/processors/email.processor');
const processNotification = require('./src/core/queue/processors/notification.processor');

// Register queue processors
emailQueue.process(processEmail);
notificationQueue.process(processNotification);

// Import event listeners
const eventEmitter = require('./src/core/events/event-emitter');
const handleUserCreated = require('./src/core/events/listeners/user-created.listener');
const handleOrderPlaced = require('./src/core/events/listeners/order-placed.listener');

// Register event listeners
eventEmitter.onEvent('user.created', handleUserCreated);
eventEmitter.onEvent('order.placed', handleOrderPlaced);

const PORT = config.app.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.app.env} mode on port ${PORT}`);
  logger.info(`App name: ${config.app.appName}`);
  logger.info(`App URL: ${config.app.appUrl}`);
});

// Initialize Socket.IO
const io = socketConfig.init(server);
initializeSocket(io);
logger.info('Socket.IO initialized and ready');

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = server;
