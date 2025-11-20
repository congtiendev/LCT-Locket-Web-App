const jwt = require('jsonwebtoken');
const config = require('@config');
const logger = require('@utils/logger');

/**
 * Socket.IO Authentication Middleware
 * Verifies JWT token from handshake auth or query
 */
const socketAuthMiddleware = async (socket, next) => {
  try {
    // Get token from auth header or query parameter
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
      socket.handshake.query?.token;

    if (!token) {
      logger.warn('Socket connection rejected: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret);

    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.user = decoded;

    logger.info(`Socket authenticated: User ${decoded.userId}`);
    next();
  } catch (error) {
    logger.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = socketAuthMiddleware;
