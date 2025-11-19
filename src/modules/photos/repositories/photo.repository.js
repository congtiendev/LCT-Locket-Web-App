const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Photo Repository
 * Handles all database operations for photos
 */
class PhotoRepository {
  /**
   * Find photo by ID
   */
  async findById(photoId, includeUser = true, includeReactions = true) {
    return await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        user: includeUser
          ? {
              select: {
                id: true,
                email: true,
                name: true,
                username: true,
                avatar: true,
                bio: true,
              },
            }
          : false,
        reactions: includeReactions
          ? {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            }
          : false,
      },
    });
  }

  /**
   * Find photos by user ID
   */
  async findByUserId(userId, { limit = 20, offset = 0, order = 'desc' }) {
    return await prisma.photo.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: order },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        reactions: {
          include: {
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
      },
    });
  }

  /**
   * Count photos by user ID
   */
  async countByUserId(userId) {
    return await prisma.photo.count({
      where: { userId },
    });
  }

  /**
   * Find feed photos (from friends and self)
   */
  async findFeedPhotos(userId, { limit = 20, offset = 0, order = 'desc', friendId = null }) {
    // First, get user's friends
    const friendships = await prisma.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);

    // Filter by specific friend if provided, otherwise include user and friends
    const userFilter = friendId
      ? { userId: friendId }
      : { userId: { in: [...friendIds, userId] } };

    return await prisma.photo.findMany({
      where: {
        ...userFilter,
        isPublic: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: order },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        reactions: {
          include: {
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
      },
    });
  }

  /**
   * Count feed photos
   */
  async countFeedPhotos(userId, friendId = null) {
    const friendships = await prisma.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);
    const userFilter = friendId
      ? { userId: friendId }
      : { userId: { in: [...friendIds, userId] } };

    return await prisma.photo.count({
      where: {
        ...userFilter,
        isPublic: true,
      },
    });
  }

  /**
   * Create new photo
   */
  async create(photoData) {
    return await prisma.photo.create({
      data: photoData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        reactions: true,
      },
    });
  }

  /**
   * Update photo
   */
  async update(photoId, updateData) {
    return await prisma.photo.update({
      where: { id: photoId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        reactions: true,
      },
    });
  }

  /**
   * Delete photo
   */
  async delete(photoId) {
    return await prisma.photo.delete({
      where: { id: photoId },
    });
  }

  /**
   * Check if user owns photo
   */
  async isOwner(photoId, userId) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { userId: true },
    });

    return photo?.userId === userId;
  }

  /**
   * Check if users are friends
   */
  async areFriends(userId1, userId2) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: userId1, friendId: userId2 },
          { userId: userId2, friendId: userId1 },
        ],
      },
    });

    return !!friendship;
  }
}

module.exports = new PhotoRepository();
