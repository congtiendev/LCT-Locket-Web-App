const baseTemplate = require('./base.template');

/**
 * Welcome email template for new users
 * Locket design with warm yellow branding (#FFC542)
 * @param {Object} data - User data
 * @param {string} data.name - User's name
 * @param {string} data.email - User's email
 * @returns {string} HTML email content
 */
const welcomeTemplate = ({ name, email }) => {
  const content = `
    <div class="email-header">
      <div class="logo">💛</div>
      <h1>Chào mừng đến với Locket! 🎉</h1>
    </div>

    <div class="email-body">
      <div class="email-content">
        <h2>Xin chào ${name}! 👋</h2>

        <p>
          Chúng tôi rất vui khi bạn tham gia <strong>Locket</strong>! Tài khoản của bạn đã được 
          thiết lập và sẵn sàng để chia sẻ những khoảnh khắc đặc biệt.
        </p>

        <p>
          Locket là không gian riêng của bạn để chia sẻ ảnh và kỷ niệm với những người quan trọng nhất. 
          Hãy cùng bắt đầu nhé!
        </p>

        <div class="info-box">
          <p><strong>Thông tin tài khoản</strong></p>
          <p>📧 Email: <code>${email}</code></p>
          <p>👤 Tên: ${name}</p>
          <p>📅 Ngày tham gia: ${new Date().toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</p>
        </div>

        <p>
          <strong style="color: #FFC542;">Bước tiếp theo là gì?</strong>
        </p>
        <ul>
          <li>✨ Thiết lập hồ sơ và thêm ảnh đại diện</li>
          <li>📸 Bắt đầu chia sẻ những khoảnh khắc đầu tiên</li>
          <li>👥 Kết nối với bạn bè và gia đình</li>
          <li>🎨 Khám phá tất cả các tính năng sáng tạo</li>
        </ul>

        <p style="text-align: center; margin-top: 32px;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}" class="button">
            Mở Locket
          </a>
        </p>

        <div class="divider"></div>

        <p style="color: #BDBDBD; font-size: 14px;">
          Cần trợ giúp để bắt đầu? Chúng tôi luôn ở đây để hỗ trợ bạn! 
          Liên hệ với đội ngũ hỗ trợ của chúng tôi bất cứ lúc nào.
        </p>

        <p style="margin-top: 30px; color: #BDBDBD;">
          Chúc bạn có những trải nghiệm tuyệt vời! 🌟<br>
          <strong style="color: #FFC542;">Đội ngũ Locket</strong>
        </p>
      </div>
    </div>
  `;

  return baseTemplate(content, { title: 'Chào mừng đến với Locket!' });
};

module.exports = welcomeTemplate;
