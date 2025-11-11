#!/usr/bin/env node
/**
 * Database Structure Checker
 * This script will check the current structure of the users table
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Checking database structure...');

    // Check if we can connect to database
    await prisma.$connect();
    console.log('✅ Connected to database successfully');

    // Query to get table structure
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;

    console.log('\n📋 Current users table structure:');
    console.log('Column Name | Data Type | Nullable | Default');
    console.log('------------|-----------|----------|--------');

    tableInfo.forEach((column) => {
      console.log(
        `${column.column_name.padEnd(11)} | ${column.data_type.padEnd(9)} | ${column.is_nullable.padEnd(8)} | ${column.column_default || 'NULL'}`
      );
    });

    // Check for specific columns we need
    const columnNames = tableInfo.map((col) => col.column_name);
    const requiredColumns = ['google_id', 'username', 'bio', 'last_login_at'];

    console.log('\n🔍 Checking required columns:');
    requiredColumns.forEach((col) => {
      const exists = columnNames.includes(col);
      console.log(`${col}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });

    // Check indexes
    const indexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'users';
    `;

    console.log('\n📊 Indexes on users table:');
    indexes.forEach((index) => {
      console.log(`- ${index.indexname}`);
    });
  } catch (error) {
    console.error('❌ Error checking database:', error.message);

    if (error.code === 'P2022') {
      console.log('\n💡 This confirms the column does not exist in the database.');
      console.log('We need to run the migration to add missing columns.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  checkDatabaseStructure()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseStructure };
