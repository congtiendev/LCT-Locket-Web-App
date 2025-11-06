# Email Templates

Professional, responsive email templates for LCT Locket Web App.

## 📁 Structure

```
templates/
├── base.template.js           # Base layout with responsive design
├── welcome.template.js         # New user welcome email
├── password-reset.template.js  # Password reset email
├── verify-email.template.js    # Email verification
├── test-email.template.js      # Test email for SMTP configuration
├── index.js                    # Export all templates
└── README.md                   # This file
```

## 🎨 Templates

### 1. Base Template
**File:** `base.template.js`

Foundation template providing:
- Responsive design (mobile-friendly)
- Consistent branding with gradient header
- Professional footer
- Clean, modern styling

**Usage:**
```javascript
const baseTemplate = require('./base.template');
const html = baseTemplate(content, { title: 'Email Title' });
```

### 2. Welcome Email
**File:** `welcome.template.js`

Sent when a new user registers.

**Parameters:**
- `name` (string) - User's name
- `email` (string) - User's email address

**Features:**
- Welcoming message
- Account details summary
- Getting started guide
- Call-to-action button

**Example:**
```javascript
const welcomeTemplate = require('./welcome.template');
const html = welcomeTemplate({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### 3. Password Reset
**File:** `password-reset.template.js`

Sent when user requests password reset.

**Parameters:**
- `name` (string) - User's name
- `resetUrl` (string) - Password reset URL with token
- `expiresIn` (string, optional) - Token expiration time (default: "1 hour")

**Features:**
- Clear call-to-action button
- Security tips
- Link expiration warning
- Fallback URL for copy-paste

**Example:**
```javascript
const passwordResetTemplate = require('./password-reset.template');
const html = passwordResetTemplate({
  name: 'John Doe',
  resetUrl: 'https://example.com/reset?token=abc123',
  expiresIn: '1 hour'
});
```

### 4. Email Verification
**File:** `verify-email.template.js`

Sent to verify user's email address.

**Parameters:**
- `name` (string) - User's name
- `verificationUrl` (string) - Email verification URL with token

**Features:**
- Clear verification button
- Benefits of verification
- Fallback URL for copy-paste
- Security information

**Example:**
```javascript
const verifyEmailTemplate = require('./verify-email.template');
const html = verifyEmailTemplate({
  name: 'John Doe',
  verificationUrl: 'https://example.com/verify?token=xyz789'
});
```

### 5. Test Email
**File:** `test-email.template.js`

Used for testing SMTP configuration.

**Parameters:**
- `email` (string) - Recipient email address

**Features:**
- SMTP configuration details
- Timestamp information
- Environment details
- Configuration verification

**Example:**
```javascript
const testEmailTemplate = require('./test-email.template');
const html = testEmailTemplate({
  email: 'test@example.com'
});
```

## 🔧 Template Helper

**File:** `../helpers/template.helper.js`

Provides convenient methods to generate emails:

```javascript
const templateHelper = require('../helpers/template.helper');

// Welcome email
const html = templateHelper.welcome({ name: 'John', email: 'john@example.com' });
const subject = templateHelper.getWelcomeSubject();

// Password reset
const html = templateHelper.passwordReset({
  name: 'John',
  resetUrl: 'https://...',
  expiresIn: '1 hour'
});
const subject = templateHelper.getPasswordResetSubject();

// Email verification
const html = templateHelper.verifyEmail({
  name: 'John',
  verificationUrl: 'https://...'
});
const subject = templateHelper.getVerifyEmailSubject();

// Test email
const html = templateHelper.testEmail({ email: 'test@example.com' });
const subject = templateHelper.getTestEmailSubject();
```

## 🎯 Usage in Services

### Mail Service
**File:** `src/core/mail/mail.service.js`

```javascript
const mailService = require('@core/mail/mail.service');

// Send test email
await mailService.sendTestEmail('user@example.com');

// Send welcome email
await mailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Send password reset
await mailService.sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  'https://app.com/reset?token=abc',
  '1 hour'
);

// Send verification email
await mailService.sendVerificationEmail(
  'user@example.com',
  'John Doe',
  'https://app.com/verify?token=xyz'
);
```

## 🎨 Design Features

All templates include:
- **Responsive Design**: Mobile-friendly layout
- **Modern Styling**: Gradient colors (#667eea to #764ba2)
- **Professional Typography**: System font stack
- **Clear CTAs**: Prominent action buttons
- **Security Focus**: Clear security messages
- **Branding**: Consistent LCT Locket branding

## 🔄 Customization

To customize templates:

1. **Colors**: Edit gradient values in `base.template.js`
2. **Branding**: Update company name and footer
3. **Styling**: Modify CSS in base template
4. **Content**: Edit individual template files

## 📝 Environment Variables

Templates use the following environment variables:
- `APP_URL`: Application URL for links (default: http://localhost:3000)
- `NODE_ENV`: Environment mode (development/production)

## 🧪 Testing

Test email templates:

```bash
# Via API endpoint
POST /api/mail/test
{
  "email": "your-email@example.com"
}

# Or programmatically
const mailService = require('@core/mail/mail.service');
await mailService.sendTestEmail('test@example.com');
```

## 📚 Best Practices

1. **Always use templates** instead of inline HTML
2. **Use template helper** for consistency
3. **Test emails** in multiple clients (Gmail, Outlook, etc.)
4. **Keep content concise** and scannable
5. **Include plain text alternatives** when possible
6. **Use clear CTAs** with prominent buttons
7. **Maintain security awareness** in messaging

## 🐛 Troubleshooting

**Email not rendering?**
- Check that mail.config.js is properly configured
- Verify SMTP credentials
- Test connection with `/api/mail/verify` endpoint

**Styling issues?**
- Some email clients strip CSS - use inline styles
- Test in multiple email clients
- Use email testing tools like Litmus

**Links not working?**
- Ensure APP_URL is set in environment variables
- Check token generation in respective services
- Verify URL format in templates

## 📞 Support

For issues or questions about email templates:
- Check mail service logs
- Test with `/api/mail/test` endpoint
- Review mail.config.js configuration
- Check SMTP server connection
