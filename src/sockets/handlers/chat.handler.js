const logger = require('@utils/logger');

const handleChatConnection = (socket) => {
  logger.info(`User connected to chat: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    logger.info(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    const { room, message } = data;
    socket.to(room).emit('receive_message', {
      userId: socket.userId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on('typing', (data) => {
    const { room } = data;
    socket.to(room).emit('user_typing', {
      userId: socket.userId,
    });
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected from chat: ${socket.id}`);
  });
};

module.exports = handleChatConnection;
