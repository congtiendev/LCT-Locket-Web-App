const notificationService = require('../services/notification.service');

/**
 * Notification Controller
 * Handles HTTP requests for notification operations
 */
class NotificationController {
  /**
   * Get notifications
   * GET /api/notifications
   */
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const { is_read, limit, offset } = req.query;

      const result = await notificationService.getNotifications(userId, {
        is_read,
        limit,
        offset,
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
   * Mark notification as read
   * POST /api/notifications/:id/read
   */
  async markAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await notificationService.markAsRead(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all notifications as read
   * POST /api/notifications/read-all
   */
  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: result.message,
        count: result.count,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  async deleteNotification(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await notificationService.deleteNotification(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all read notifications
   * DELETE /api/notifications/read
   */
  async deleteAllRead(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.deleteAllRead(userId);

      res.json({
        success: true,
        message: result.message,
        count: result.count,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
