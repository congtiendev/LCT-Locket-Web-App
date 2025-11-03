const { successResponse } = require('@utils/response');
const passwordService = require('../services/password.service');
const HTTP_STATUS = require('@constants/http-status');

class PasswordController {
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await passwordService.sendResetPasswordEmail(email);
      return successResponse(res, null, 'Password reset email sent', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await passwordService.resetPassword(token, password);
      return successResponse(res, null, 'Password reset successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await passwordService.changePassword(req.user.id, oldPassword, newPassword);
      return successResponse(res, null, 'Password changed successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PasswordController();
