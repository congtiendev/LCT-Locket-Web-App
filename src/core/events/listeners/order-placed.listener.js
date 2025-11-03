const logger = require('@utils/logger');
const { emailQueue, notificationQueue } = require('../../queue/bull.config');

const handleOrderPlaced = async (order) => {
  try {
    logger.info(`Order placed event received for order: ${order.id}`);

    // Send order confirmation email
    await emailQueue.add({
      to: order.userEmail,
      subject: 'Order Confirmation',
      body: `<h1>Order Confirmed!</h1><p>Your order #${order.id} has been placed.</p>`,
    });

    // Send notification
    await notificationQueue.add({
      userId: order.userId,
      message: 'Your order has been placed successfully',
      type: 'ORDER_CONFIRMATION',
    });
  } catch (error) {
    logger.error('Error handling order placed event:', error);
  }
};

module.exports = handleOrderPlaced;
