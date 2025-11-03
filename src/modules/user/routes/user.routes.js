const express = require('express');
const { authenticate, authorize } = require('@modules/auth');
const validate = require('@middlewares/validate.middleware');
const upload = require('@middlewares/upload.middleware');
const profileController = require('../controllers/profile.controller');
const userController = require('../controllers/user.controller');
const {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
} = require('../validators/user.validator');

const router = express.Router();

// Profile routes
router.get('/profile', authenticate, profileController.getProfile);
router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  profileController.updateProfile
);
router.post(
  '/profile/avatar',
  authenticate,
  upload.single('avatar'),
  profileController.uploadAvatar
);

// User management routes (Admin only)
router.get('/', authenticate, authorize('ADMIN'), userController.getAll);
router.get('/:id', authenticate, authorize('ADMIN'), userController.getById);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createUserSchema),
  userController.create
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateUserSchema),
  userController.update
);
router.delete('/:id', authenticate, authorize('ADMIN'), userController.delete);

module.exports = router;
