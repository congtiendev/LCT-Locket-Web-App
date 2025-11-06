#!/usr/bin/env node

/**
 * Force migration deployment for production
 * Run this via Render shell or locally with production DATABASE_URL
 */

const { execSync } = require('child_process');

console.log('🔄 Starting migration deployment...\n');

try {
  // Run migration deploy
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('\n✅ Migration deployed successfully!');
  console.log('\n🔄 Generating Prisma Client...');

  // Regenerate Prisma Client
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('\n✅ Prisma Client generated!');
  console.log('\n🎉 Database is now up to date!');
  process.exit(0);

} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.error('\nPlease check:');
  console.error('1. DATABASE_URL is set correctly');
  console.error('2. Database is accessible');
  console.error('3. You have necessary permissions');
  process.exit(1);
}
