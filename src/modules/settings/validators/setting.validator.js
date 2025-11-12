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
  friend_request_notifications: Joi.boolean().optional(),
  photo_reaction_notifications: Joi.boolean().optional(),
  comment_notifications: Joi.boolean().optional(),
  privacy_level: Joi.string().valid('public', 'friends', 'private').optional(),
  show_online_status: Joi.boolean().optional(),
  allow_friend_requests: Joi.boolean().optional(),
}).min(1); // At least one field must be provided

module.exports = {
  validateUpdateSettings: validate(updateSettingsSchema, 'body'),
};
