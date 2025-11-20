const photoService = require('../services/photo.service');
const { successResponse, errorResponse } = require('@utils/response');
const HTTP_STATUS = require('@constants/http-status');
const logger = require('@utils/logger');
const socketConfig = require('@config/socket.config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Photo Controller
 * Handles HTTP requests for photo management
 */
class PhotoController {
  /**
   * Upload new photo
   * POST /api/photos
   */
  async upload(req, res, next) {
    try {
      const userId = req.user.id;
      const file = req.file;
      const { caption } = req.body;

      if (!file) {
        return errorResponse(res, 'No file uploaded', HTTP_STATUS.BAD_REQUEST);
      }

      const photo = await photoService.uploadPhoto(userId, file, caption);

      // Emit real-time event to friends
      try {
        // Get user's friends
        const friendships = await prisma.friendship.findMany({
          where: { userId },
          select: { friendId: true },
        });
        const friendIds = friendships.map((f) => f.friendId);

        // Emit to Socket.IO
        if (friendIds.length > 0) {
          const io = socketConfig.getIO();
          if (io.photoHandler) {
            io.photoHandler.emitPhotoUploaded(userId, friendIds, photo);
          }
        }
      } catch (socketError) {
        // Don't fail the request if socket emission fails
        logger.error('Failed to emit photo upload event:', socketError);
      }

      return successResponse(res, photo, 'Photo uploaded successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      logger.error('Photo upload error:', error);
      next(error);
    }
  }

  /**
   * Get photo by ID
   * GET /api/photos/:photoId
   */
  async getById(req, res, next) {
    try {
      const { photoId } = req.params;
      const userId = req.user.id;

      const photo = await photoService.getPhotoById(photoId, userId);

      return successResponse(res, photo);
    } catch (error) {
      logger.error('Get photo error:', error);
      next(error);
    }
  }

  /**
   * Get my photos
   * GET /api/photos/my
   */
  async getMyPhotos(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0, order = 'desc' } = req.query;

      const result = await photoService.getMyPhotos(userId, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order,
      });

      return successResponse(res, result);
    } catch (error) {
      logger.error('Get my photos error:', error);
      next(error);
    }
  }

  /**
   * Get feed (friends' photos)
   * GET /api/photos/feed
   */
  async getFeed(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0, order = 'desc', friend_id } = req.query;

      const result = await photoService.getFeed(userId, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order,
        friendId: friend_id,
      });

      return successResponse(res, result);
    } catch (error) {
      logger.error('Get feed error:', error);
      next(error);
    }
  }

  /**
   * Delete photo
   * DELETE /api/photos/:photoId
   */
  async delete(req, res, next) {
    try {
      const { photoId } = req.params;
      const userId = req.user.id;

      const result = await photoService.deletePhoto(photoId, userId);

      return successResponse(res, result, 'Photo deleted successfully');
    } catch (error) {
      logger.error('Delete photo error:', error);
      next(error);
    }
  }
}

module.exports = new PhotoController();
