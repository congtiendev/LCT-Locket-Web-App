#!/bin/sh

echo "🚀 Starting LCT Locket Web App..."

# Run database migrations
echo "📦 Running database migrations..."
node scripts/emergency-fix.js

# Seed database if needed (optional)
echo "🌱 Seeding database..."
npm run seed 2>/dev/null || echo "⚠️  Seeding skipped or failed (not critical)"

# Start the application
echo "✅ Starting the server..."
exec npm start