#!/bin/sh

echo "🚀 Starting LCT Locket Web App..."

# Ensure Prisma Client is generated with latest schema
echo "🔄 Generating Prisma Client..."
npx prisma generate || { echo "❌ Prisma generate failed"; exit 1; }

# Run database migrations to create tables
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy || { echo "❌ Migration failed"; exit 1; }

# Start the application
echo "✅ Starting the server..."
exec npm start