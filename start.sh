#!/bin/sh

echo "🚀 Starting LCT Locket Web App..."

# Ensure Prisma Client is generated with latest schema
echo "🔄 Generating Prisma Client..."
npx prisma generate

# Run database migrations and schema deployment
echo "📦 Running database migrations..."
node scripts/inspect-enums.js 2>/dev/null || echo "⚠️ Enum inspection skipped"
node scripts/emergency-fix.js
node scripts/deploy-schema.js 2>/dev/null || echo "⚠️ Deploy schema skipped"

# Seed database if needed (optional)
echo "🌱 Seeding database..."
npm run seed 2>/dev/null || echo "⚠️ Seeding skipped or failed (not critical)"

# Start the application
echo "✅ Starting the server..."
exec npm start