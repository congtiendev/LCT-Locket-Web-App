const logger = require('@utils/logger');

const handleNotificationConnection = (socket) => {
  logger.info(`User connected to notifications: ${socket.id}`);

  socket.on('subscribe', (userId) => {
    socket.join(`user_${userId}`);
    logger.info(`User ${socket.id} subscribed to notifications`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected from notifications: ${socket.id}`);
  });
};

const sendNotification = (io, userId, notification) => {
  io.to(`user_${userId}`).emit('notification', notification);
};

module.exports = {
  handleNotificationConnection,
  sendNotification,
};
