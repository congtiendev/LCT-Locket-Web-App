const notificationRepository = require('../repositories/notification.repository');
const userRepository = require('@modules/user/repositories/user.repository');
const AppException = require('@exceptions/app.exception');

/**
 * Notification Service
 * Business logic for notification management
 */
class NotificationService {
  /**
   * Get notifications for user
   */
  async getNotifications(userId, { is_read = null, limit = 20, offset = 0 }) {
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.getNotifications(userId, {
        isRead: is_read,
        limit,
        offset,
      }),
      notificationRepository.countUnread(userId),
    ]);

    // Get related users info
    const userIds = [
      ...new Set(notifications.map((n) => n.relatedUserId).filter((id) => id !== null)),
    ];
    const users = await Promise.all(
      userIds.map((id) => userRepository.findById(id))
    );
    const userMap = users.reduce((acc, user) => {
      if (user) acc[user.id] = user;
      return acc;
    }, {});

    return {
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        data: n.data,
        is_read: n.isRead,
        created_at: n.createdAt,
        read_at: n.readAt,
        related_user: n.relatedUserId
          ? {
              id: userMap[n.relatedUserId]?.id,
              name: userMap[n.relatedUserId]?.name,
              username: userMap[n.relatedUserId]?.username,
              avatar: userMap[n.relatedUserId]?.avatar,
            }
          : null,
        related_item_id: n.relatedItemId,
      })),
      unread_count: unreadCount,
      pagination: {
        limit,
        offset,
        has_more: notifications.length === limit,
      },
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppException('Notification not found', 404);
    }

    if (notification.userId !== userId) {
      throw new AppException('You are not authorized to mark this notification as read', 403);
    }

    if (notification.isRead) {
      throw new AppException('Notification is already read', 400);
    }

    await notificationRepository.markAsRead(notificationId);

    return { message: 'Notification marked as read' };
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    const result = await notificationRepository.markAllAsRead(userId);

    return {
      message: 'All notifications marked as read',
      count: result.count,
    };
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppException('Notification not found', 404);
    }

    if (notification.userId !== userId) {
      throw new AppException('You are not authorized to delete this notification', 403);
    }

    await notificationRepository.delete(notificationId);

    return { message: 'Notification deleted' };
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(userId) {
    const result = await notificationRepository.deleteAllRead(userId);

    return {
      message: 'All read notifications deleted',
      count: result.count,
    };
  }
}

module.exports = new NotificationService();
