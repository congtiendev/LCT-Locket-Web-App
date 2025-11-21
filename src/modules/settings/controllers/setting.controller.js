const settingService = require('../services/setting.service');

/**
 * Setting Controller
 * Handles HTTP requests for user settings
 */
class SettingController {
  /**
   * Get user settings
   * GET /api/users/settings
   */
  async getSettings(req, res, next) {
    try {
      const userId = req.user.id;

      const settings = await settingService.getSettings(userId);

      res.json({
        success: true,
        settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user settings
   * PUT /api/users/settings
   */
  async updateSettings(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;

      const settings = await settingService.updateSettings(userId, data);

      res.json({
        success: true,
        settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload avatar
   * POST /api/users/avatar
   */
  async uploadAvatar(req, res, next) {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      // Avatar URL will be relative path
      const avatarUrl = `/uploads/avatars/${file.filename}`;

      // Update user avatar in database
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const { app } = require('@config');

      await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarUrl },
      });

      // Return full URL
      const fullAvatarUrl = `${app.appUrl}${avatarUrl}`;

      res.json({
        success: true,
        avatar_url: fullAvatarUrl,
        message: 'Avatar updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update profile
   * PUT /api/users/profile
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, bio, phone } = req.body;

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const { app } = require('@config');

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (phone !== undefined) updateData.phone = phone;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          phone: true,
          avatar: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Transform avatar to full URL
      let avatarUrl = user.avatar;
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        avatarUrl = `${app.appUrl}${avatarUrl}`;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          phone: user.phone,
          avatar_url: avatarUrl,
          username: user.username,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all photos
   * DELETE /api/photos/all
   */
  async deleteAllPhotos(req, res, next) {
    try {
      const userId = req.user.id;

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Delete all photos and related data (cascades)
      const result = await prisma.photo.deleteMany({
        where: { userId },
      });

      res.json({
        success: true,
        deleted_count: result.count,
        message: 'All photos deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete account
   * DELETE /api/users/account
   */
  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      const { confirmation } = req.body;

      // Require confirmation
      if (confirmation !== 'DELETE MY ACCOUNT') {
        return res.status(400).json({
          success: false,
          message: 'Please confirm account deletion by sending: {"confirmation": "DELETE MY ACCOUNT"}',
        });
      }

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Delete user (cascades to all related data)
      await prisma.user.delete({
        where: { id: userId },
      });

      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingController();
