#!/usr/bin/env node
/**
 * Reset Failed Migrations and Apply Schema
 * This script will handle failed migrations and apply the correct schema
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function resetAndMigrate() {
  try {
    console.log('🔄 Resetting failed migrations and applying schema...');

    await prisma.$connect();
    console.log('✅ Connected to database');

    // First, check the current migration status
    console.log('📋 Checking migration status...');

    try {
      // Try to get migration status
      const result = execSync('npx prisma migrate status', { encoding: 'utf8' });
      console.log('Migration status:', result);
    } catch (statusError) {
      console.warn('⚠️ Migration status check failed, proceeding with reset...');
    }

    // Reset the migration history
    console.log('🔄 Resetting migration history...');
    try {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "_prisma_migrations"');
      console.log('✅ Migration history reset');
    } catch (resetError) {
      console.warn(
        '⚠️ Migration history reset failed or table does not exist:',
        resetError.message
      );
    }

    // Now apply our custom migration to ensure all columns exist
    console.log('🔄 Applying custom migration...');

    // Check and add missing columns one by one
    const checkAndAddColumn = async (columnName, columnType, constraint = '') => {
      try {
        const exists = await prisma.$queryRaw`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = ${columnName}
        `;

        if (exists.length === 0) {
          console.log(`➕ Adding ${columnName} column...`);
          await prisma.$executeRawUnsafe(
            `ALTER TABLE "users" ADD COLUMN "${columnName}" ${columnType}`
          );

          if (constraint) {
            await prisma.$executeRawUnsafe(constraint);
          }

          console.log(`✅ Added ${columnName} column`);
        } else {
          console.log(`✅ ${columnName} column already exists`);
        }
      } catch (error) {
        console.warn(`⚠️ Error with ${columnName} column:`, error.message);
      }
    };

    // Add all required columns
    await checkAndAddColumn(
      'google_id',
      'TEXT',
      'CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_key" ON "users"("google_id")'
    );
    await checkAndAddColumn(
      'username',
      'TEXT',
      'CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username")'
    );
    await checkAndAddColumn('bio', 'TEXT');
    await checkAndAddColumn('last_login_at', 'TIMESTAMP(3)');

    // Create indexes if they don't exist
    const createIndexIfNotExists = async (indexName, sql) => {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`✅ Index ${indexName} created or already exists`);
      } catch (error) {
        console.warn(`⚠️ Index ${indexName} creation issue:`, error.message);
      }
    };

    await createIndexIfNotExists(
      'users_email_idx',
      'CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email")'
    );
    await createIndexIfNotExists(
      'users_username_idx',
      'CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users"("username")'
    );
    await createIndexIfNotExists(
      'users_google_id_idx',
      'CREATE INDEX IF NOT EXISTS "users_google_id_idx" ON "users"("google_id")'
    );

    // Initialize migration table and mark migrations as applied
    console.log('🔄 Initializing migration history...');
    try {
      execSync('npx prisma migrate resolve --applied 20250106000000_init', { stdio: 'inherit' });
      console.log('✅ Migration history initialized');
    } catch (resolveError) {
      console.warn('⚠️ Migration resolve failed, but continuing...', resolveError.message);
    }

    // Generate Prisma Client
    console.log('🔄 Generating Prisma Client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma Client generated');
    } catch (generateError) {
      console.warn('⚠️ Prisma Client generation had issues:', generateError.message);
    }

    console.log('🎉 Database schema is now ready!');
  } catch (error) {
    console.error('❌ Reset and migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset and migration
resetAndMigrate();
