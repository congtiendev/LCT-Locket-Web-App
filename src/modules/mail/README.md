# Mail Module

Module xử lý việc gửi email trong hệ thống LCT Locket Web App.

## Features

- ✅ Gửi email sử dụng SMTP (hỗ trợ Gmail, SendGrid, Mailtrap, etc.)
- ✅ Gửi test email với template có sẵn
- ✅ Gửi custom email với HTML content
- ✅ Kiểm tra kết nối SMTP
- ✅ Tích hợp với Queue system (Bull)
- ✅ Logging và error handling
- ✅ Validation với Joi

## Structure

```
src/modules/mail/
├── controllers/
│   └── mail.controller.js      # Controller xử lý HTTP requests
├── routes/
│   └── mail.routes.js          # Route definitions
├── validators/
│   └── mail.validator.js       # Joi validation schemas
└── index.js                    # Module exports
```

## Installation

Module này đã được tích hợp sẵn. Không cần cài đặt thêm.

Dependencies:
- `nodemailer` - Gửi email
- `joi` - Validation

## Configuration

Cấu hình trong file `.env`:

```env
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="LCT Support"
```

### Gmail Setup

1. Bật **2-Step Verification** tại: https://myaccount.google.com/security
2. Tạo **App Password** tại: https://myaccount.google.com/apppasswords
3. Sử dụng App Password làm `MAIL_PASSWORD`

## Usage

### API Endpoints

Tất cả endpoints yêu cầu authentication (Bearer token).

#### 1. Verify SMTP Connection
```http
GET /api/mail/verify
Authorization: Bearer {token}
```

#### 2. Send Test Email
```http
POST /api/mail/test
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "recipient@example.com"
}
```

#### 3. Send Custom Email
```http
POST /api/mail/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Hello</h1><p>Email content</p>",
  "text": "Plain text version (optional)",
  "from": "custom@example.com (optional)"
}
```

### Direct Usage in Code

```javascript
const mailService = require('@core/mail/mail.service');

// Send test email
await mailService.sendTestEmail('recipient@example.com');

// Send custom email
await mailService.sendMail({
  to: 'recipient@example.com',
  subject: 'Welcome',
  html: '<h1>Welcome to our app!</h1>',
});

// Verify SMTP connection
await mailService.verifyConnection();
```

### Queue Integration

```javascript
const { emailQueue } = require('@core/queue/bull.config');

// Add email to queue
await emailQueue.add({
  to: 'recipient@example.com',
  subject: 'Async Email',
  html: '<p>This email will be sent asynchronously</p>',
});
```

## Testing

### Method 1: Using Test Script
```bash
# Test with default email
node scripts/test-email.js

# Test with specific email
node scripts/test-email.js your-email@example.com
```

### Method 2: Using Postman
1. Import collection: `docs/postman/Mail-API.postman_collection.json`
2. Login to get access token
3. Test các endpoints

### Method 3: Using curl
```bash
# Login first
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}'

# Send test email
curl -X POST http://localhost:3000/api/mail/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Error Handling

Module xử lý các lỗi phổ biến:

- **SMTP Connection Failed**: Kiểm tra host, port, credentials
- **Authentication Failed**: Kiểm tra username/password (với Gmail dùng App Password)
- **Invalid Email**: Validation sẽ catch trước khi gửi
- **Network Error**: Kiểm tra firewall và internet connection

Tất cả lỗi đều được log vào `logs/` folder.

## Development

### Adding New Email Templates

Thêm method mới vào `mail.service.js`:

```javascript
async sendWelcomeEmail(to, userName) {
  const subject = 'Welcome to LCT Locket';
  const html = `
    <h1>Welcome ${userName}!</h1>
    <p>Thank you for joining us...</p>
  `;

  return this.sendMail({ to, subject, html });
}
```

### Adding New Endpoints

1. Thêm validator trong `validators/mail.validator.js`
2. Thêm controller method trong `controllers/mail.controller.js`
3. Thêm route trong `routes/mail.routes.js`

## Troubleshooting

### Email không được gửi
- Kiểm tra logs trong `logs/` folder
- Verify SMTP connection bằng endpoint `/api/mail/verify`
- Test trực tiếp bằng script: `node scripts/test-email.js`

### Gmail authentication failed
- Đảm bảo đã bật 2-Step Verification
- Sử dụng App Password thay vì password thông thường
- Kiểm tra không có khoảng trắng trong password

### Email vào spam
- Cấu hình SPF, DKIM records cho domain
- Sử dụng professional email content
- Tránh spam keywords

## Documentation

- [Mail API Documentation](../../docs/mail-api.md)
- [Postman Collection](../../docs/postman/Mail-API.postman_collection.json)
- [Test Script](../../scripts/test-email.js)

## License

MIT
