const welcomeTemplate = require('../templates/welcome.template');
const passwordResetTemplate = require('../templates/password-reset.template');
const verifyEmailTemplate = require('../templates/verify-email.template');
const testEmailTemplate = require('../templates/test-email.template');

/**
 * Email template helper
 * Provides easy access to all email templates
 */
class TemplateHelper {
  /**
   * Generate welcome email HTML
   * @param {Object} data - { name, email }
   * @returns {string} HTML content
   */
  welcome(data) {
    return welcomeTemplate(data);
  }

  /**
   * Generate password reset email HTML
   * @param {Object} data - { name, resetUrl, expiresIn }
   * @returns {string} HTML content
   */
  passwordReset(data) {
    return passwordResetTemplate(data);
  }

  /**
   * Generate email verification HTML
   * @param {Object} data - { name, verificationUrl }
   * @returns {string} HTML content
   */
  verifyEmail(data) {
    return verifyEmailTemplate(data);
  }

  /**
   * Generate test email HTML
   * @param {Object} data - { email }
   * @returns {string} HTML content
   */
  testEmail(data) {
    return testEmailTemplate(data);
  }

  /**
   * Get subject line for welcome email
   * @returns {string}
   */
  getWelcomeSubject() {
    return 'Welcome to Locket! 🎉';
  }

  /**
   * Get subject line for password reset email
   * @returns {string}
   */
  getPasswordResetSubject() {
    return 'Reset Your Password - Locket 🔒';
  }

  /**
   * Get subject line for email verification
   * @returns {string}
   */
  getVerifyEmailSubject() {
    return 'Verify Your Email - Locket ✉️';
  }

  /**
   * Get subject line for test email
   * @returns {string}
   */
  getTestEmailSubject() {
    return 'Test Email - Locket 🧪';
  }
}

module.exports = new TemplateHelper();
