const { Server } = require('socket.io');
const logger = require('@utils/logger');

/**
 * Socket.IO Configuration
 */
class SocketConfig {
  constructor() {
    this.io = null;
  }

  /**
   * Initialize Socket.IO server
   */
  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: this.getAllowedOrigins(),
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    logger.info('Socket.IO server initialized');
    return this.io;
  }

  /**
   * Get allowed CORS origins
   */
  getAllowedOrigins() {
    const origins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ].filter(Boolean);

    // Add support for all .figma.site domains
    return (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) return callback(null, true);
      if (origin.endsWith('.figma.site')) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    };
  }

  /**
   * Get Socket.IO instance
   */
  getIO() {
    if (!this.io) {
      throw new Error('Socket.IO not initialized. Call init() first.');
    }
    return this.io;
  }
}

module.exports = new SocketConfig();
