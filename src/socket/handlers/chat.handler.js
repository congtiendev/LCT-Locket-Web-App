const logger = require('@utils/logger');
const chatThreadRepository = require('@modules/chats/repositories/chat-thread.repository');

/**
 * Chat Socket Handler
 * Handles real-time chat events via Socket.IO
 */
class ChatSocketHandler {
  constructor(io) {
    this.io = io;
  }

  /**
   * Handle user joining a chat thread room
   */
  async handleJoinThread(socket, data, callback) {
    try {
      const { thread_id } = data;
      const userId = socket.userId;

      // Verify user is participant in thread
      const isParticipant = await chatThreadRepository.isParticipant(thread_id, userId);

      if (!isParticipant) {
        logger.warn(`User ${userId} attempted to join thread ${thread_id} without permission`);
        if (callback) {
          callback({
            success: false,
            error: 'You are not a participant in this thread',
          });
        }
        return;
      }

      // Join the thread room
      socket.join(`thread:${thread_id}`);
      logger.info(`User ${userId} joined thread room: thread:${thread_id}`);

      if (callback) {
        callback({
          success: true,
          message: 'Joined thread successfully',
        });
      }
    } catch (error) {
      logger.error('Error joining thread:', error);
      if (callback) {
        callback({
          success: false,
          error: 'Failed to join thread',
        });
      }
    }
  }

  /**
   * Handle user leaving a chat thread room
   */
  handleLeaveThread(socket, data) {
    try {
      const { thread_id } = data;
      const userId = socket.userId;

      socket.leave(`thread:${thread_id}`);
      logger.info(`User ${userId} left thread room: thread:${thread_id}`);
    } catch (error) {
      logger.error('Error leaving thread:', error);
    }
  }

  /**
   * Emit new message event to receiver
   */
  emitNewMessage(receiverId, threadId, message) {
    try {
      // Emit to user's personal room
      this.io.to(`user:${receiverId}`).emit('chat:new_message', {
        thread_id: threadId,
        message,
      });

      logger.info(`New message event emitted to user ${receiverId} in thread ${threadId}`);
    } catch (error) {
      logger.error('Failed to emit new message event:', error);
    }
  }

  /**
   * Emit messages read event to thread participants
   */
  emitMessagesRead(threadId, readerId) {
    try {
      // Emit to thread room (all participants)
      this.io.to(`thread:${threadId}`).emit('chat:messages_read', {
        thread_id: threadId,
        reader_id: readerId,
        read_at: new Date().toISOString(),
      });

      logger.info(`Messages read event emitted to thread ${threadId} by user ${readerId}`);
    } catch (error) {
      logger.error('Failed to emit messages read event:', error);
    }
  }

  /**
   * Emit typing indicator (optional - for future implementation)
   */
  emitTyping(threadId, userId, isTyping) {
    try {
      this.io.to(`thread:${threadId}`).emit('chat:typing', {
        thread_id: threadId,
        user_id: userId,
        is_typing: isTyping,
      });
    } catch (error) {
      logger.error('Failed to emit typing event:', error);
    }
  }
}

module.exports = ChatSocketHandler;
