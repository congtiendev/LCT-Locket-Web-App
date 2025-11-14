const settingService = require('../services/setting.service');

/**
 * Setting Controller
 * Handles HTTP requests for user settings
 */
class SettingController {
  /**
   * Get user settings
   * GET /api/settings
   */
  async getSettings(req, res, next) {
    try {
      const userId = req.user.id;

      const settings = await settingService.getSettings(userId);

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user settings
   * PATCH /api/settings
   */
  async updateSettings(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;

      const settings = await settingService.updateSettings(userId, data);

      res.json({
        success: true,
        data: settings,
        message: 'Settings updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingController();
