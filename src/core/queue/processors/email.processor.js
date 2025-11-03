const logger = require('@utils/logger');

const processEmail = async (job) => {
  const { to, subject, body } = job.data;

  try {
    logger.info(`Sending email to ${to}: ${subject}`);

    // TODO: Implement actual email sending logic
    // Example: await nodemailer.sendMail({ to, subject, html: body });

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = processEmail;
