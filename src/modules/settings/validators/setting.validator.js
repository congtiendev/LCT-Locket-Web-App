const Joi = require('joi');
const validate = require('@middlewares/validate.middleware');

/**
 * Setting Validators
 * Request validation schemas using Joi
 */

/**
 * Update settings validation
 */
const updateSettingsSchema = Joi.object({
  notifications_enabled: Joi.boolean().optional(),
  sound_enabled: Joi.boolean().optional(),
  auto_save_photos: Joi.boolean().optional(),
  photo_quality: Joi.string().valid('high', 'medium', 'low').optional(),
  theme: Joi.string().valid('system', 'light', 'dark').optional(),
  language: Joi.string().valid('vi', 'en').optional(),
  allow_photos_from: Joi.string().valid('everyone', 'all', 'friends_only', 'none').optional(),
  hide_from_suggestions: Joi.boolean().optional(),
}).min(1); // At least one field must be provided

/**
 * Update profile validation
 */
const updateProfileSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  bio: Joi.string().max(500).allow('').optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).allow('').optional().messages({
    'string.pattern.base': 'Phone number must be 10-15 digits',
  }),
}).min(1); // At least one field must be provided

/**
 * Delete account validation
 */
const deleteAccountSchema = Joi.object({
  confirmation: Joi.string().valid('DELETE MY ACCOUNT').required().messages({
    'any.only': 'Please confirm with: "DELETE MY ACCOUNT"',
    'any.required': 'Confirmation is required',
  }),
});

module.exports = {
  validateUpdateSettings: validate(updateSettingsSchema, 'body'),
  validateUpdateProfile: validate(updateProfileSchema, 'body'),
  validateDeleteAccount: validate(deleteAccountSchema, 'body'),
};
