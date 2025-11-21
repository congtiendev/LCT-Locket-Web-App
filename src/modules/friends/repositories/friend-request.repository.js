const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Friend Request Repository
 * Handles database operations for friend requests
 */
class FriendRequestRepository {
  /**
   * Get friend requests for a user
   */
  async getRequests(userId, { status = 'pending', limit = 20, offset = 0 }) {
    const where = status ? { receiverId: userId, status } : { receiverId: userId };

    return await prisma.friendRequest.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });
  }

  /**
   * Get sent requests
   */
  async getSentRequests(userId, { limit = 20, offset = 0 }) {
    return await prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'pending' },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        receiver: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });
  }

  /**
   * Count pending requests
   */
  async countPendingRequests(userId) {
    return await prisma.friendRequest.count({
      where: { receiverId: userId, status: 'pending' },
    });
  }

  /**
   * Find request by ID
   */
  async findById(requestId) {
    return await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
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
   * Check if request exists
   */
  async requestExists(senderId, receiverId) {
    const request = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: 'pending' },
          { senderId: receiverId, receiverId: senderId, status: 'pending' },
        ],
      },
    });

    return !!request;
  }

  /**
   * Create friend request
   */
  async create(senderId, receiverId, message = null) {
    return await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        message,
        status: 'pending',
      },
      include: {
        receiver: {
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
   * Update request status
   */
  async updateStatus(requestId, status) {
    return await prisma.friendRequest.update({
      where: { id: requestId },
      data: {
        status,
        respondedAt: new Date(),
      },
    });
  }

  /**
   * Delete request
   */
  async delete(requestId) {
    return await prisma.friendRequest.delete({
      where: { id: requestId },
    });
  }

  /**
   * Delete old rejected requests between two users
   */
  async deleteOldRequests(senderId, receiverId) {
    return await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId, receiverId, status: 'rejected' },
          { senderId: receiverId, receiverId: senderId, status: 'rejected' },
        ],
      },
    });
  }
}

module.exports = new FriendRequestRepository();
