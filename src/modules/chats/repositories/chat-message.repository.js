const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Chat Message Repository
 * Handles database operations for chat messages
 */
class ChatMessageRepository {
  /**
   * Create new message
   */
  async create(data) {
    const { threadId, postId, senderId, receiverId, message, photoUrl } = data;

    return await prisma.chatMessage.create({
      data: {
        threadId,
        postId,
        senderId,
        receiverId,
        message,
        photoUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Get messages in thread
   */
  async findByThread(threadId, { limit = 50, before = null }) {
    const where = { threadId };

    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    return await prisma.chatMessage.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Get last message in thread
   */
  async getLastMessage(threadId) {
    return await prisma.chatMessage.findFirst({
      where: { threadId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        photoUrl: true,
        senderId: true,
        createdAt: true,
      },
    });
  }

  /**
   * Count unread messages for user in thread
   */
  async countUnread(threadId, userId) {
    return await prisma.chatMessage.count({
      where: {
        threadId,
        receiverId: userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark messages as read
   */
  async markAsRead(threadId, receiverId) {
    const result = await prisma.chatMessage.updateMany({
      where: {
        threadId,
        receiverId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Get message by ID
   */
  async findById(messageId) {
    return await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }
}

module.exports = new ChatMessageRepository();
