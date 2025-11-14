const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { validateUpdateSettings } = require('../validators/setting.validator');
const { authenticate } = require('@middlewares/authenticate.middleware');

/**
 * Setting Routes
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authenticate);

// Setting routes
router.get('/settings', settingController.getSettings);
router.patch('/settings', validateUpdateSettings, settingController.updateSettings);

module.exports = router;
