const jwt = require('jsonwebtoken');
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

    logger.info('🔍 Socket auth attempt:');
    logger.info(`  - Token present: ${!!token}`);
    logger.info(`  - Token length: ${token?.length || 0}`);
    logger.info(`  - Token preview: ${token?.substring(0, 50)}...`);

    if (!token) {
      logger.warn('Socket connection rejected: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify token (use same secret as HTTP authentication)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    logger.info('✅ Token decoded successfully:');
    logger.info(`  - userId: ${decoded.userId}`);
    logger.info(`  - iat: ${decoded.iat}`);
    logger.info(`  - exp: ${decoded.exp}`);

    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.user = decoded;

    logger.info(`Socket authenticated: User ${decoded.userId}`);
    next();
  } catch (error) {
    logger.error('❌ Socket authentication error:');
    logger.error(`  - Error name: ${error.name}`);
    logger.error(`  - Error message: ${error.message}`);
    logger.error(`  - Stack: ${error.stack}`);
    next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = socketAuthMiddleware;
