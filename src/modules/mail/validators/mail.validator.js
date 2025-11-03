const Joi = require('joi');

const sendTestEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email address is required',
  }),
});

const sendEmailSchema = Joi.object({
  to: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid recipient email address',
    'any.required': 'Recipient email address is required',
  }),
  subject: Joi.string().required().min(1).max(255).messages({
    'string.empty': 'Email subject is required',
    'any.required': 'Email subject is required',
    'string.max': 'Email subject must not exceed 255 characters',
  }),
  html: Joi.string().required().min(1).messages({
    'string.empty': 'Email HTML content is required',
    'any.required': 'Email HTML content is required',
  }),
  text: Joi.string().optional().allow(''),
  from: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid sender email address',
  }),
});

module.exports = {
  sendTestEmailSchema,
  sendEmailSchema,
};
