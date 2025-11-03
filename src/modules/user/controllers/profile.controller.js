const { successResponse } = require('@utils/response');
const profileService = require('../services/profile.service');
const HTTP_STATUS = require('@constants/http-status');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.id);
      return successResponse(res, profile, 'Profile retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await profileService.updateProfile(req.user.id, req.body);
      return successResponse(res, profile, 'Profile updated successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const avatarUrl = await profileService.uploadAvatar(req.user.id, req.file);
      return successResponse(res, { avatar: avatarUrl }, 'Avatar uploaded successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
