const reactionRepository = require('../repositories/reaction.repository');
const photoRepository = require('../repositories/photo.repository');
const AppException = require('@exceptions/app.exception');
const logger = require('@utils/logger');

/**
 * Reaction Service
 * Business logic for photo reactions
 */
class ReactionService {
  /**
   * Allowed emojis
   */
  ALLOWED_EMOJIS = ['❤️', '😂', '😮', '🔥', '✨', '👍', '🎉', '😍', '💯', '🙌'];

  /**
   * Emoji text shortcuts mapping
   */
  EMOJI_SHORTCUTS = {
    heart: '❤️',
    laugh: '😂',
    wow: '😮',
    fire: '🔥',
    sparkles: '✨',
    thumbsup: '👍',
    party: '🎉',
    love: '😍',
    hundred: '💯',
    hands: '🙌',
  };

  /**
   * Convert text shortcut to emoji Unicode
   */
  normalizeEmoji(emoji) {
    // If it's a text shortcut, convert to Unicode
    if (this.EMOJI_SHORTCUTS[emoji]) {
      return this.EMOJI_SHORTCUTS[emoji];
    }
    // Otherwise return as-is (already Unicode emoji)
    return emoji;
  }

  /**
   * Add or update reaction
   */
  async addReaction(photoId, userId, emoji) {
    // Normalize emoji (convert text shortcuts to Unicode)
    const normalizedEmoji = this.normalizeEmoji(emoji);

    // Validate emoji
    if (!this.ALLOWED_EMOJIS.includes(normalizedEmoji)) {
      throw new AppException(
        `Invalid emoji. Allowed emojis: ${this.ALLOWED_EMOJIS.join(', ')}`,
        400
      );
    }

    // Check if photo exists
    const photo = await photoRepository.findById(photoId, false, false);
    if (!photo) {
      throw new AppException('Photo not found', 404);
    }

    // Check permission: owner or friend
    if (photo.userId !== userId) {
      const areFriends = await photoRepository.areFriends(userId, photo.userId);
      if (!areFriends) {
        throw new AppException('You can only react to photos from friends', 403);
      }
    }

    // Upsert reaction with normalized emoji
    const reaction = await reactionRepository.upsertReaction(photoId, userId, normalizedEmoji);

    logger.info(`Reaction added: ${normalizedEmoji} on photo ${photoId} by user ${userId}`);

    return {
      id: reaction.id,
      photo_id: reaction.photoId,
      user_id: reaction.userId,
      emoji: reaction.emoji,
      created_at: reaction.createdAt,
    };
  }

  /**
   * Remove reaction
   */
  async removeReaction(photoId, userId) {
    // Check if reaction exists
    const exists = await reactionRepository.exists(photoId, userId);
    if (!exists) {
      throw new AppException("You haven't reacted to this photo", 404);
    }

    await reactionRepository.deleteReaction(photoId, userId);

    logger.info(`Reaction removed from photo ${photoId} by user ${userId}`);

    return { message: 'Reaction removed successfully' };
  }

  /**
   * Get all reactions for a photo
   */
  async getReactions(photoId, currentUserId, { limit = 50, offset = 0 }) {
    // Check if photo exists and user has permission
    const photo = await photoRepository.findById(photoId, false, false);
    if (!photo) {
      throw new AppException('Photo not found', 404);
    }

    if (photo.userId !== currentUserId) {
      const areFriends = await photoRepository.areFriends(currentUserId, photo.userId);
      if (!areFriends) {
        throw new AppException('You do not have permission to view this photo', 403);
      }
    }

    const reactions = await reactionRepository.findByPhotoId(photoId, { limit, offset });
    const summary = await reactionRepository.getReactionSummary(photoId);
    const total = await reactionRepository.countByPhotoId(photoId);

    return {
      reactions: reactions.map((r) => ({
        id: r.id,
        photo_id: r.photoId,
        user_id: r.userId,
        emoji: r.emoji,
        created_at: r.createdAt,
        user: r.user
          ? {
              id: r.user.id,
              name: r.user.name,
              username: r.user.username,
              avatar: r.user.avatar,
            }
          : null,
      })),
      summary: {
        total,
        by_emoji: summary,
      },
    };
  }
}

module.exports = new ReactionService();
