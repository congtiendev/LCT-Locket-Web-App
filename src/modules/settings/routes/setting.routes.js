const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const migrationController = require('../controllers/migration.controller');
const {
  validateUpdateSettings,
  validateUpdateProfile,
  validateDeleteAccount
} = require('../validators/setting.validator');
const { authenticate, authorize } = require('@middlewares/authenticate.middleware');
const avatarUpload = require('@middlewares/avatar-upload.middleware');

/**
 * Setting Routes
 * All routes require authentication
 */

// Migration endpoint (Admin only, no auth required for emergency)
router.post('/migrate/settings', migrationController.migrateSettings);

// Apply authentication to all other routes
router.use(authenticate);

// User settings routes
router.get('/users/settings', settingController.getSettings);
router.put('/users/settings', validateUpdateSettings, settingController.updateSettings);

// Profile management routes
router.post('/users/avatar', avatarUpload.single('avatar'), settingController.uploadAvatar);
router.put('/users/profile', validateUpdateProfile, settingController.updateProfile);

// Data management routes (destructive operations)
router.delete('/photos/all', settingController.deleteAllPhotos);
router.delete('/users/account', validateDeleteAccount, settingController.deleteAccount);

module.exports = router;
