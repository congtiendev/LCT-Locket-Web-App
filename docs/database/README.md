# Database Commands Guide

Hướng dẫn sử dụng commands để tạo và quản lý database cho LCT-NODEJS-CORE.

## 📁 Tài liệu

- **[setup.md](setup.md)** - 📖 Hướng dẫn commands tạo database từng bước
- **[schema.md](schema.md)** - 📋 Tài liệu cấu trúc database schema

## ⚡ Quick Setup (3 Commands)

```bash
cp .env.example .env              # 1. Tạo config
npx prisma db push                # 2. Tạo database
npm run prisma:seed               # 3. Seed data
```

## 🔧 Useful Commands

```bash
npm run prisma:studio             # GUI xem database
npm run prisma:reset              # Reset toàn bộ
DEBUG=prisma:query npm run dev    # Debug SQL queries
```

## 🗄️ Database Info

**Engine:** PostgreSQL  
**ORM:** Prisma  
**Database:** `lct_nodejs_core`

### Tables

- **users** - User accounts & profiles
- **tokens** - Authentication tokens

### Default Accounts

- **Admin:** `admin@lct.com` / `123456`
- **User:** `user@lct.com` / `123456`

## 📖 Chi tiết

### [Database Setup Commands](setup.md)

- ✅ Quick start commands
- ✅ Chi tiết từng bước
- ✅ Commands reference
- ✅ Troubleshooting
- ✅ Workflows thường dùng

### [Database Schema](schema.md)

- ✅ Models & relationships
- ✅ Enums & data types
- ✅ Indexes & performance
- ✅ Migration strategies

## � Typical Workflows

### First time setup

```bash
git clone <repo>
cd LCT-NODEJS-CORE
npm install
cp .env.example .env
npx prisma db push
npm run prisma:seed
npm run dev
```

### After schema changes

```bash
npx prisma db push
npm run prisma:generate
```

### Reset everything

```bash
npm run prisma:reset
```

### View/edit data

```bash
npm run prisma:studio
```

---

**🎯 Goal:** Database ready với tables, data, và Prisma Client để API sử dụng.
