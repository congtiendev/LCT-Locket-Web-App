const logger = require('@utils/logger');
const mailService = require('@core/mail/mail.service');

const processEmail = async (job) => {
  const { to, subject, html, text, from } = job.data;

  try {
    logger.info(`Processing email job - sending to ${to}: ${subject}`);

    const result = await mailService.sendMail({
      to,
      subject,
      html: html || job.data.body, // Support both 'html' and 'body' for backward compatibility
      text,
      from,
    });

    logger.info(`Email job completed successfully: ${result.messageId}`);

    return result;
  } catch (error) {
    logger.error('Email job processing failed:', error);
    throw error;
  }
};

module.exports = processEmail;
