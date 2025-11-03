# Database Setup Commands

Hướng dẫn sử dụng các lệnh để tạo và quản lý database cho LCT-NODEJS-CORE project.

## Yêu cầu

- ✅ PostgreSQL đã được cài đặt (Laragon hoặc standalone)
- ✅ Project đã clone về và `npm install` hoàn tất
- ✅ PostgreSQL service đang chạy

## 🚀 Quick Start (3 lệnh)

```bash
# 1. Tạo file environment
cp .env.example .env

# 2. Tạo database và schema
npx prisma db push

# 3. Seed dữ liệu mẫu
npm run prisma:seed
```

**Xong! Database đã sẵn sàng sử dụng.**

## 📋 Chi tiết từng bước

### Bước 1: Cấu hình Environment

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/macOS
cp .env.example .env
```

**Kiểm tra cấu hình DATABASE_URL trong .env:**

```env
DATABASE_URL="postgresql://postgres:@localhost:5432/lct_nodejs_core?schema=public"
```

> **Lưu ý:** Thay đổi `postgres:` thành `username:password` nếu PostgreSQL có mật khẩu

### Bước 2: Tạo Database Schema

```bash
npx prisma db push
```

**Output mong đợi:**

```
✔ Generated Prisma Client
PostgreSQL database lct_nodejs_core created at localhost:5432
Your database is now in sync with your Prisma schema. Done in XXXms
```

**Lệnh này thực hiện:**

- Tạo database `lct_nodejs_core` (nếu chưa có)
- Tạo tables: `users`, `tokens`
- Tự động generate Prisma Client

### Bước 3: Seed Dữ liệu Mẫu

```bash
npm run prisma:seed
```

**Output mong đợi:**

```
Start seeding...
{ admin: { id: 'xxx', email: 'admin@lct.com', ... } }
{ testUser: { id: 'xxx', email: 'user@lct.com', ... } }
Seeding finished.
```

**Dữ liệu được tạo:**

- **Admin:** `admin@lct.com` / `123456`
- **User:** `user@lct.com` / `123456`

## 🔧 Commands Reference

### Database Management

```bash
# Xem database bằng GUI
npm run prisma:studio
# → Mở http://localhost:5555

# Reset và tạo lại toàn bộ database
npm run prisma:reset

# Chỉ seed data (không reset)
npm run prisma:seed

# Generate Prisma Client sau khi sửa schema
npm run prisma:generate
```

### Development Commands

```bash
# Push schema changes (development)
npx prisma db push

# Tạo migration file (production ready)
npx prisma migrate dev --name "your-migration-name"

# Apply migrations trên production
npx prisma migrate deploy

# Xem migration status
npx prisma migrate status
```

### Debugging Commands

```bash
# Xem SQL queries trong console
DEBUG=prisma:query npm run dev

# Validate schema
npx prisma validate

# Format schema file
npx prisma format
```

## 🔄 Quy trình làm việc thường dùng

### Lần đầu setup project

```bash
git clone <repository>
cd LCT-NODEJS-CORE
npm install
cp .env.example .env
npx prisma db push
npm run prisma:seed
npm run dev
```

### Khi có thay đổi schema (Development)

```bash
# Sửa file prisma/schema.prisma
# Sau đó:
npx prisma db push
npm run prisma:generate
```

### Khi cần reset database

```bash
npm run prisma:reset
# Hoặc
npx prisma db push --force-reset
npm run prisma:seed
```

### Khi cần xem/sửa data

```bash
npm run prisma:studio
# Mở browser tại http://localhost:5555
```

## ⚠️ Troubleshooting

### Lỗi: Database connection failed

```bash
# Kiểm tra PostgreSQL có chạy không
# Windows (Laragon): Mở Laragon → Start PostgreSQL
# Linux: sudo systemctl status postgresql
# macOS: brew services list | grep postgresql
```

### Lỗi: Database does not exist

```bash
# PostgreSQL chưa có database, chạy:
npx prisma db push
# Lệnh này sẽ tự động tạo database
```

### Lỗi: Permission denied

```bash
# Sai username/password trong DATABASE_URL
# Sửa file .env:
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/lct_nodejs_core"
```

### Lỗi: Port 5432 already in use

```bash
# PostgreSQL đã chạy trên port khác, check:
netstat -an | findstr 5432
# Hoặc thay đổi port trong DATABASE_URL
```

## 📊 Verification

### Kiểm tra database đã tạo thành công:

```bash
npm run prisma:studio
```

Hoặc connect trực tiếp:

```bash
psql -h localhost -U postgres -d lct_nodejs_core -c "SELECT * FROM users;"
```

### Kiểm tra có thể login API:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lct.com","password":"123456"}'
```

---

**🎯 Mục tiêu:** Sau khi chạy xong các commands trên, bạn có database hoạt động với:

- ✅ Tables được tạo theo schema
- ✅ 2 user accounts để test
- ✅ Prisma Client ready để sử dụng
- ✅ API có thể connect database
