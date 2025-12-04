const chatThreadRepository = require('../repositories/chat-thread.repository');
const chatMessageRepository = require('../repositories/chat-message.repository');
const friendRepository = require('@modules/friends/repositories/friend.repository');
const userRepository = require('@modules/user/repositories/user.repository');
const notificationRepository = require('@modules/notifications/repositories/notification.repository');
const socketConfig = require('@config/socket.config');
const { app } = require('@config');
const AppException = require('@exceptions/app.exception');
const logger = require('@utils/logger');

/**
 * Chat Service
 * Business logic for chat operations
 */
class ChatService {
  /**
   * Get or create chat thread
   */
  async getOrCreateThread(currentUserId, postId, otherUserId) {
    // Cannot chat with yourself
    if (currentUserId === otherUserId) {
      throw new AppException('Cannot create chat thread with yourself', 400);
    }

    // Check if they are friends
    const areFriends = await friendRepository.areFriends(currentUserId, otherUserId);
    if (!areFriends) {
      throw new AppException('You are not friends with this user', 403);
    }

    // Check if post exists
    const post = await this._getPost(postId);
    if (!post) {
      throw new AppException('Post not found', 404);
    }

    // Try to find existing thread
    let thread = await chatThreadRepository.findByPostAndUsers(postId, currentUserId, otherUserId);
    let isNew = false;

    if (!thread) {
      // Create new thread
      thread = await chatThreadRepository.create(postId, currentUserId, otherUserId);
      isNew = true;
    }

    // Transform response
    return {
      thread: this._transformThread(thread, currentUserId),
      is_new: isNew,
    };
  }

  /**
   * Get messages in thread
   */
  async getMessages(threadId, currentUserId, { limit = 50, before = null }) {
    // Check if user is participant
    const isParticipant = await chatThreadRepository.isParticipant(threadId, currentUserId);
    if (!isParticipant) {
      throw new AppException('You are not a participant in this chat thread', 403);
    }

    // Get messages
    const messages = await chatMessageRepository.findByThread(threadId, { limit, before });

    // Transform messages
    const transformedMessages = messages.map((msg) => this._transformMessage(msg));

    // Get oldest timestamp for pagination
    const oldestTimestamp = messages.length > 0 ? messages[messages.length - 1].createdAt : null;

    return {
      messages: transformedMessages,
      pagination: {
        has_more: messages.length === limit,
        oldest_timestamp: oldestTimestamp,
      },
    };
  }

