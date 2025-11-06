const baseTemplate = require('./base.template');

/**
 * Email verification template
 * Locket design with yellow branding
 * @param {Object} data - Verification data
 * @param {string} data.name - User's name
 * @param {string} data.verificationUrl - Email verification URL with token
 * @returns {string} HTML email content
 */
const verifyEmailTemplate = ({ name, verificationUrl }) => {
  const content = `
    <div class="email-header">
      <div class="email-header-content">
        <div class="logo">Locket</div>
        <h1>✉️ Verify Your Email</h1>
      </div>
    </div>

    <div class="email-body">
      <div class="email-content">
        <h2>Hey ${name}! 👋</h2>

        <p>
          Thanks for signing up with <strong>Locket</strong>! We're thrilled to have you here.
        </p>

        <p>
          To complete your registration and unlock all features, please verify your
          email address by clicking the button below:
        </p>

        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">
            Verify Email Address
          </a>
        </p>

        <div class="info-box">
          <p><strong>✨ Why verify your email?</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px; color: #BDBDBD;">
            <li style="margin-bottom: 8px;">🔔 Receive important notifications and updates</li>
            <li style="margin-bottom: 8px;">🔒 Keep your account secure</li>
            <li style="margin-bottom: 8px;">🔑 Enable password recovery if needed</li>
            <li style="margin-bottom: 8px;">🚀 Unlock all Locket features</li>
          </ul>
        </div>

        <p style="color: #BDBDBD;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <div class="url-box">
          ${verificationUrl}
        </div>

        <div class="divider"></div>

        <p style="color: #BDBDBD; font-size: 14px;">
          <strong style="color: #FFD968;">Didn't create an account?</strong><br>
          If you didn't sign up for a Locket account, you can safely ignore this email.
          No account has been created yet.
        </p>

        <p style="margin-top: 30px; color: #BDBDBD;">
          Let's get started! 🚀<br>
          <strong style="color: #FFC542;">The Locket Team</strong>
        </p>
      </div>
    </div>
  `;

  return baseTemplate(content, { title: 'Verify Your Email - Locket' });
};

module.exports = verifyEmailTemplate;
