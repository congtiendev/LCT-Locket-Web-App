module.exports = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM || process.env.MAIL_FROM_ADDRESS,
  fromAddress: process.env.MAIL_FROM_ADDRESS,
  fromName: process.env.MAIL_FROM_NAME || 'LCT Support',
};
