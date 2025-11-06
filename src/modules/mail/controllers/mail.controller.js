const mailService = require('@core/mail/mail.service');
const { successResponse, errorResponse } = require('@utils/response');
const logger = require('@utils/logger');
const HTTP_STATUS = require('@constants/http-status');

class MailController {
  async sendTestEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return errorResponse(res, 'Email address is required', 400);
      }

      const result = await mailService.sendTestEmail(email);

      logger.info(`Test email sent to ${email}`);

      return successResponse(res, result, 'Test email sent successfully', HTTP_STATUS.OK);
    } catch (error) {
      logger.error('Failed to send test email:', error);
      return errorResponse(res, error.message || 'Failed to send test email', 500);
    }
  }

  async verifyConnection(req, res) {
    try {
      const result = await mailService.verifyConnection();

      return successResponse(res, result, 'SMTP connection verified successfully', HTTP_STATUS.OK);
    } catch (error) {
      logger.error('SMTP connection verification failed:', error);
      return errorResponse(
        res,
        error.message || 'SMTP connection verification failed',
        500
      );
    }
  }

  async sendEmail(req, res) {
    try {
      const { to, subject, html, text, from } = req.body;

      if (!to || !subject || !html) {
        return errorResponse(
          res,
          'Email recipient, subject and HTML content are required',
          400
        );
      }

      const result = await mailService.sendMail({
        to,
        subject,
        html,
        text,
        from,
      });

      logger.info(`Email sent to ${to}`);

      return successResponse(res, result, 'Email sent successfully', HTTP_STATUS.OK);
    } catch (error) {
      logger.error('Failed to send email:', error);
      return errorResponse(res, error.message || 'Failed to send email', 500);
    }
  }
}

module.exports = new MailController();
