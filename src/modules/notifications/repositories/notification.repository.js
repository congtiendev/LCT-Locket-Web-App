const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Notification Repository
 * Handles database operations for notifications
 */
class NotificationRepository {
  /**
   * Get notifications for a user
   */
  async getNotifications(userId, { isRead = null, limit = 20, offset = 0 }) {
    const where = { userId };
    if (isRead !== null) {
      where.isRead = isRead;
    }

    return await prisma.notification.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Count unread notifications
   */
  async countUnread(userId) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Find notification by ID
   */
  async findById(notificationId) {
    return await prisma.notification.findUnique({
      where: { id: notificationId },
    });
  }

  /**
   * Create notification
   */
  async create(userId, type, title, data, relatedUserId = null, relatedItemId = null) {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        data,
        relatedUserId,
        relatedItemId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Delete notification
   */
  async delete(notificationId) {
    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(userId) {
    return await prisma.notification.deleteMany({
      where: { userId, isRead: true },
    });
  }

  /**
   * Create friend request notification
   */
  async createFriendRequestNotification(receiverId, senderId, requestId) {
    return await this.create(
      receiverId,
      'friend_request',
      'New Friend Request',
      {
        message: 'sent you a friend request',
      },
      senderId,
      requestId
    );
  }

  /**
   * Create friend accepted notification
   */
  async createFriendAcceptedNotification(senderId, acceptorId) {
    return await this.create(
      senderId,
      'friend_accepted',
      'Friend Request Accepted',
      {
        message: 'accepted your friend request',
      },
      acceptorId,
      null
    );
  }

  /**
   * Create photo reaction notification
   */
  async createPhotoReactionNotification(photoOwnerId, reactorId, photoId, emoji, reactorInfo) {
    return await this.create(
      photoOwnerId,
      'reaction',
      'New Reaction',
      {
        message: `reacted ${emoji} to your photo`,
        emoji,
        reactor: reactorInfo,
      },
      reactorId,
      photoId
    );
  }

  /**
   * Create chat message notification
   */
  async createChatMessageNotification(receiverId, senderId, messageId) {
    return await this.create(
      receiverId,
      'message',
      'New Message',
      {
        message: 'sent you a message',
      },
      senderId,
      messageId
    );
  }
}

module.exports = new NotificationRepository();
