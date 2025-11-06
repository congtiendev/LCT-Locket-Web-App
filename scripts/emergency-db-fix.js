#!/usr/bin/env node
/**
 * Emergency Database Fix Script
 * This will run during app startup to ensure database has required columns
 */

const { PrismaClient } = require('@prisma/client');

async function emergencyDatabaseFix() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚨 EMERGENCY DATABASE FIX - Checking and adding missing columns...');
    
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get current columns
    const result = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
    `;
    
    const existingColumns = result.map(row => row.column_name);
    console.log('📋 Current columns:', existingColumns.sort().join(', '));
    
    const requiredColumns = [
      { name: 'google_id', sql: 'ALTER TABLE "users" ADD COLUMN "google_id" TEXT' },
      { name: 'username', sql: 'ALTER TABLE "users" ADD COLUMN "username" TEXT' },
      { name: 'bio', sql: 'ALTER TABLE "users" ADD COLUMN "bio" TEXT' },
      { name: 'last_login_at', sql: 'ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP(3)' }
    ];
    
    let columnsAdded = 0;
    
    for (const column of requiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`➕ Adding missing column: ${column.name}`);
        try {
          await prisma.$executeRawUnsafe(column.sql);
          console.log(`✅ Successfully added column: ${column.name}`);
          columnsAdded++;
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`✅ Column ${column.name} already exists (race condition)`);
          } else {
            console.error(`❌ Failed to add column ${column.name}:`, error.message);
            throw error;
          }
        }
      } else {
        console.log(`✅ Column ${column.name} already exists`);
      }
    }
    
    // Add unique constraints if columns were added
    if (columnsAdded > 0 || !existingColumns.includes('google_id')) {
      try {
        await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_key" ON "users"("google_id")`;
        console.log('✅ Added google_id unique constraint');
      } catch (error) {
        console.log('⚠️ Google ID constraint may already exist:', error.message);
      }
      
      try {
        await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username")`;
        console.log('✅ Added username unique constraint');
      } catch (error) {
        console.log('⚠️ Username constraint may already exist:', error.message);
      }
    }
    
    console.log(`🎉 Database fix completed! Added ${columnsAdded} columns.`);
    
  } catch (error) {
    console.error('❌ Emergency database fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { emergencyDatabaseFix };

// Run if called directly
if (require.main === module) {
  emergencyDatabaseFix()
    .then(() => {
      console.log('Emergency fix completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Emergency fix failed:', error);
      process.exit(1);
    });
}