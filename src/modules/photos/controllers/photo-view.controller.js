const photoViewService = require('../services/photo-view.service');
const logger = require('@utils/logger');
const socketConfig = require('@config/socket.config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Photo View Controller
 * Handles HTTP requests for photo view tracking
 */
class PhotoViewController {
  /**
   * Record a photo view
   * POST /api/photos/:photoId/views
   */
  async recordView(req, res, next) {
    try {
      const userId = req.user.id;
      const { photoId } = req.params;

      const result = await photoViewService.recordView(photoId, userId);

      // Emit real-time event to photo owner
      try {
        const photo = await prisma.photo.findUnique({
          where: { id: photoId },
          select: { userId: true },
        });

        if (photo && photo.userId !== userId) {
          const io = socketConfig.getIO();
          if (io.photoHandler) {
            io.photoHandler.emitPhotoView(photoId, photo.userId, result);
          }
        }
      } catch (socketError) {
        logger.error('Failed to emit view event:', socketError);
      }

      res.status(201).json({
        success: true,
        data: result,
        message: 'Photo view recorded',
      });
    } catch (error) {
      logger.error('Record photo view error:', error);
      next(error);
    }
  }

  /**
   * Get viewers list for a photo
   * GET /api/photos/:photoId/views
   */
  async getViewers(req, res, next) {
    try {
      const userId = req.user.id;
      const { photoId } = req.params;
      const { limit, offset } = req.query;

      const result = await photoViewService.getViewers(photoId, userId, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Get photo viewers error:', error);
      next(error);
    }
  }
}

module.exports = new PhotoViewController();
