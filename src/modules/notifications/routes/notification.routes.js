const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const {
  validateGetNotificationsQuery,
  validateNotificationId,
} = require('../validators/notification.validator');
const authenticate = require('@middlewares/authenticate.middleware');

/**
 * Notification Routes
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authenticate);

// Notification routes
router.get('/notifications', validateGetNotificationsQuery, notificationController.getNotifications);
router.post('/notifications/read-all', notificationController.markAllAsRead);
router.post('/notifications/:id/read', validateNotificationId, notificationController.markAsRead);
router.delete('/notifications/read', notificationController.deleteAllRead);
router.delete('/notifications/:id', validateNotificationId, notificationController.deleteNotification);

module.exports = router;
