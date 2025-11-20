const socketAuthMiddleware = require('./middlewares/auth.middleware');
const PhotoSocketHandler = require('./handlers/photo.handler');
const logger = require('@utils/logger');

/**
 * Initialize Socket.IO
 */
function initializeSocket(io) {
  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Initialize handlers
  const photoHandler = new PhotoSocketHandler(io);

  // Handle connections
  io.on('connection', (socket) => {
    const userId = socket.userId;
    logger.info(`Socket connected: User ${userId} (Socket ID: ${socket.id})`);

    // Join user's personal room for receiving notifications
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} joined room: user:${userId}`);

    // Handle joining photo rooms (for real-time updates on specific photos)
    socket.on('photo:join', (photoId) => {
      socket.join(`photo:${photoId}`);
      logger.info(`User ${userId} joined photo room: photo:${photoId}`);
    });

    // Handle leaving photo rooms
    socket.on('photo:leave', (photoId) => {
      socket.leave(`photo:${photoId}`);
      logger.info(`User ${userId} left photo room: photo:${photoId}`);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: User ${userId} (Reason: ${reason})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  // Store handlers in io instance for access from controllers
  io.photoHandler = photoHandler;

  logger.info('Socket.IO initialized with handlers');
  return io;
}

module.exports = { initializeSocket };
