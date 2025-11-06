const express = require('express');
const passport = require('../strategies/google.strategy');
const googleAuthController = require('../controllers/google-auth.controller');

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get(
  '/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failure',
  }),
  googleAuthController.googleCallback
);

/**
 * @route   GET /api/auth/google/failure
 * @desc    Handle Google OAuth failure
 * @access  Public
 */
router.get('/failure', googleAuthController.googleFailure);

module.exports = router;
