#!/usr/bin/env node
/**
 * Database Enum Inspector
 * Check what enum values exist in production database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function inspectEnums() {
  try {
    console.log('🔍 Inspecting database enums...');

    await prisma.$connect();
    console.log('✅ Connected to database');

    // Get enum types and their values
    const enumInfo = await prisma.$queryRaw`
      SELECT 
        t.typname as enum_name,
        e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname IN ('AuthProvider', 'FriendRequestStatus', 'NotificationType')
      ORDER BY t.typname, e.enumsortorder
    `;

    console.log('\n📋 Database enum values:');
    let currentEnum = '';
    enumInfo.forEach((row) => {
      if (row.enum_name !== currentEnum) {
        currentEnum = row.enum_name;
        console.log(`\n${currentEnum}:`);
      }
      console.log(`  - ${row.enum_value}`);
    });

    // Check current provider values in users table
    console.log('\n👥 Current provider values in users table:');
    const providerValues = await prisma.$queryRaw`
      SELECT provider, COUNT(*) as count 
      FROM "users" 
      GROUP BY provider 
      ORDER BY count DESC
    `;

    providerValues.forEach((row) => {
      console.log(`  - ${row.provider}: ${row.count} users`);
    });

    console.log('\n🎯 Analysis complete!');
  } catch (error) {
    console.error('❌ Inspection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

inspectEnums();
