require('dotenv').config();
require('module-alias/register');
const mailService = require('@core/mail/mail.service');

console.log('\n🔍 Quick Mail Test\n');
console.log('=================================');

// Test 1: Verify connection
console.log('1️⃣  Testing SMTP connection...');
mailService.verifyConnection()
  .then(() => {
    console.log('   ✅ SMTP connection verified!');
    console.log('\n=================================');
    console.log('✅ Mail module is working correctly!\n');
    console.log('📧 Mail API Endpoints:');
    console.log('   GET  /api/mail/verify');
    console.log('   POST /api/mail/test');
    console.log('   POST /api/mail/send');
    console.log('\n💡 To send test email, run:');
    console.log('   node scripts/test-email.js your-email@example.com\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n   ❌ Connection failed:', error.message);
    console.log('\n📝 Check your .env file:');
    console.log('   MAIL_HOST=' + process.env.MAIL_HOST);
    console.log('   MAIL_PORT=' + process.env.MAIL_PORT);
    console.log('   MAIL_USER=' + process.env.MAIL_USER);
    console.log('   MAIL_PASSWORD=' + (process.env.MAIL_PASSWORD ? '***' : 'NOT SET'));
    console.log('\n');
    process.exit(1);
  });
