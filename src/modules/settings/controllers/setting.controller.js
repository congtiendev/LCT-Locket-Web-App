const settingService = require('../services/setting.service');
const asyncHandler = require('@middlewares/async-handler.middleware');

/**
 * Setting Controller
 * Handles HTTP requests for user settings
 */
class SettingController {
  /**
   * Get user settings
   * GET /api/settings
   */
  getSettings = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const settings = await settingService.getSettings(userId);

    res.json({
      success: true,
      data: settings,
    });
  });

  /**
   * Update user settings
   * PATCH /api/settings
   */
  updateSettings = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = req.body;

    const settings = await settingService.updateSettings(userId, data);

    res.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    });
  });
}

module.exports = new SettingController();
