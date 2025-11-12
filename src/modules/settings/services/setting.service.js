const settingRepository = require('../repositories/setting.repository');

/**
 * Setting Service
 * Business logic for user settings management
 */
class SettingService {
  /**
   * Get user settings
   */
  async getSettings(userId) {
    let settings = await settingRepository.getSettings(userId);

    // If no settings exist, create defaults
    if (!settings) {
      settings = await settingRepository.createDefaultSettings(userId);
    }

    return {
      notifications_enabled: settings.notificationsEnabled,
      friend_request_notifications: settings.friendRequestNotifications,
      photo_reaction_notifications: settings.photoReactionNotifications,
      comment_notifications: settings.commentNotifications,
      privacy_level: settings.privacyLevel,
      show_online_status: settings.showOnlineStatus,
      allow_friend_requests: settings.allowFriendRequests,
    };
  }

  /**
   * Update user settings
   */
  async updateSettings(userId, data) {
    const updateData = {};

    if (data.notifications_enabled !== undefined) {
      updateData.notificationsEnabled = data.notifications_enabled;
    }
    if (data.friend_request_notifications !== undefined) {
      updateData.friendRequestNotifications = data.friend_request_notifications;
    }
    if (data.photo_reaction_notifications !== undefined) {
      updateData.photoReactionNotifications = data.photo_reaction_notifications;
    }
    if (data.comment_notifications !== undefined) {
      updateData.commentNotifications = data.comment_notifications;
    }
    if (data.privacy_level !== undefined) {
      updateData.privacyLevel = data.privacy_level;
    }
    if (data.show_online_status !== undefined) {
      updateData.showOnlineStatus = data.show_online_status;
    }
    if (data.allow_friend_requests !== undefined) {
      updateData.allowFriendRequests = data.allow_friend_requests;
    }

    const settings = await settingRepository.updateSettings(userId, updateData);

    return {
      notifications_enabled: settings.notificationsEnabled,
      friend_request_notifications: settings.friendRequestNotifications,
      photo_reaction_notifications: settings.photoReactionNotifications,
      comment_notifications: settings.commentNotifications,
      privacy_level: settings.privacyLevel,
      show_online_status: settings.showOnlineStatus,
      allow_friend_requests: settings.allowFriendRequests,
    };
  }
}

module.exports = new SettingService();
