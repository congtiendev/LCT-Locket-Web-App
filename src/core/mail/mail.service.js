const nodemailer = require('nodemailer');
const mailConfig = require('@config/mail.config');
const logger = require('@utils/logger');
const templateHelper = require('../../modules/mail/helpers/template.helper');

class MailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      const port = parseInt(mailConfig.port, 10);
      const isSecure = port === 465;

      this.transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: port,
        secure: isSecure,
        auth: {
          user: mailConfig.user,
          pass: mailConfig.password,
        },
        tls: {
          // Do not fail on invalid certificates (for development)
          rejectUnauthorized: process.env.NODE_ENV === 'production',
          // Minimum TLS version
          minVersion: 'TLSv1.2',
        },
        // Additional debugging for development
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development',
      });

      logger.info('Mail transporter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize mail transporter:', error);
      throw error;
    }
  }

  async sendMail({ to, subject, html, text, from }) {
    try {
      const mailOptions = {
        from: from || `"${mailConfig.fromName}" <${mailConfig.fromAddress}>`,
        to,
        subject,
        html,
        text: text || undefined,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info(`Email sent successfully to ${to}: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        message: 'Email sent successfully',
      };
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendTestEmail(to) {
    const subject = templateHelper.getTestEmailSubject();
    const html = templateHelper.testEmail({ email: to });

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send welcome email to new user
   * @param {string} to - Recipient email
   * @param {string} name - User's name
   */
  async sendWelcomeEmail(to, name) {
    const subject = templateHelper.getWelcomeSubject();
    const html = templateHelper.welcome({ name, email: to });

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send password reset email
   * @param {string} to - Recipient email
   * @param {string} name - User's name
   * @param {string} resetUrl - Password reset URL
   * @param {string} expiresIn - Token expiration time
   */
  async sendPasswordResetEmail(to, name, resetUrl, expiresIn = '1 hour') {
    const subject = templateHelper.getPasswordResetSubject();
    const html = templateHelper.passwordReset({ name, resetUrl, expiresIn });

    return this.sendMail({ to, subject, html });
  }

  /**
   * Send email verification email
   * @param {string} to - Recipient email
   * @param {string} name - User's name
   * @param {string} verificationUrl - Email verification URL
   */
  async sendVerificationEmail(to, name, verificationUrl) {
    const subject = templateHelper.getVerifyEmailSubject();
    const html = templateHelper.verifyEmail({ name, verificationUrl });

    return this.sendMail({ to, subject, html });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified successfully');
      return { success: true, message: 'SMTP connection is ready' };
    } catch (error) {
      logger.error('SMTP connection verification failed:', error);
      throw error;
    }
  }
}

module.exports = new MailService();
