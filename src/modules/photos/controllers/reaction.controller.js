const reactionService = require('../services/reaction.service');
const { successResponse, errorResponse } = require('@utils/response');
const HTTP_STATUS = require('@constants/http-status');
const logger = require('@utils/logger');

/**
 * Reaction Controller
 * Handles HTTP requests for photo reactions
 */
class ReactionController {
  /**
   * Add reaction to photo
   * POST /api/photos/:photoId/reactions
   */
  async addReaction(req, res, next) {
    try {
      const { photoId } = req.params;
      const userId = req.user.id;
      const { emoji } = req.body;

      if (!emoji) {
        return errorResponse(res, 'Emoji is required', HTTP_STATUS.BAD_REQUEST);
      }

      const reaction = await reactionService.addReaction(photoId, userId, emoji);

      return successResponse(res, reaction, 'Reaction added successfully');
    } catch (error) {
      logger.error('Add reaction error:', error);
      next(error);
    }
  }

  /**
   * Remove reaction from photo
   * DELETE /api/photos/:photoId/reactions
   */
  async removeReaction(req, res, next) {
    try {
      const { photoId } = req.params;
      const userId = req.user.id;

      const result = await reactionService.removeReaction(photoId, userId);

      return successResponse(res, result, 'Reaction removed successfully');
    } catch (error) {
      logger.error('Remove reaction error:', error);
      next(error);
    }
  }

  /**
   * Get all reactions for a photo
   * GET /api/photos/:photoId/reactions
   */
  async getReactions(req, res, next) {
    try {
      const { photoId } = req.params;
      const userId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;

      const result = await reactionService.getReactions(photoId, userId, {
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return successResponse(res, result);
    } catch (error) {
      logger.error('Get reactions error:', error);
      next(error);
    }
  }
}

module.exports = new ReactionController();
