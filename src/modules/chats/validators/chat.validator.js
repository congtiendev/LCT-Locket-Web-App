const Joi = require('joi');

/**
 * Create thread validation schema
 */
const createThreadSchema = Joi.object({
  post_id: Joi.string().uuid().required().messages({
    'string.empty': 'post_id is required',
    'string.uuid': 'post_id must be a valid UUID',
  }),
  other_user_id: Joi.string().uuid().required().messages({
    'string.empty': 'other_user_id is required',
    'string.uuid': 'other_user_id must be a valid UUID',
  }),
});

/**
 * Send message validation schema
 */
const sendMessageSchema = Joi.object({
  message: Joi.string().max(2000).allow(null).optional(),
  photo_url: Joi.string().uri().allow(null).optional(),
}).custom((value, helpers) => {
  // At least one of message or photo_url must be provided
  if (!value.message && !value.photo_url) {
    return helpers.error('custom.atLeastOne');
  }
  return value;
}).messages({
  'custom.atLeastOne': 'Either message or photo_url must be provided',
});

/**
 * Get messages query validation schema
 */
const getMessagesQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  before: Joi.string().isoDate().optional(),
});

/**
 * Get threads query validation schema
 */
const getThreadsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

/**
 * Thread ID param validation schema
 */
const threadIdParamSchema = Joi.object({
  threadId: Joi.string().uuid().required(),
});

module.exports = {
  createThreadSchema,
  sendMessageSchema,
  getMessagesQuerySchema,
  getThreadsQuerySchema,
  threadIdParamSchema,
};
