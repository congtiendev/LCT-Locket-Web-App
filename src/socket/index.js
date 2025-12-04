const socketAuthMiddleware = require('./middlewares/auth.middleware');
const PhotoSocketHandler = require('./handlers/photo.handler');
const FriendSocketHandler = require('./handlers/friend.handler');
const ChatSocketHandler = require('./handlers/chat.handler');
const logger = require('@utils/logger');

/**
 * Initialize Socket.IO
 */
function initializeSocket(io) {
  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Initialize handlers
  const photoHandler = new PhotoSocketHandler(io);
  const friendHandler = new FriendSocketHandler(io);
  const chatHandler = new ChatSocketHandler(io);

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

    // Handle joining chat thread rooms
    socket.on('chat:join_thread', (data, callback) => {
      chatHandler.handleJoinThread(socket, data, callback);
    });

    // Handle leaving chat thread rooms
    socket.on('chat:leave_thread', (data) => {
      chatHandler.handleLeaveThread(socket, data);
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
  io.friendHandler = friendHandler;
  io.chatHandler = chatHandler;

  logger.info('Socket.IO initialized with handlers');
  return io;
}

module.exports = { initializeSocket };
