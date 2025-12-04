const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Chat Thread Repository
 * Handles database operations for chat threads
 */
class ChatThreadRepository {
  /**
   * Find thread by post and users
   */
  async findByPostAndUsers(postId, user1Id, user2Id) {
    // Ensure consistent ordering: smaller ID first
    const [firstUserId, secondUserId] = [user1Id, user2Id].sort();

    return await prisma.chatThread.findFirst({
      where: {
        postId,
        OR: [
          { user1Id: firstUserId, user2Id: secondUserId },
          { user1Id: secondUserId, user2Id: firstUserId },
        ],
      },
      include: {
        post: {
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        user2: {
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
   * Create new thread
   */
  async create(postId, user1Id, user2Id) {
    // Ensure consistent ordering
    const [firstUserId, secondUserId] = [user1Id, user2Id].sort();

    return await prisma.chatThread.create({
      data: {
        postId,
        user1Id: firstUserId,
        user2Id: secondUserId,
      },
      include: {
        post: {
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        user2: {
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
   * Get thread by ID
   */
  async findById(threadId) {
    return await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: {
        post: {
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        user2: {
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
   * Get all threads for a user
   */
  async findByUser(userId, { limit = 20, offset = 0 }) {
    const threads = await prisma.chatThread.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      take: limit,
      skip: offset,
      orderBy: { updatedAt: 'desc' },
      include: {
        post: {
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Get total count
    const total = await prisma.chatThread.count({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    return { threads, total };
  }

  /**
   * Update thread's updatedAt timestamp
   */
  async touch(threadId) {
    return await prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });
  }

  /**
   * Check if user is participant in thread
   */
  async isParticipant(threadId, userId) {
    const thread = await prisma.chatThread.findFirst({
      where: {
        id: threadId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    return !!thread;
  }
}

module.exports = new ChatThreadRepository();
