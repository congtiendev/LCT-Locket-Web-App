const express = require('express');
const validate = require('@middlewares/validate.middleware');
const { authenticate } = require('@middlewares/authenticate.middleware');
const authController = require('../controllers/auth.controller');
const passwordController = require('../controllers/password.controller');
const googleAuthRoutes = require('./google-auth.routes');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

const router = express.Router();

// Auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.get('/verify-email/:token', authController.verifyEmail);

// Password routes
router.post('/forgot-password', validate(forgotPasswordSchema), passwordController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), passwordController.resetPassword);
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  passwordController.changePassword
);

// Google OAuth routes
router.use('/google', googleAuthRoutes);

module.exports = router;
