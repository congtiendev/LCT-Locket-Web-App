const logger = require('@utils/logger');

/**
 * Photo Socket Handler
 * Handles real-time photo events
 */
class PhotoSocketHandler {
  constructor(io) {
    this.io = io;
  }

  /**
   * Emit new photo uploaded event to user's friends
   * @param {string} userId - User who uploaded the photo
   * @param {Array} friendIds - Array of friend user IDs
   * @param {Object} photoData - Photo data to send
   */
  emitPhotoUploaded(userId, friendIds, photoData) {
    try {
      // Check connected sockets
      const connectedSockets = this.io.sockets.sockets.size;
      logger.info(`📊 Total connected sockets: ${connectedSockets}`);

      // Emit to each friend
      friendIds.forEach((friendId) => {
        const roomName = `user:${friendId}`;
        const roomSockets = this.io.sockets.adapter.rooms.get(roomName);
        const socketCount = roomSockets ? roomSockets.size : 0;

        logger.info(
          `📤 Emitting to room ${roomName} (${socketCount} socket${socketCount !== 1 ? 's' : ''})`
        );

        this.io.to(roomName).emit('photo:uploaded', {
          type: 'photo:uploaded',
          data: {
            photo: photoData,
            uploaded_by: userId,
          },
          timestamp: new Date().toISOString(),
        });
      });

      logger.info(
        `Photo uploaded event emitted: Photo ${photoData.id} by user ${userId} to ${friendIds.length} friends`
      );
    } catch (error) {
      logger.error('Error emitting photo uploaded event:', error);
    }
  }

  /**
   * Emit photo reaction event
   * @param {string} photoId - Photo ID
   * @param {string} photoOwnerId - Photo owner user ID
   * @param {Object} reactionData - Reaction data
   */
  emitPhotoReaction(photoId, photoOwnerId, reactionData) {
    try {
      // Emit to photo owner
      this.io.to(`user:${photoOwnerId}`).emit('photo:reaction', {
        type: 'photo:reaction',
        data: {
          photo_id: photoId,
          reaction: reactionData,
        },
        timestamp: new Date().toISOString(),
      });

      // Also emit to all users viewing this photo (in photo room)
      this.io.to(`photo:${photoId}`).emit('photo:reaction:updated', {
        type: 'photo:reaction:updated',
        data: {
          photo_id: photoId,
          reaction: reactionData,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(
        `Photo reaction event emitted: Photo ${photoId} reacted by user ${reactionData.user_id}`
      );
    } catch (error) {
      logger.error('Error emitting photo reaction event:', error);
    }
  }

  /**
   * Emit photo reaction removed event
   * @param {string} photoId - Photo ID
   * @param {string} photoOwnerId - Photo owner user ID
   * @param {string} userId - User who removed reaction
   */
  emitPhotoReactionRemoved(photoId, photoOwnerId, userId) {
    try {
      // Emit to photo owner
      this.io.to(`user:${photoOwnerId}`).emit('photo:reaction:removed', {
        type: 'photo:reaction:removed',
        data: {
          photo_id: photoId,
          user_id: userId,
        },
        timestamp: new Date().toISOString(),
      });

      // Also emit to all users viewing this photo
      this.io.to(`photo:${photoId}`).emit('photo:reaction:updated', {
        type: 'photo:reaction:updated',
        data: {
          photo_id: photoId,
          user_id: userId,
          removed: true,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(`Photo reaction removed event emitted: Photo ${photoId} by user ${userId}`);
    } catch (error) {
      logger.error('Error emitting photo reaction removed event:', error);
    }
  }

  /**
   * Emit photo view event
   * @param {string} photoId - Photo ID
   * @param {string} photoOwnerId - Photo owner user ID
   * @param {Object} viewData - View data
   */
  emitPhotoView(photoId, photoOwnerId, viewData) {
    try {
      // Emit to photo owner only
      this.io.to(`user:${photoOwnerId}`).emit('photo:viewed', {
        type: 'photo:viewed',
        data: {
          photo_id: photoId,
          view: viewData,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info(`Photo view event emitted: Photo ${photoId} viewed by user ${viewData.user_id}`);
    } catch (error) {
      logger.error('Error emitting photo view event:', error);
    }
  }
}

module.exports = PhotoSocketHandler;
