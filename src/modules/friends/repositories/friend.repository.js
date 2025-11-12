const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Friend Repository
 * Handles database operations for friendships
 */
class FriendRepository {
  /**
   * Get all friends for a user
   */
  async getFriends(userId, { limit = 20, offset = 0 }) {
    return await prisma.friendship.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        friend: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            status: true,
            lastLoginAt: true,
          },
        },
      },
    });
  }

  /**
   * Count total friends
   */
  async countFriends(userId) {
    return await prisma.friendship.count({
      where: { userId },
    });
  }

  /**
   * Check if users are friends
   */
  async areFriends(userId1, userId2) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        userId: userId1,
        friendId: userId2,
      },
    });

    return !!friendship;
  }

  /**
   * Create friendship (bidirectional)
   */
  async createFriendship(userId, friendId) {
    // Create both directions
    const [friendship1, friendship2] = await prisma.$transaction([
      prisma.friendship.create({
        data: {
          userId,
          friendId,
        },
      }),
      prisma.friendship.create({
        data: {
          userId: friendId,
          friendId: userId,
        },
      }),
    ]);

    return friendship1;
  }

  /**
   * Delete friendship (bidirectional)
   */
  async deleteFriendship(userId, friendId) {
    // Delete both directions
    await prisma.$transaction([
      prisma.friendship.deleteMany({
        where: {
          userId,
          friendId,
        },
      }),
      prisma.friendship.deleteMany({
        where: {
          userId: friendId,
          friendId: userId,
        },
      }),
    ]);
  }

  /**
   * Update friendship (e.g., favorite, nickname)
   */
  async updateFriendship(userId, friendId, data) {
    return await prisma.friendship.update({
      where: {
        userId_friendId: {
          userId,
          friendId,
        },
      },
      data,
    });
  }

  /**
   * Get friendship details
   */
  async getFriendship(userId, friendId) {
    return await prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId,
          friendId,
        },
      },
      include: {
        friend: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            status: true,
          },
        },
      },
    });
  }
}

module.exports = new FriendRepository();
