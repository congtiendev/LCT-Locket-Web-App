# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker (optional)

## Environment Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure environment variables:
- Set `NODE_ENV=production`
- Update database credentials
- Set secure JWT secrets
- Configure Redis connection
- Set up email service
- Configure storage (S3 or local)

## Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

## Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Manual Deployment

### 1. Install Dependencies
```bash
npm ci --only=production
```

### 2. Build (if needed)
```bash
npm run build
```

### 3. Start Application
```bash
npm start
```

## Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name lct-api

# Save process list
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Setup

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com
```

## Health Checks

- Health endpoint: `GET /api/health`
- Monitor uptime and performance
- Set up alerts for failures

## Scaling

- Use load balancer (Nginx, HAProxy)
- Enable clustering
- Redis for session management
- Database read replicas

## Monitoring

- Use logging service (CloudWatch, Datadog)
- Set up error tracking (Sentry)
- Monitor performance (New Relic, AppDynamics)
- Database monitoring

## Backup

- Regular database backups
- Backup uploaded files
- Keep configuration backups
- Test restore procedures
