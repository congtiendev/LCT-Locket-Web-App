const friendService = require('../services/friend.service');

/**
 * Friend Controller
 * Handles HTTP requests for friend operations
 */
class FriendController {
  /**
   * Get friends list
   * GET /api/friends
   */
  async getFriends(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit, offset } = req.query;

      const result = await friendService.getFriends(userId, { limit, offset });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove friend
   * DELETE /api/friends/:friendId
   */
  async removeFriend(req, res, next) {
    try {
      const userId = req.user.id;
      const { friendId } = req.params;

      const result = await friendService.removeFriend(userId, friendId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update friend settings
   * PATCH /api/friends/:friendId
   */
  async updateFriendSettings(req, res, next) {
    try {
      const userId = req.user.id;
      const { friendId } = req.params;
      const { is_favorite, nickname } = req.body;

      const result = await friendService.updateFriendSettings(userId, friendId, {
        isFavorite: is_favorite,
        nickname,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FriendController();
