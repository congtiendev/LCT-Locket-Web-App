const baseTemplate = require('./base.template');

/**
 * Test email template
 * Minimal and professional design with black-white-yellow color scheme
 * @param {Object} data - Test data
 * @param {string} data.email - Recipient email
 * @param {Object} data.config - Mail configuration (optional)
 * @returns {string} HTML email content
 */
const testEmailTemplate = ({ email, config = {} }) => {
  const content = `
    <div class="email-header">
      <div class="logo">Locket</div>
      <h1>Email Test</h1>
    </div>

    <div class="email-body">
      <div class="email-content">
        
        <h2>Hệ thống email hoạt động bình thường</h2>

        <p>
          Nếu bạn nhận được email này, cấu hình email đang hoạt động chính xác.
        </p>

        <div class="info-box">
          <p style="color: #BDBDBD; margin-bottom: 20px;">
            <strong style="color: #FFFFFF;">Thông tin test</strong>
          </p>
          
          <p style="color: #808080;">
            Người nhận<br>
            <strong style="color: #FFFFFF;">${email}</strong>
          </p>
          
          ${
            config.host
              ? `
          <p style="color: #808080; margin-top: 16px;">
            SMTP Host<br>
            <strong style="color: #FFFFFF;">${config.host}:${config.port || '587'}</strong>
          </p>
          `
              : ''
          }
          
          ${
            config.fromAddress
              ? `
          <p style="color: #808080; margin-top: 16px;">
            From<br>
            <strong style="color: #FFFFFF;">${config.fromName || 'Locket'} <${config.fromAddress}></strong>
          </p>
          `
              : ''
          }
          
          <p style="color: #808080; margin-top: 16px;">
            Thời gian<br>
            <strong style="color: #FFFFFF;">${new Date().toLocaleString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}</strong>
          </p>
          
          <p style="color: #808080; margin-top: 16px;">
            Environment<br>
            <strong style="color: #FFFFFF;">${process.env.NODE_ENV || 'development'}</strong>
          </p>
        </div>

        <div style="border-left: 2px solid #FFC542; padding-left: 16px; margin: 32px 0;">
          <p style="color: #BDBDBD; margin: 0;">
            Đây là email test tự động. Không cần thực hiện hành động nào.
          </p>
        </div>

        <p class="text-small" style="margin-top: 40px;">
          Locket Development Team
        </p>

      </div>
    </div>
  `;

  return baseTemplate(content, { title: 'Email Test - Locket' });
};

module.exports = testEmailTemplate;
