const friendRequestService = require('../services/friend-request.service');

/**
 * Friend Request Controller
 * Handles HTTP requests for friend request operations
 */
class FriendRequestController {
  /**
   * Get received friend requests
   * GET /api/friend-requests
   */
  async getReceivedRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit, offset, status } = req.query;

      const result = await friendRequestService.getReceivedRequests(userId, {
        limit,
        offset,
        status,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get sent friend requests
   * GET /api/friend-requests/sent
   */
  async getSentRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit, offset } = req.query;

      const result = await friendRequestService.getSentRequests(userId, { limit, offset });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send friend request
   * POST /api/friend-requests
   */
  async sendRequest(req, res, next) {
    try {
      const senderId = req.user.id;
      const { receiver_id, message } = req.body;

      const result = await friendRequestService.sendRequest(senderId, receiver_id, message);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Accept friend request
   * POST /api/friend-requests/:id/accept
   */
  async acceptRequest(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await friendRequestService.acceptRequest(id, userId);

      res.json({
        success: true,
        message: result.message,
        data: result.friend,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject friend request
   * POST /api/friend-requests/:id/reject
   */
  async rejectRequest(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await friendRequestService.rejectRequest(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel sent friend request
   * DELETE /api/friend-requests/:id
   */
  async cancelRequest(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await friendRequestService.cancelRequest(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FriendRequestController();
