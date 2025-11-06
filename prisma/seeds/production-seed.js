const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const prisma = new PrismaClient();

/**
 * Execute Production Seed Data
 * Loads and runs the production-seed.sql file
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🌱 LOCKET WEB - PRODUCTION SEED DATA');
  console.log('='.repeat(60));
  console.log('\n📦 Loading production seed data...\n');

  // Create PostgreSQL client from DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'production-seed.sql');

    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found: ${sqlFile}`);
    }

    console.log(`📄 Reading SQL file: ${sqlFile}`);
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('🔄 Executing SQL file...\n');

    // Execute the entire SQL file (PostgreSQL client handles multiple statements)
    await client.query(sql);

    console.log('✅ All SQL statements executed successfully!\n');

    // Verify data was inserted
    console.log('📊 Verifying data insertion...\n');

    const userCount = await prisma.user.count();
    const photoCount = await prisma.photo.count();
    const friendshipCount = await prisma.friendship.count();
    const chatCount = await prisma.chat.count();
    const notificationCount = await prisma.notification.count();

    console.log('='.repeat(60));
    console.log('✨ Production seed completed successfully!\n');
    console.log('📊 Database Summary:');
    console.log(`   • Users: ${userCount}`);
    console.log(`   • Photos: ${photoCount}`);
    console.log(`   • Friendships: ${friendshipCount}`);
    console.log(`   • Chat Messages: ${chatCount}`);
    console.log(`   • Notifications: ${notificationCount}`);
    console.log('\n🔐 Test Account:');
    console.log('   Email: congtiendev@gmail.com');
    console.log('   Password: 722003xx');
    console.log('   User ID: 550e8400-e29b-41d4-a716-446655440001');
    console.log('='.repeat(60));
    console.log('\n✅ Ready for testing!\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    console.error('\nDetails:', error);

    // Provide helpful error messages
    if (error.message.includes('already exists') || error.code === '23505') {
      console.log('\n💡 Tip: Data may already exist. To reset the database, run:');
      console.log('   npm run prisma:reset');
    } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Make sure migrations are applied. Run:');
      console.log('   npm run prisma:migrate');
    } else if (error.message.includes('DATABASE_URL')) {
      console.log('\n💡 Tip: Make sure your .env file contains a valid DATABASE_URL');
    }

    await client.end();
    process.exit(1);
  } finally {
    // Cleanup
    await client.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
