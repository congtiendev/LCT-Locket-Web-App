const logger = require('@utils/logger');

/**
 * Friend Socket Handler
 * Handles real-time friend request events
 */
class FriendSocketHandler {
  constructor(io) {
    this.io = io;
  }

  /**
   * Emit friend request sent event
   * @param {string} receiverId - User who receives the friend request
   * @param {Object} requestData - Friend request data
   */
  emitFriendRequestSent(receiverId, requestData) {
    try {
      const roomName = `user:${receiverId}`;
      const roomSockets = this.io.sockets.adapter.rooms.get(roomName);
      const socketCount = roomSockets ? roomSockets.size : 0;

      logger.info(
        `📤 Emitting friend request to room ${roomName} (${socketCount} socket${socketCount !== 1 ? 's' : ''})`
      );

      this.io.to(roomName).emit('friend:request:received', {
        type: 'friend:request:received',
        data: {
          request: requestData,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(
        `Friend request sent event emitted: Request ${requestData.id} from ${requestData.sender.id} to ${receiverId}`
      );
    } catch (error) {
      logger.error('Error emitting friend request sent event:', error);
    }
  }

  /**
   * Emit friend request accepted event
   * @param {string} senderId - User who sent the original request
   * @param {Object} acceptorData - User who accepted the request
   */
  emitFriendRequestAccepted(senderId, acceptorData) {
    try {
      const roomName = `user:${senderId}`;
      const roomSockets = this.io.sockets.adapter.rooms.get(roomName);
      const socketCount = roomSockets ? roomSockets.size : 0;

      logger.info(
        `📤 Emitting friend request accepted to room ${roomName} (${socketCount} socket${socketCount !== 1 ? 's' : ''})`
      );

      this.io.to(roomName).emit('friend:request:accepted', {
        type: 'friend:request:accepted',
        data: {
          friend: acceptorData,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(
        `Friend request accepted event emitted: ${acceptorData.id} accepted request from ${senderId}`
      );
    } catch (error) {
      logger.error('Error emitting friend request accepted event:', error);
    }
  }

  /**
   * Emit friend request rejected event
   * @param {string} senderId - User who sent the original request
   * @param {string} requestId - Friend request ID
   */
  emitFriendRequestRejected(senderId, requestId) {
    try {
      const roomName = `user:${senderId}`;
      const roomSockets = this.io.sockets.adapter.rooms.get(roomName);
      const socketCount = roomSockets ? roomSockets.size : 0;

      logger.info(
        `📤 Emitting friend request rejected to room ${roomName} (${socketCount} socket${socketCount !== 1 ? 's' : ''})`
      );

      this.io.to(roomName).emit('friend:request:rejected', {
        type: 'friend:request:rejected',
        data: {
          request_id: requestId,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(`Friend request rejected event emitted: Request ${requestId} rejected`);
    } catch (error) {
      logger.error('Error emitting friend request rejected event:', error);
    }
  }

  /**
   * Emit friend request cancelled event
   * @param {string} receiverId - User who was supposed to receive the request
   * @param {string} requestId - Friend request ID
   */
  emitFriendRequestCancelled(receiverId, requestId) {
    try {
      const roomName = `user:${receiverId}`;
      const roomSockets = this.io.sockets.adapter.rooms.get(roomName);
      const socketCount = roomSockets ? roomSockets.size : 0;

      logger.info(
        `📤 Emitting friend request cancelled to room ${roomName} (${socketCount} socket${socketCount !== 1 ? 's' : ''})`
      );

      this.io.to(roomName).emit('friend:request:cancelled', {
        type: 'friend:request:cancelled',
        data: {
          request_id: requestId,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(`Friend request cancelled event emitted: Request ${requestId} cancelled`);
    } catch (error) {
      logger.error('Error emitting friend request cancelled event:', error);
    }
  }
}

module.exports = FriendSocketHandler;
