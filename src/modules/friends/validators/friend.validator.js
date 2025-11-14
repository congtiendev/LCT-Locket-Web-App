const Joi = require('joi');
const validate = require('@middlewares/validate.middleware');

/**
 * Friend Validators
 * Request validation schemas using Joi
 */

/**
 * Get friends query validation
 */
const getFriendsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

/**
 * Friend ID param validation
 */
const friendIdSchema = Joi.object({
  friendId: Joi.string().uuid().required(),
});

/**
 * Update friend settings validation
 */
const updateFriendSettingsSchema = Joi.object({
  is_favorite: Joi.boolean().optional(),
  nickname: Joi.string().max(50).optional().allow('', null),
});

/**
 * Friend request query validation
 */
const getFriendRequestsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
});

/**
 * Send friend request validation
 */
const sendFriendRequestSchema = Joi.object({
  receiver_id: Joi.string().uuid().required(),
  message: Joi.string().max(200).optional().allow('', null),
});

/**
 * Friend request ID param validation
 */
const friendRequestIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

module.exports = {
  validateGetFriendsQuery: validate(getFriendsQuerySchema, 'query'),
  validateFriendId: validate(friendIdSchema, 'params'),
  validateUpdateFriendSettings: validate(updateFriendSettingsSchema, 'body'),
  validateGetFriendRequestsQuery: validate(getFriendRequestsQuerySchema, 'query'),
  validateSendFriendRequest: validate(sendFriendRequestSchema, 'body'),
  validateFriendRequestId: validate(friendRequestIdSchema, 'params'),
};
