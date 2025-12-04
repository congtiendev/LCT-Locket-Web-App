const chatService = require('../services/chat.service');
const { successResponse } = require('@utils/response');
const HTTP_STATUS = require('@constants/http-status');

/**
 * Chat Controller
 * Handles HTTP requests for chat operations
 */
class ChatController {
  /**
   * Get or create chat thread
   * POST /api/chats/threads
   */
  async getOrCreateThread(req, res, next) {
    try {
      const currentUserId = req.user.id;
      const { post_id, other_user_id } = req.body;

      const result = await chatService.getOrCreateThread(currentUserId, post_id, other_user_id);

      return successResponse(res, result, 'Thread retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get messages in thread
   * GET /api/chats/threads/:threadId/messages
   */
  async getMessages(req, res, next) {
    try {
      const currentUserId = req.user.id;
      const { threadId } = req.params;
      const { limit, before } = req.query;

      const result = await chatService.getMessages(threadId, currentUserId, {
        limit: limit ? parseInt(limit) : 50,
        before,
      });

      return successResponse(res, result, 'Messages retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send message in thread
   * POST /api/chats/threads/:threadId/messages
   */
  async sendMessage(req, res, next) {
    try {
      const currentUserId = req.user.id;
      const { threadId } = req.params;
      const { message, photo_url } = req.body;

      const result = await chatService.sendMessage(threadId, currentUserId, {
        message,
        photo_url,
      });

      return successResponse(res, result, 'Message sent successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark messages as read
   * PUT /api/chats/threads/:threadId/read
   */
  async markAsRead(req, res, next) {
    try {
      const currentUserId = req.user.id;
      const { threadId } = req.params;

      const result = await chatService.markMessagesAsRead(threadId, currentUserId);

      return successResponse(res, result, 'Messages marked as read', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all threads for user
   * GET /api/chats/threads
   */
  async getThreads(req, res, next) {
    try {
      const currentUserId = req.user.id;
      const { limit, offset } = req.query;

      const result = await chatService.getThreads(currentUserId, {
        limit: limit ? parseInt(limit) : 20,
        offset: offset ? parseInt(offset) : 0,
      });

      return successResponse(res, result, 'Threads retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload photo for chat
   * POST /api/chats/upload-photo
   */
  async uploadPhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file uploaded',
          },
        });
      }

      const { app } = require('@config');
      const photoUrl = `/uploads/chat/${req.file.filename}`;
      const fullPhotoUrl = `${app.appUrl}${photoUrl}`;

      // For thumbnails, you could generate them here
      const thumbnailUrl = `${app.appUrl}/uploads/chat/thumbs/${req.file.filename}`;

      return successResponse(
        res,
        {
          photo_url: fullPhotoUrl,
          thumbnail_url: thumbnailUrl,
        },
        'Photo uploaded successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
