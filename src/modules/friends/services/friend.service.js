const friendRepository = require('../repositories/friend.repository');
const userRepository = require('@modules/user/repositories/user.repository');
const AppException = require('@exceptions/app.exception');

/**
 * Friend Service
 * Business logic for friend management
 */
class FriendService {
  /**
   * Get user's friends list
   */
  async getFriends(userId, { limit = 20, offset = 0 }) {
    const [friends, total] = await Promise.all([
      friendRepository.getFriends(userId, { limit, offset }),
      friendRepository.countFriends(userId),
    ]);

    return {
      friends: friends.map((f) => ({
        id: f.friend.id,
        name: f.friend.name,
        username: f.friend.username,
        avatar: f.friend.avatar,
        bio: f.friend.bio,
        is_favorite: f.isFavorite,
        nickname: f.nickname,
        friend_since: f.createdAt,
      })),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    };
  }

  /**
   * Remove friend
   */
  async removeFriend(userId, friendId) {
    // Check if they are friends
    const areFriends = await friendRepository.areFriends(userId, friendId);
    if (!areFriends) {
      throw new AppException('You are not friends with this user', 404);
    }

    // Delete friendship (bidirectional)
    await friendRepository.deleteFriendship(userId, friendId);

    return { message: 'Friend removed successfully' };
  }

  /**
   * Update friend settings (favorite, nickname)
   */
  async updateFriendSettings(userId, friendId, { isFavorite, nickname }) {
    // Check if they are friends
    const areFriends = await friendRepository.areFriends(userId, friendId);
    if (!areFriends) {
      throw new AppException('You are not friends with this user', 404);
    }

    const updated = await friendRepository.updateFriendship(userId, friendId, {
      isFavorite,
      nickname,
    });

    return {
      id: updated.friend.id,
      name: updated.friend.name,
      username: updated.friend.username,
      avatar: updated.friend.avatar,
      is_favorite: updated.isFavorite,
      nickname: updated.nickname,
    };
  }
}

module.exports = new FriendService();
