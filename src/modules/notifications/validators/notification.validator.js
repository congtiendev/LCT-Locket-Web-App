const Joi = require('joi');
const validate = require('@middlewares/validate.middleware');

/**
 * Notification Validators
 * Request validation schemas using Joi
 */

/**
 * Get notifications query validation
 */
const getNotificationsQuerySchema = Joi.object({
  is_read: Joi.boolean().optional(),
  limit: Joi.number().integer().min(1).max(50).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

/**
 * Notification ID param validation
 */
const notificationIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

module.exports = {
  validateGetNotificationsQuery: validate(getNotificationsQuerySchema, 'query'),
  validateNotificationId: validate(notificationIdSchema, 'params'),
};
