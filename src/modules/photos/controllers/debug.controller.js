const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Debug Controller
 * For debugging feed issues
 */
class DebugController {
  /**
   * Debug feed
   * GET /api/photos/debug/feed
   */
  async debugFeed(req, res, next) {
    try {
      const userId = req.user.id;

      // 1. Get friendships
      const friendships = await prisma.friendship.findMany({
        where: { userId },
        include: {
          friend: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const friendIds = friendships.map((f) => f.friendId);

      // 2. Get photos from friends
      const friendPhotos = await prisma.photo.findMany({
        where: {
          userId: { in: friendIds },
        },
        select: {
          id: true,
          userId: true,
          isPublic: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // 3. Get your photos
      const myPhotos = await prisma.photo.findMany({
        where: { userId },
        select: {
          id: true,
          isPublic: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // 4. Get feed photos (what API returns)
      const feedPhotos = await prisma.photo.findMany({
        where: {
          userId: { in: [...friendIds, userId] },
          isPublic: true,
        },
        select: {
          id: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      res.json({
        success: true,
        data: {
          user_id: userId,
          friendships: {
            count: friendships.length,
            friends: friendships.map((f) => ({
              id: f.friendId,
              name: f.friend.name,
              email: f.friend.email,
            })),
          },
          friend_photos: {
            count: friendPhotos.length,
            public_count: friendPhotos.filter((p) => p.isPublic).length,
            photos: friendPhotos.map((p) => ({
              id: p.id,
              owner: p.user.name,
              is_public: p.isPublic,
              created_at: p.createdAt,
            })),
          },
          my_photos: {
            count: myPhotos.length,
            public_count: myPhotos.filter((p) => p.isPublic).length,
            photos: myPhotos.map((p) => ({
              id: p.id,
              is_public: p.isPublic,
              created_at: p.createdAt,
            })),
          },
          feed_result: {
            count: feedPhotos.length,
            photos: feedPhotos.map((p) => ({
              id: p.id,
              owner: p.user.name,
              created_at: p.createdAt,
            })),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DebugController();
