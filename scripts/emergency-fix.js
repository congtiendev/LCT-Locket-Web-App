#!/usr/bin/env node
/**
 * Emergency Database Fix
 * Simple script to add missing columns with basic error handling
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function emergencyFix() {
  try {
    console.log('🚨 Emergency database fix starting...');
    
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // List all current columns
    console.log('📋 Checking current table structure...');
    const currentColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    console.log('Current columns:');
    currentColumns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    const columnNames = currentColumns.map(col => col.column_name);
    
    // Add missing columns with direct SQL
    const requiredColumns = [
      { name: 'google_id', type: 'TEXT', constraint: 'ADD CONSTRAINT "users_google_id_key" UNIQUE ("google_id")' },
      { name: 'username', type: 'TEXT', constraint: 'ADD CONSTRAINT "users_username_key" UNIQUE ("username")' },
      { name: 'bio', type: 'TEXT', constraint: null },
      { name: 'last_login_at', type: 'TIMESTAMP(3)', constraint: null }
    ];
    
    for (const col of requiredColumns) {
      if (!columnNames.includes(col.name)) {
        console.log(`➕ Adding ${col.name} column...`);
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN "${col.name}" ${col.type}`);
          console.log(`✅ Added ${col.name} column`);
          
          if (col.constraint) {
            try {
              await prisma.$executeRawUnsafe(`ALTER TABLE "users" ${col.constraint}`);
              console.log(`✅ Added constraint for ${col.name}`);
            } catch (constraintError) {
              console.warn(`⚠️ Constraint for ${col.name} may already exist:`, constraintError.message);
            }
          }
        } catch (addError) {
          console.warn(`⚠️ Column ${col.name} may already exist:`, addError.message);
        }
      } else {
        console.log(`✅ ${col.name} column already exists`);
      }
    }
    
    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email")',
      'CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users"("username")',  
      'CREATE INDEX IF NOT EXISTS "users_google_id_idx" ON "users"("google_id")'
    ];
    
    for (const indexSql of indexes) {
      try {
        await prisma.$executeRawUnsafe(indexSql);
        console.log('✅ Index created or already exists');
      } catch (indexError) {
        console.warn('⚠️ Index creation issue (may already exist):', indexError.message);
      }
    }
    
    // Generate Prisma Client
    console.log('🔄 Generating Prisma Client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma Client generated');
    } catch (generateError) {
      console.warn('⚠️ Prisma generate issue:', generateError.message);
    }
    
    console.log('🎉 Emergency fix completed!');
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error.message);
    // Don't exit with error to allow server to start
  } finally {
    await prisma.$disconnect();
  }
}

emergencyFix();