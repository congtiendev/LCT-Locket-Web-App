const { successResponse } = require('@utils/response');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const HTTP_STATUS = require('@constants/http-status');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 'User registered successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, result, 'Login successful', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await tokenService.refreshAccessToken(refreshToken);
      return successResponse(res, result, 'Token refreshed successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await tokenService.revokeToken(refreshToken);
      return successResponse(res, null, 'Logout successful', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return successResponse(res, user, 'Profile retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      await authService.verifyEmail(token);
      return successResponse(res, null, 'Email verified successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
