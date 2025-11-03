const logger = require('@utils/logger');
const { emailQueue } = require('../../queue/bull.config');

const handleUserCreated = async (user) => {
  try {
    logger.info(`User created event received for user: ${user.email}`);

    // Send welcome email
    await emailQueue.add({
      to: user.email,
      subject: 'Welcome to LCT!',
      body: `<h1>Welcome ${user.name}!</h1><p>Thank you for registering.</p>`,
    });
  } catch (error) {
    logger.error('Error handling user created event:', error);
  }
};

module.exports = handleUserCreated;
