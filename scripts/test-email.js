require('dotenv').config();
require('module-alias/register');
const mailService = require('@core/mail/mail.service');
const logger = require('@utils/logger');

/**
 * Script to test email functionality directly without API
 * Usage: node scripts/test-email.js [email]
 */

async function testEmail() {
  const email = process.argv[2] || 'test@example.com';

  console.log('\n=================================');
  console.log('Testing Email Configuration');
  console.log('=================================\n');

  try {
    // Step 1: Verify SMTP connection
    console.log('Step 1: Verifying SMTP connection...');
    await mailService.verifyConnection();
    console.log('✅ SMTP connection verified successfully\n');

    // Step 2: Send test email
    console.log(`Step 2: Sending test email to ${email}...`);
    const result = await mailService.sendTestEmail(email);
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${result.messageId}\n`);

    console.log('=================================');
    console.log('Test completed successfully! 🎉');
    console.log('=================================\n');

    console.log('Please check your email inbox (and spam folder) for the test email.');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed!\n');
    console.error('Error:', error.message);

    console.log('\n=================================');
    console.log('Troubleshooting Tips:');
    console.log('=================================');
    console.log('1. Check your .env file has correct SMTP settings');
    console.log('2. For Gmail, ensure you have created an App Password');
    console.log('3. Check firewall settings for port 587/465');
    console.log('4. Verify your internet connection\n');

    logger.error('Email test failed:', error);

    process.exit(1);
  }
}

testEmail();
