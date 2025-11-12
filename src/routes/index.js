const express = require('express');
const { authRoutes } = require('@modules/auth');
const { userRoutes } = require('@modules/user');
const { mailRoutes } = require('@modules/mail');
const { photoRoutes } = require('@modules/photos');
const friendRoutes = require('@modules/friends/routes/friend.routes');
const notificationRoutes = require('@modules/notifications/routes/notification.routes');
const settingRoutes = require('@modules/settings/routes/setting.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/mail', mailRoutes);
router.use('/photos', photoRoutes);
router.use('/', friendRoutes);
router.use('/', notificationRoutes);
router.use('/', settingRoutes);

module.exports = router;
