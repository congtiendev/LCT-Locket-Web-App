const express = require('express');
const { authRoutes } = require('@modules/auth');
const { userRoutes } = require('@modules/user');
const { mailRoutes } = require('@modules/mail');

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

module.exports = router;
