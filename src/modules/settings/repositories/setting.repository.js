const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Setting Repository
 * Handles database operations for user settings
 */
class SettingRepository {
  /**
   * Get user settings
   */
  async getSettings(userId) {
    return await prisma.userSetting.findUnique({
      where: { userId },
    });
  }

  /**
   * Create default settings for new user
   */
  async createDefaultSettings(userId) {
    return await prisma.userSetting.create({
      data: {
        userId,
        notificationsEnabled: true,
        friendRequestNotifications: true,
        photoReactionNotifications: true,
        commentNotifications: true,
        privacyLevel: 'friends',
        showOnlineStatus: true,
        allowFriendRequests: true,
      },
    });
  }

  /**
   * Update user settings
   */
  async updateSettings(userId, data) {
    // Try to update first
    try {
      return await prisma.userSetting.update({
        where: { userId },
        data,
      });
    } catch (error) {
      // If settings don't exist, create them with defaults and then update
      if (error.code === 'P2025') {
        await this.createDefaultSettings(userId);
        return await prisma.userSetting.update({
          where: { userId },
          data,
        });
      }
      throw error;
    }
  }

  /**
   * Ensure settings exist for user (create if not exists)
   */
  async ensureSettings(userId) {
    const settings = await this.getSettings(userId);
    if (!settings) {
      return await this.createDefaultSettings(userId);
    }
    return settings;
  }
}

module.exports = new SettingRepository();
