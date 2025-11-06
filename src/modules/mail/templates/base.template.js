/**
 * Base email template with Locket design system
 * Professional dark theme with yellow (#FFC542) branding
 */
const baseTemplate = (content, { title = 'Locket' } = {}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #FFFFFF;
      background-color: #0F0F0F;
      padding: 0;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1A1A1A;
      overflow: hidden;
    }

    .email-header {
      background: linear-gradient(135deg, #FFC542 0%, #FFD968 100%);
      color: #000000;
      padding: 56px 40px;
      text-align: center;
      position: relative;
    }

    .email-header-content {
      position: relative;
      z-index: 1;
    }

    .logo {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
      color: #000000;
      text-rendering: optimizeLegibility;
    }

    .email-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      color: #000000;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .email-body {
      padding: 48px 40px;
      background-color: #1A1A1A;
    }

    .email-content {
      color: #FFFFFF;
      font-size: 16px;
      line-height: 1.7;
      max-width: 520px;
      margin: 0 auto;
    }

    .email-content h2 {
      color: #FFC542;
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.3;
    }

    .email-content p {
      margin-bottom: 20px;
      color: #D1D1D1;
      font-size: 16px;
      line-height: 1.7;
    }

    .email-content strong {
      color: #FFFFFF;
      font-weight: 600;
    }

    .email-content ul {
      color: #D1D1D1;
      margin: 0;
      padding-left: 24px;
    }

    .email-content ul li {
      margin-bottom: 12px;
      line-height: 1.6;
    }

    .button {
      display: inline-block;
      padding: 18px 48px;
      background: #FFC542;
      color: #000000 !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 17px;
      margin: 32px 0;
      transition: all 0.2s ease;
      box-shadow: 0 4px 16px rgba(255, 197, 66, 0.3);
      text-align: center;
      letter-spacing: -0.01em;
    }

    .button:hover {
      background: #FFD968;
      box-shadow: 0 6px 24px rgba(255, 197, 66, 0.4);
    }

    .info-box {
      background-color: rgba(255, 197, 66, 0.08);
      border: 1px solid rgba(255, 197, 66, 0.2);
      border-left: 4px solid #FFC542;
      padding: 24px;
      margin: 32px 0;
      border-radius: 12px;
    }

    .info-box p {
      margin: 10px 0;
      color: #D1D1D1;
      line-height: 1.7;
    }

    .info-box strong {
      color: #FFC542;
      font-weight: 600;
      font-size: 16px;
    }

    .info-box code,
    .email-content code {
      background-color: rgba(255, 197, 66, 0.15);
      color: #FFC542;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
      font-size: 14px;
      font-weight: 500;
    }

    .url-box {
      word-break: break-all;
      color: #FFC542;
      font-size: 14px;
      background-color: rgba(255, 197, 66, 0.08);
      padding: 20px;
      border-radius: 12px;
      margin: 24px 0;
      border: 1px solid rgba(255, 197, 66, 0.2);
      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
      line-height: 1.6;
    }

    .email-footer {
      background-color: #121212;
      padding: 40px;
      text-align: center;
      color: #999999;
      font-size: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .email-footer p {
      margin: 10px 0;
      line-height: 1.6;
    }

    .email-footer strong {
      color: #FFC542;
      font-weight: 600;
    }

    .brand-accent {
      color: #FFC542;
      font-weight: 700;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      margin: 32px 0;
    }

    /* Emoji styling */
    .emoji {
      font-size: 22px;
      display: inline-block;
      margin-right: 6px;
      vertical-align: middle;
    }

    /* Responsive Design */
    @media only screen and (max-width: 600px) {
      .email-header {
        padding: 40px 24px !important;
      }

      .logo {
        font-size: 30px !important;
      }

      .email-header h1 {
        font-size: 26px !important;
      }

      .email-body {
        padding: 32px 24px !important;
      }

      .email-content {
        font-size: 15px !important;
      }

      .email-content h2 {
        font-size: 24px !important;
        margin-bottom: 20px !important;
      }

      .email-content p {
        font-size: 15px !important;
      }

      .button {
        display: block !important;
        width: 100% !important;
        padding: 16px 32px !important;
        font-size: 16px !important;
      }

      .info-box {
        padding: 20px !important;
        margin: 24px 0 !important;
      }

      .email-footer {
        padding: 32px 24px !important;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0F0F0F;
      }

      .email-wrapper {
        background-color: #1A1A1A;
      }
    }

    /* Email client specific resets */
    #outlook a {
      padding: 0;
    }

    .ExternalClass {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0F0F0F; padding: 20px 0;">
    <tr>
      <td align="center">
        <div class="email-wrapper">
          ${content}

          <div class="email-footer">
            <div class="logo" style="font-size: 28px; margin-bottom: 16px;">
              <span class="brand-accent">Locket</span>
            </div>
            <p style="color: #999999; margin-bottom: 20px; font-size: 15px;">
              Capture & Share Your Moments
            </p>
            <div class="divider"></div>
            <p style="color: #666666; font-size: 13px; margin-top: 20px; line-height: 1.6;">
              This email was sent from Locket. If you didn't request this email, please ignore it.
            </p>
            <p style="color: #666666; font-size: 13px; margin-top: 12px;">
              &copy; ${new Date().getFullYear()} Locket. All rights reserved.
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

module.exports = baseTemplate;