  /**
   * Send message
   */
  async sendMessage(threadId, currentUserId, { message, photo_url }) {
    // Get thread and verify participant
    const thread = await chatThreadRepository.findById(threadId);
    if (!thread) {
      throw new AppException('Thread not found', 404);
    }

    // Check if user is participant
    const isParticipant = thread.user1Id === currentUserId || thread.user2Id === currentUserId;
    if (!isParticipant) {
      throw new AppException('You are not a participant in this chat thread', 403);
    }

    // Determine receiver
    const receiverId = thread.user1Id === currentUserId ? thread.user2Id : thread.user1Id;

    // Create message
    const newMessage = await chatMessageRepository.create({
      threadId,
      postId: thread.postId,
      senderId: currentUserId,
      receiverId,
      message,
      photoUrl: photo_url,
    });

    // Update thread's updatedAt
    await chatThreadRepository.touch(threadId);

    // Create notification for receiver
    try {
      await notificationRepository.createChatMessageNotification(receiverId, currentUserId, newMessage.id);
    } catch (notifError) {
      logger.error('Failed to create chat message notification:', notifError);
    }

    // Emit Socket.IO event to receiver
    try {
      const io = socketConfig.getIO();
      if (io.chatHandler) {
        io.chatHandler.emitNewMessage(receiverId, threadId, this._transformMessage(newMessage));
      }
    } catch (socketError) {
      logger.error('Failed to emit new message event:', socketError);
    }

    return {
      message: this._transformMessage(newMessage),
    };
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(threadId, currentUserId) {
    // Verify participant
    const isParticipant = await chatThreadRepository.isParticipant(threadId, currentUserId);
    if (!isParticipant) {
      throw new AppException('You are not a participant in this chat thread', 403);
    }

    // Mark as read
    const markedCount = await chatMessageRepository.markAsRead(threadId, currentUserId);

    // Emit Socket.IO event to other participants
    try {
      const io = socketConfig.getIO();
      if (io.chatHandler) {
        io.chatHandler.emitMessagesRead(threadId, currentUserId);
      }
    } catch (socketError) {
      logger.error('Failed to emit messages read event:', socketError);
    }

    return {
      marked_count: markedCount,
    };
  }

  /**
   * Get all threads for user
   */
  async getThreads(currentUserId, { limit = 20, offset = 0 }) {
    const { threads, total } = await chatThreadRepository.findByUser(currentUserId, { limit, offset });

    // Get additional data for each thread
    const threadsWithData = await Promise.all(
      threads.map(async (thread) => {
        // Get last message
        const lastMessage = await chatMessageRepository.getLastMessage(thread.id);

        // Get unread count
        const unreadCount = await chatMessageRepository.countUnread(thread.id, currentUserId);

        return {
          ...this._transformThread(thread, currentUserId),
          unread_count: unreadCount,
          last_message: lastMessage
            ? {
                id: lastMessage.id,
                message: lastMessage.message,
                photo_url: lastMessage.photoUrl,
                sender_id: lastMessage.senderId,
                created_at: lastMessage.createdAt,
              }
            : null,
        };
      })
    );

    return {
      threads: threadsWithData,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    };
  }

  /**
   * Transform thread for response
   */
  _transformThread(thread, currentUserId) {
    // Determine other user
    const otherUser = thread.user1Id === currentUserId ? thread.user2 : thread.user1;

    // Transform avatar URLs
    if (otherUser.avatar && !otherUser.avatar.startsWith('http')) {
      otherUser.avatar = `${app.appUrl}${otherUser.avatar}`;
    }

    if (thread.post.user.avatar && !thread.post.user.avatar.startsWith('http')) {
      thread.post.user.avatar = `${app.appUrl}${thread.post.user.avatar}`;
    }

    // Transform photo URL
    if (thread.post.imageUrl && !thread.post.imageUrl.startsWith('http')) {
      thread.post.imageUrl = `${app.appUrl}${thread.post.imageUrl}`;
    }

    return {
      id: thread.id,
      post_id: thread.postId,
      user1_id: thread.user1Id,
      user2_id: thread.user2Id,
      created_at: thread.createdAt,
      updated_at: thread.updatedAt,
      post: {
        id: thread.post.id,
        photo_url: thread.post.imageUrl,
        caption: thread.post.caption,
        sender_id: thread.post.userId,
        created_at: thread.post.createdAt,
        sender: {
          id: thread.post.user.id,
          name: thread.post.user.name,
          username: thread.post.user.username,
          avatar_url: thread.post.user.avatar,
        },
      },
      other_user: {
        id: otherUser.id,
        name: otherUser.name,
        username: otherUser.username,
        avatar_url: otherUser.avatar,
      },
    };
  }

  /**
   * Transform message for response
   */
  _transformMessage(message) {
    // Transform avatar URL
    if (message.sender.avatar && !message.sender.avatar.startsWith('http')) {
      message.sender.avatar = `${app.appUrl}${message.sender.avatar}`;
    }

    // Transform photo URL
    let photoUrl = message.photoUrl;
    if (photoUrl && !photoUrl.startsWith('http')) {
      photoUrl = `${app.appUrl}${photoUrl}`;
    }

    return {
      id: message.id,
      thread_id: message.threadId,
      post_id: message.postId,
      sender_id: message.senderId,
      receiver_id: message.receiverId,
      message: message.message,
      photo_url: photoUrl,
      is_read: message.isRead,
      read_at: message.readAt,
      created_at: message.createdAt,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        username: message.sender.username,
        avatar_url: message.sender.avatar,
      },
    };
  }

  /**
   * Get post by ID (helper)
   */
  async _getPost(postId) {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    return await prisma.photo.findUnique({
      where: { id: postId },
    });
  }
}

module.exports = new ChatService();
