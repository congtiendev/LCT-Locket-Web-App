/**
 * Check specific user in production database
 */

const { PrismaClient } = require('@prisma/client');

async function checkUser() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking user: lecongtien.dev@gmail.com\n');

    await prisma.$connect();

    // Check using raw SQL to see exact values
    const rawUser = await prisma.$queryRaw`
      SELECT
        id,
        email,
        provider::text as provider_text,
        google_id,
        created_at
      FROM users
      WHERE email = 'lecongtien.dev@gmail.com'
    `;

    console.log('Raw SQL result:');
    console.log(rawUser);

    // Check all users with any GOOGLE variant
    console.log('\n🔍 Checking for any GOOGLE (uppercase) values:\n');

    const allUsers = await prisma.$queryRaw`
      SELECT
        id,
        email,
        provider::text as provider_text,
        google_id
      FROM users
      WHERE provider::text LIKE '%GOOGLE%'
    `;

    console.log('Users with GOOGLE:', allUsers);

    // List all users
    console.log('\n📋 All users in database:\n');
    const allUsersList = await prisma.$queryRaw`
      SELECT
        id,
        email,
        provider::text as provider_text,
        google_id,
        created_at
      FROM users
      ORDER BY created_at DESC
    `;

    console.table(allUsersList);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUser();
