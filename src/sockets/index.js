const socketIO = require('socket.io');
const logger = require('@utils/logger');
const handleChatConnection = require('./handlers/chat.handler');
const { handleNotificationConnection } = require('./handlers/notification.handler');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    // Handle different namespaces
    handleChatConnection(socket);
    handleNotificationConnection(socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized successfully');

  return io;
};

module.exports = initializeSocket;
