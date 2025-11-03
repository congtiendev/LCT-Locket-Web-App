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
  phone: Joi.string().optional(),
  avatar: Joi.string().optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
};
