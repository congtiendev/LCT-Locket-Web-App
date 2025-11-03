# Mail API Documentation

## Overview
Module mail service cung cấp các API để gửi email và kiểm tra kết nối SMTP.

## Configuration
Cấu hình email trong file `.env`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=congtiendev@gmail.com
MAIL_PASSWORD=anrhxdkoomqylepo
MAIL_FROM_ADDRESS=congtiendev@gmail.com
MAIL_FROM_NAME="LCT Support"
```

## API Endpoints

### 1. Verify SMTP Connection
Kiểm tra kết nối SMTP có hoạt động hay không.

**Endpoint:** `GET /api/mail/verify`

**Authentication:** Required (Bearer Token)

**Request:**
```bash
curl -X GET http://localhost:3000/api/mail/verify \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "SMTP connection verified successfully",
  "data": {
    "success": true,
    "message": "SMTP connection is ready"
  }
}
```

---

### 2. Send Test Email
Gửi email test với template có sẵn.

**Endpoint:** `POST /api/mail/test`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "email": "recipient@example.com"
}
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/mail/test \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recipient@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "data": {
    "success": true,
    "messageId": "<unique-message-id@gmail.com>",
    "message": "Email sent successfully"
  }
}
```

---

### 3. Send Custom Email
Gửi email tùy chỉnh với nội dung HTML.

**Endpoint:** `POST /api/mail/send`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Hello</h1><p>This is your email content</p>",
  "text": "Plain text version (optional)",
  "from": "custom@example.com (optional)"
}
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/mail/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Welcome to LCT Locket",
    "html": "<h1>Welcome!</h1><p>Thank you for joining us.</p>"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "success": true,
    "messageId": "<unique-message-id@gmail.com>",
    "message": "Email sent successfully"
  }
}
```

---

## Testing with Postman

### Step 1: Get Access Token
First, login to get access token:

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

### Step 2: Test Email API
Use the access token from step 1:

```
POST http://localhost:3000/api/mail/test
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "email": "test@example.com"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email address is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "SMTP connection failed"
}
```

## Gmail Setup Instructions

Nếu sử dụng Gmail, bạn cần:

1. Bật **2-Step Verification** trong Google Account
2. Tạo **App Password**:
   - Truy cập: https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other (Custom name)"
   - Đặt tên: "LCT Locket Web App"
   - Copy password tạo được và dùng làm `MAIL_PASSWORD` trong `.env`

## Queue Integration

Email cũng có thể được gửi qua queue system:

```javascript
const { emailQueue } = require('@core/queue/bull.config');

await emailQueue.add({
  to: 'recipient@example.com',
  subject: 'Queue Email',
  html: '<h1>Email from Queue</h1>',
});
```

## Troubleshooting

### SMTP Connection Failed
- Kiểm tra MAIL_HOST và MAIL_PORT đúng chưa
- Kiểm tra firewall có chặn port 587/465 không
- Với Gmail, đảm bảo đã tạo App Password

### Authentication Failed
- Kiểm tra MAIL_USER và MAIL_PASSWORD
- Với Gmail, dùng App Password thay vì password thông thường

### Email Not Received
- Kiểm tra spam folder
- Kiểm tra logs để xem email có được gửi thành công không
- Kiểm tra MAIL_FROM_ADDRESS có hợp lệ không
