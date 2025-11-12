const Joi = require('joi');
const validate = require('@middlewares/validate.middleware');

/**
 * Photo Validators
 * Request validation schemas using Joi
 */

/**
 * Upload photo validation
 */
const uploadPhotoSchema = Joi.object({
  caption: Joi.string().max(500).optional().allow('', null),
});

/**
 * Get photos query validation
 */
const getPhotosQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  friend_id: Joi.string().uuid().optional(),
});

/**
 * Photo ID param validation
 */
const photoIdSchema = Joi.object({
  photoId: Joi.string().uuid().required(),
});

/**
 * Add reaction validation
 */
const addReactionSchema = Joi.object({
  emoji: Joi.string()
    .required()
    .valid('❤️', '😂', '😮', '🔥', '✨', '👍', '🎉', '😍', '💯', '🙌')
    .messages({
      'any.only': 'Invalid emoji. Allowed emojis: ❤️ 😂 😮 🔥 ✨ 👍 🎉 😍 💯 🙌',
    }),
});

/**
 * Get reactions query validation
 */
const getReactionsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
});

module.exports = {
  validateUploadPhoto: validate(uploadPhotoSchema, 'body'),
  validateGetPhotosQuery: validate(getPhotosQuerySchema, 'query'),
  validatePhotoId: validate(photoIdSchema, 'params'),
  validateAddReaction: validate(addReactionSchema, 'body'),
  validateGetReactionsQuery: validate(getReactionsQuerySchema, 'query'),
};
