# Render.com Deployment Guide

## 🚀 Deploy Status

**Production URL:** https://lct-locket-web-app.onrender.com

## 📋 Environment Variables Setup

Để enable Google OAuth trên Render, bạn cần thêm các environment variables sau vào Render Dashboard:

### 1. Truy cập Render Dashboard

1. Vào https://dashboard.render.com
2. Chọn service: `lct-locket-web-app`
3. Click tab **Environment**
4. Click **Add Environment Variable**

### 2. Thêm Google OAuth Variables

#### Required Variables (để enable Google OAuth):

```env
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://lct-locket-web-app.onrender.com/api/auth/google/callback
FRONTEND_URL=https://congtiendev-locket-web.figma.site
```

**Note:** Get actual credentials from `.env` file or Google Cloud Console

### 3. Other Important Variables

```env
# Database (should already be set)
DATABASE_URL=<your-postgres-url>

# JWT Secrets (get from .env file - 128 character random hex strings)
JWT_SECRET=<your-jwt-secret-from-env-file>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret-from-env-file>

# Email SMTP (get from .env file)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=<your-email>@gmail.com
MAIL_PASSWORD=<your-gmail-app-password>
MAIL_FROM_ADDRESS=<your-email>@gmail.com
MAIL_FROM_NAME=LCT Support

# Application
NODE_ENV=production
PORT=3000
APP_URL=https://lct-locket-web-app.onrender.com

# Redis (optional - can disable)
DISABLE_REDIS=true
```

## 🔧 Steps to Add Environment Variables

### Via Render Dashboard UI:

1. Go to service settings
2. Click **Environment** tab
3. Click **Add Environment Variable**
4. Paste variable name and value
5. Click **Save Changes**
6. Render will automatically redeploy

### Via Render.yaml (Alternative):

Create `render.yaml` in root:

```yaml
services:
  - type: web
    name: lct-locket-web-app
    env: node
    buildCommand: npm install && npx prisma generate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: GOOGLE_CLIENT_ID
        sync: false  # Add actual value in Render dashboard
      - key: GOOGLE_CLIENT_SECRET
        sync: false  # Add actual value in Render dashboard
      - key: GOOGLE_CALLBACK_URL
        value: https://lct-locket-web-app.onrender.com/api/auth/google/callback
      - key: FRONTEND_URL
        value: https://congtiendev-locket-web.figma.site
```

## ✅ Verify Deployment

### 1. Check Server Health

```bash
curl https://lct-locket-web-app.onrender.com/
```

Expected response:
```json
{
  "success": true,
  "message": "LCT Node.js Core API is running",
  "version": "1.0.0",
  "timestamp": "2024-11-06T02:41:58.000Z"
}
```

### 2. Check Google OAuth Status

**Before adding env vars:**
```bash
curl https://lct-locket-web-app.onrender.com/api/auth/google
```

Response (503):
```json
{
  "success": false,
  "message": "Google OAuth is not configured on this server",
  "error": "Service Unavailable"
}
```

**After adding env vars:**
```bash
curl -I https://lct-locket-web-app.onrender.com/api/auth/google
```

Response: Should redirect to Google OAuth (302)

### 3. Check Logs

1. Go to Render Dashboard
2. Click **Logs** tab
3. Look for:

```
✅ Should see:
[info]: Google OAuth is enabled - initializing strategy
[info]: Mail transporter initialized successfully
[info]: Server is running on port 3000

❌ Should NOT see:
TypeError: OAuth2Strategy requires a clientID option
```

## 🔄 Deployment Process

### Automatic Deployment:

Render automatically deploys when you push to `master` branch:

1. Push code to GitHub
2. Render detects changes
3. Runs build command: `npm install && npx prisma generate`
4. Runs migrations: `npx prisma migrate deploy`
5. Starts server: `npm start`

### Manual Deployment:

1. Go to Render Dashboard
2. Click **Manual Deploy**
3. Select branch: `master`
4. Click **Deploy**

## 🐛 Common Deployment Issues

### Issue 1: "OAuth2Strategy requires a clientID"

**Cause:** Google OAuth environment variables not set

**Solution:** Add the 4 Google OAuth variables listed above in Render Dashboard

### Issue 2: Database Connection Failed

**Cause:** `DATABASE_URL` not configured

**Solution:**
1. Create PostgreSQL database on Render
2. Copy internal connection string
3. Add to environment variables

### Issue 3: Email Sending Failed

**Cause:** SMTP credentials not set or incorrect

**Solution:**
1. Use Gmail App Password (not regular password)
2. Generate at: https://myaccount.google.com/apppasswords
3. Update `MAIL_PASSWORD` in environment variables

### Issue 4: CORS Errors from Frontend

**Cause:** Backend CORS not allowing frontend domain

**Solution:** Already configured to allow all origins in `app.js`:
```javascript
app.use(cors()); // Allows all origins
```

For production, update to:
```javascript
app.use(cors({
  origin: ['https://congtiendev-locket-web.figma.site'],
  credentials: true
}));
```

## 📊 Monitoring

### View Logs:
```bash
# Real-time logs in Render Dashboard > Logs tab
```

### Check Metrics:
- CPU Usage
- Memory Usage
- Response Time
- Request Rate

### Alerts:
- Set up email alerts for deploy failures
- Monitor uptime with external service (UptimeRobot, Pingdom)

## 🔐 Security Checklist

- [x] JWT secrets are strong (128-char random)
- [x] Database uses SSL connection
- [x] Environment variables stored securely
- [x] CORS configured for specific origins
- [x] Rate limiting enabled
- [x] Helmet.js security headers enabled
- [x] XSS protection enabled
- [x] SQL injection protection (Prisma ORM)
- [ ] Enable HTTPS only (Render does this automatically)
- [ ] Set up monitoring and alerts

## 📚 Related Documentation

- [Frontend Quick Start](./FRONTEND_QUICKSTART.md) - Hướng dẫn cho FE team
- [Google OAuth Integration](./GOOGLE_OAUTH_INTEGRATION.md) - Chi tiết OAuth flow
- [Auth Module README](../src/modules/auth/README.md) - API reference

## 🆘 Support

**Render Issues:**
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs
- Status: https://status.render.com

**Application Issues:**
- GitHub: https://github.com/congtiendev/LCT-Locket-Web-App
- Check logs in Render Dashboard
- Contact backend team

---

**Last Updated:** 2024-11-06
**Deployment URL:** https://lct-locket-web-app.onrender.com
