const friendRequestRepository = require('../repositories/friend-request.repository');
const friendRepository = require('../repositories/friend.repository');
const userRepository = require('@modules/user/repositories/user.repository');
const AppException = require('@exceptions/app.exception');

/**
 * Friend Request Service
 * Business logic for friend request management
 */
class FriendRequestService {
  /**
   * Get received friend requests
   */
  async getReceivedRequests(userId, { limit = 20, offset = 0, status = 'pending' }) {
    const [requests, total] = await Promise.all([
      friendRequestRepository.getRequests(userId, { status, limit, offset }),
      friendRequestRepository.countPendingRequests(userId),
    ]);

    return {
      requests: requests.map((r) => ({
        id: r.id,
        sender: {
          id: r.sender.id,
          name: r.sender.name,
          username: r.sender.username,
          avatar: r.sender.avatar,
          bio: r.sender.bio,
        },
        message: r.message,
        status: r.status,
        created_at: r.createdAt,
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
   * Get sent friend requests
   */
  async getSentRequests(userId, { limit = 20, offset = 0 }) {
    const requests = await friendRequestRepository.getSentRequests(userId, { limit, offset });

    return {
      requests: requests.map((r) => ({
        id: r.id,
        receiver: {
          id: r.receiver.id,
          name: r.receiver.name,
          username: r.receiver.username,
          avatar: r.receiver.avatar,
          bio: r.receiver.bio,
        },
        message: r.message,
        status: r.status,
        created_at: r.createdAt,
      })),
    };
  }

  /**
   * Send friend request
   */
  async sendRequest(senderId, receiverId, message = null) {
    // Cannot send request to yourself
    if (senderId === receiverId) {
      throw new AppException('Cannot send friend request to yourself', 400);
    }

    // Check if receiver exists
    const receiver = await userRepository.findById(receiverId);
    if (!receiver) {
      throw new AppException('User not found', 404);
    }

    // Check if already friends
    const areFriends = await friendRepository.areFriends(senderId, receiverId);
    if (areFriends) {
      throw new AppException('You are already friends with this user', 400);
    }

    // Check if request already exists
    const requestExists = await friendRequestRepository.requestExists(senderId, receiverId);
    if (requestExists) {
      throw new AppException('Friend request already exists', 400);
    }

    const request = await friendRequestRepository.create(senderId, receiverId, message);

    return {
      id: request.id,
      receiver: {
        id: request.receiver.id,
        name: request.receiver.name,
        username: request.receiver.username,
        avatar: request.receiver.avatar,
      },
      message: request.message,
      status: request.status,
      created_at: request.createdAt,
    };
  }

  /**
   * Accept friend request
   */
  async acceptRequest(requestId, userId) {
    // Find request
    const request = await friendRequestRepository.findById(requestId);
    if (!request) {
      throw new AppException('Friend request not found', 404);
    }

    // Verify user is the receiver
    if (request.receiverId !== userId) {
      throw new AppException('You are not authorized to accept this request', 403);
    }

    // Check if already accepted
    if (request.status !== 'pending') {
      throw new AppException('This request has already been processed', 400);
    }

    // Create friendship (bidirectional)
    await friendRepository.createFriendship(userId, request.senderId);

    // Update request status
    await friendRequestRepository.updateStatus(requestId, 'accepted');

    return {
      message: 'Friend request accepted',
      friend: {
        id: request.sender.id,
        name: request.sender.name,
        username: request.sender.username,
        avatar: request.sender.avatar,
      },
    };
  }

  /**
   * Reject friend request
   */
  async rejectRequest(requestId, userId) {
    // Find request
    const request = await friendRequestRepository.findById(requestId);
    if (!request) {
      throw new AppException('Friend request not found', 404);
    }

    // Verify user is the receiver
    if (request.receiverId !== userId) {
      throw new AppException('You are not authorized to reject this request', 403);
    }

    // Check if already processed
    if (request.status !== 'pending') {
      throw new AppException('This request has already been processed', 400);
    }

    // Update request status
    await friendRequestRepository.updateStatus(requestId, 'rejected');

    return { message: 'Friend request rejected' };
  }

  /**
   * Cancel sent friend request
   */
  async cancelRequest(requestId, userId) {
    // Find request
    const request = await friendRequestRepository.findById(requestId);
    if (!request) {
      throw new AppException('Friend request not found', 404);
    }

    // Verify user is the sender
    if (request.senderId !== userId) {
      throw new AppException('You are not authorized to cancel this request', 403);
    }

    // Check if still pending
    if (request.status !== 'pending') {
      throw new AppException('Cannot cancel a request that has been processed', 400);
    }

    // Delete request
    await friendRequestRepository.delete(requestId);

    return { message: 'Friend request cancelled' };
  }
}

module.exports = new FriendRequestService();
