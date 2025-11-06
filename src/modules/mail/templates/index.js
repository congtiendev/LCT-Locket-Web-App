/**
 * Email Templates Index
 * Central export for all email templates
 */
const welcomeTemplate = require('./welcome.template');
const passwordResetTemplate = require('./password-reset.template');
const verifyEmailTemplate = require('./verify-email.template');
const testEmailTemplate = require('./test-email.template');
const baseTemplate = require('./base.template');

module.exports = {
  welcomeTemplate,
  passwordResetTemplate,
  verifyEmailTemplate,
  testEmailTemplate,
  baseTemplate,
};
