const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Photo Reaction Repository
 * Handles all database operations for photo reactions
 */
class ReactionRepository {
  /**
   * Find reactions by photo ID
   */
  async findByPhotoId(photoId, { limit = 50, offset = 0 }) {
    return await prisma.photoReaction.findMany({
      where: { photoId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
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
    });
  }

  /**
   * Count reactions by photo ID
   */
  async countByPhotoId(photoId) {
    return await prisma.photoReaction.count({
      where: { photoId },
    });
  }

  /**
   * Get reaction summary (grouped by emoji)
   */
  async getReactionSummary(photoId) {
    const reactions = await prisma.photoReaction.groupBy({
      by: ['emoji'],
      where: { photoId },
      _count: {
        emoji: true,
      },
    });

    // Convert to { "❤️": 3, "🔥": 1 } format
    const summary = {};
    reactions.forEach((r) => {
      summary[r.emoji] = r._count.emoji;
    });

    return summary;
  }

  /**
   * Find user's reaction on a photo
   */
  async findUserReaction(photoId, userId) {
    return await prisma.photoReaction.findUnique({
      where: {
        photoId_userId: {
          photoId,
          userId,
        },
      },
    });
  }

  /**
   * Create or update reaction (upsert)
   */
  async upsertReaction(photoId, userId, emoji) {
    return await prisma.photoReaction.upsert({
      where: {
        photoId_userId: {
          photoId,
          userId,
        },
      },
      create: {
        photoId,
        userId,
        emoji,
      },
      update: {
        emoji,
      },
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
    });
  }

  /**
   * Delete reaction
   */
  async deleteReaction(photoId, userId) {
    return await prisma.photoReaction.delete({
      where: {
        photoId_userId: {
          photoId,
          userId,
        },
      },
    });
  }

  /**
   * Check if reaction exists
   */
  async exists(photoId, userId) {
    const reaction = await this.findUserReaction(photoId, userId);
    return !!reaction;
  }
}

module.exports = new ReactionRepository();
