const baseTemplate = require('./base.template');

/**
 * Password reset email template
 * Locket design with yellow branding
 * @param {Object} data - Reset data
 * @param {string} data.name - User's name
 * @param {string} data.resetUrl - Password reset URL with token
 * @param {string} data.expiresIn - Token expiration time (e.g., "1 hour")
 * @returns {string} HTML email content
 */
const passwordResetTemplate = ({ name, resetUrl, expiresIn = '1 hour' }) => {
  const content = `
    <div class="email-header">
      <div class="email-header-content">
        <div class="logo">Locket</div>
        <h1>🔒 Password Reset</h1>
      </div>
    </div>

    <div class="email-body">
      <div class="email-content">
        <h2>Hey ${name},</h2>

        <p>
          We received a request to reset your password for your <strong>Locket</strong> account.
          Don't worry, we've got you covered!
        </p>

        <p>
          Click the button below to create a new password. This link will expire in
          <strong style="color: #FFC542;">${expiresIn}</strong> for security reasons.
        </p>

        <p style="text-align: center;">
          <a href="${resetUrl}" class="button">
            Reset Password
          </a>
        </p>

        <div class="info-box">
          <p><strong>🛡️ Security Tips</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px; color: #BDBDBD;">
            <li style="margin-bottom: 8px;">This link is single-use and expires in ${expiresIn}</li>
            <li style="margin-bottom: 8px;">Never share this link with anyone</li>
            <li style="margin-bottom: 8px;">Choose a strong, unique password</li>
            <li style="margin-bottom: 8px;">Use a mix of letters, numbers, and symbols</li>
          </ul>
        </div>

        <p style="color: #BDBDBD;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <div class="url-box">
          ${resetUrl}
        </div>

        <div class="divider"></div>

        <p style="color: #BDBDBD; font-size: 14px;">
          <strong style="color: #FFD968;">Didn't request a password reset?</strong><br>
          If you didn't make this request, you can safely ignore this email. Your password will
          remain unchanged. However, if you're concerned about your account security, please
          contact our support team immediately.
        </p>

        <p style="margin-top: 30px; color: #BDBDBD;">
          Stay secure! 🔐<br>
          <strong style="color: #FFC542;">The Locket Security Team</strong>
        </p>
      </div>
    </div>
  `;

  return baseTemplate(content, { title: 'Reset Your Password - Locket' });
};

module.exports = passwordResetTemplate;
