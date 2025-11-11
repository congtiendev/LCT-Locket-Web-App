#!/usr/bin/env node
/**
 * Simple Migration Script for Production
 * Directly executes SQL to add missing columns
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingColumns() {
  try {
    console.log('🔄 Starting migration to add missing columns...');

    await prisma.$connect();
    console.log('✅ Connected to database');

    // Check current structure first
    console.log('🔍 Checking current table structure...');

    const existingColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;

    const columnNames = existingColumns.map((row) => row.column_name);
    console.log('📋 Existing columns:', columnNames.join(', '));

    // Add google_id column if missing
    if (!columnNames.includes('google_id')) {
      console.log('➕ Adding google_id column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "google_id" TEXT`;
      await prisma.$executeRaw`CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id")`;
      console.log('✅ Added google_id column');
    } else {
      console.log('✅ google_id column already exists');
    }

    // Add username column if missing
    if (!columnNames.includes('username')) {
      console.log('➕ Adding username column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "username" TEXT`;
      await prisma.$executeRaw`CREATE UNIQUE INDEX "users_username_key" ON "users"("username")`;
      console.log('✅ Added username column');
    } else {
      console.log('✅ username column already exists');
    }

    // Add bio column if missing
    if (!columnNames.includes('bio')) {
      console.log('➕ Adding bio column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "bio" TEXT`;
      console.log('✅ Added bio column');
    } else {
      console.log('✅ bio column already exists');
    }

    // Add last_login_at column if missing
    if (!columnNames.includes('last_login_at')) {
      console.log('➕ Adding last_login_at column...');
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP(3)`;
      console.log('✅ Added last_login_at column');
    } else {
      console.log('✅ last_login_at column already exists');
    }

    // Generate Prisma Client
    console.log('🔄 Generating Prisma Client...');
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma Client generated');
    } catch (generateError) {
      console.warn('⚠️ Prisma Client generation had issues, but continuing...');
      console.warn('Error:', generateError.message);
    }

    console.log('🎉 Migration completed successfully!');
    console.log(
      '💡 Note: If this is running on Render, the service should restart to pick up the new database schema.'
    );
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
addMissingColumns();
