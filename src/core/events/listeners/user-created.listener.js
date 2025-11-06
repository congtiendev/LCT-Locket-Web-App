const logger = require('@utils/logger');
const { emailQueue } = require('../../queue/bull.config');
const templateHelper = require('../../../modules/mail/helpers/template.helper');

const handleUserCreated = async (user) => {
  try {
    logger.info(`User created event received for user: ${user.email}`);

    // Send welcome email using template
    const subject = templateHelper.getWelcomeSubject();
    const html = templateHelper.welcome({
      name: user.name,
      email: user.email,
    });

    await emailQueue.add({
      to: user.email,
      subject: subject,
      html: html,
    });
  } catch (error) {
    logger.error('Error handling user created event:', error);
  }
};

module.exports = handleUserCreated;
