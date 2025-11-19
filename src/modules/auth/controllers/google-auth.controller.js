const { successResponse, errorResponse } = require('@utils/response');
const tokenService = require('../services/token.service');
const HTTP_STATUS = require('@constants/http-status');
const logger = require('@utils/logger');

class GoogleAuthController {
  /**
   * Handle successful Google OAuth callback
   * Generate JWT tokens and send to client
   */
  async googleCallback(req, res, next) {
    try {
      const user = req.user;

      if (!user) {
        logger.error('Google OAuth: No user found in request');
        return errorResponse(res, 'Authentication failed', HTTP_STATUS.UNAUTHORIZED);
      }

      // Check if user account is active
      if (user.status !== 'ACTIVE') {
        logger.warn(`Google OAuth: Inactive user attempted login: ${user.email}`);
        return errorResponse(res, 'Account is not active', HTTP_STATUS.FORBIDDEN);
      }

      // Generate JWT tokens
      const tokens = await tokenService.generateAuthTokens(user);

      logger.info(`Google OAuth successful for user: ${user.email}`);

      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;

      // Redirect to frontend with tokens
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectURL = `${frontendURL}/auth/google/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

      return res.redirect(redirectURL);
    } catch (error) {
      logger.error('Google OAuth callback error:', error);
      next(error);
    }
  }

  /**
   * Handle Google OAuth failure
   */
  async googleFailure(req, res) {
    logger.error('Google OAuth authentication failed');

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const errorMessage = encodeURIComponent('Authentication failed');
    const redirectURL = `${frontendURL}/auth/google/callback?error=${errorMessage}`;

    return res.redirect(redirectURL);
  }
}

module.exports = new GoogleAuthController();
