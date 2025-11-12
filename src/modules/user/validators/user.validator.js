const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').optional(),
  phone: Joi.string().optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED').optional(),
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').optional(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  username: Joi.string().min(3).max(30).optional(),
  phone: Joi.string().optional(),
  avatar: Joi.string().optional(),
  bio: Joi.string().max(500).optional().allow('', null),
});

const searchUsersQuerySchema = Joi.object({
  q: Joi.string().min(2).required().messages({
    'string.min': 'Search query must be at least 2 characters',
    'any.required': 'Search query is required',
  }),
  limit: Joi.number().integer().min(1).max(50).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

const userIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  searchUsersQuerySchema,
  userIdParamSchema,
};
