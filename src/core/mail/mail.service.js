const nodemailer = require('nodemailer');
const mailConfig = require('@config/mail.config');
const logger = require('@utils/logger');

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
    const subject = 'Test Email from LCT Locket Web App';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Test Email</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>This is a test email from <strong>LCT Locket Web App</strong>.</p>
            <p>If you're receiving this email, it means your email configuration is working correctly!</p>
            <p><strong>Email Configuration Details:</strong></p>
            <ul>
              <li>SMTP Host: ${mailConfig.host}</li>
              <li>SMTP Port: ${mailConfig.port}</li>
              <li>From: ${mailConfig.fromName} &lt;${mailConfig.fromAddress}&gt;</li>
            </ul>
            <p>Sent at: ${new Date().toLocaleString()}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} LCT Locket Web App. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

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
