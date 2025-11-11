#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

/**
 * Force Migration Script for Production
 * This script will run a specific migration SQL file directly on the database
 * Use this when prisma migrate deploy doesn't work or when you need to run custom SQL
 */

console.log('🔄 Starting production migration for missing columns...');

try {
  // Check if we're in production
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('postgres://');

  if (isProduction) {
    console.log('📦 Production environment detected');

    // Run the custom migration SQL
    const migrationPath = path.join(
      __dirname,
      '../prisma/migrations/20250106100000_add_missing_columns/migration.sql'
    );

    console.log('🗄️  Applying custom migration...');

    // Use psql if available, otherwise use prisma db execute
    try {
      execSync(`psql "${process.env.DATABASE_URL}" -f "${migrationPath}"`, {
        stdio: 'inherit',
        timeout: 30000,
      });
      console.log('✅ Custom migration applied successfully!');
    } catch (error) {
      // Fallback to prisma db execute
      console.log('⚠️  psql not available, using prisma db execute...');
      execSync(`npx prisma db execute --file "${migrationPath}" --schema prisma/schema.prisma`, {
        stdio: 'inherit',
        timeout: 30000,
      });
      console.log('✅ Migration applied via Prisma!');
    }
  } else {
    console.log('🏠 Development environment - running standard migration');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });
  }

  // Generate Prisma client
  console.log('🔄 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated!');

  console.log('🎉 Migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
