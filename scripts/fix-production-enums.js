/**
 * Fix enum values in production database
 * Converts UPPERCASE enum values to lowercase to match Prisma schema
 */

const { PrismaClient } = require('@prisma/client');

async function fixEnumValues() {
  console.log('\n🔧 Starting enum value fix for production database...\n');

  const prisma = new PrismaClient();

  try {
    // Step 1: Connect to database
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected successfully!\n');

    // Step 2: Check current enum values
    console.log('🔍 Checking current AuthProvider enum values...');
    const currentEnums = await prisma.$queryRaw`
      SELECT enumlabel as value
      FROM pg_enum
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'AuthProvider')
      ORDER BY enumsortorder;
    `;
    console.log('Current enum values:', currentEnums);

    // Step 3: Check users with problematic enum values
    console.log('\n📊 Checking users with provider values...');
    const providerStats = await prisma.$queryRaw`
      SELECT
        provider::text as provider_value,
        COUNT(*) as count
      FROM users
      GROUP BY provider::text
      ORDER BY provider_value;
    `;
    console.log('Provider distribution:', providerStats);

    // Step 4: Fix users with GOOGLE (uppercase) to google (lowercase)
    console.log('\n🔄 Updating users with GOOGLE provider to google...');

    try {
      // Update using raw SQL to bypass Prisma enum validation
      const updateResult = await prisma.$executeRaw`
        UPDATE users
        SET provider = 'google'::"AuthProvider"
        WHERE provider::text = 'GOOGLE';
      `;
      console.log(`✅ Updated ${updateResult} user(s) successfully!`);
    } catch (updateError) {
      console.log('⚠️ Update attempt:', updateError.message);

      // If GOOGLE doesn't exist in enum, it means database is correct
      // but some user records might have wrong values stored
      if (updateError.message.includes('invalid input value')) {
        console.log('\n💡 The enum seems correct. Let\'s verify user records...');

        // Try to find any users that might cause issues
        const allUsers = await prisma.$queryRaw`
          SELECT id, email, provider::text as provider_text
          FROM users
          LIMIT 10;
        `;
        console.log('Sample users:', allUsers);
      }
    }

    // Step 5: Verify the fix
    console.log('\n✅ Verification - Provider distribution after fix:');
    const finalStats = await prisma.$queryRaw`
      SELECT
        provider::text as provider_value,
        COUNT(*) as count
      FROM users
      GROUP BY provider::text
      ORDER BY provider_value;
    `;
    console.log(finalStats);

    // Step 6: Test with Prisma client
    console.log('\n🧪 Testing Prisma query with google provider...');
    try {
      const googleUser = await prisma.user.findFirst({
        where: { provider: 'google' },
        select: {
          id: true,
          email: true,
          provider: true,
          googleId: true,
        },
      });

      if (googleUser) {
        console.log('✅ Successfully queried Google user:', googleUser);
      } else {
        console.log('ℹ️ No Google users found');
      }
    } catch (testError) {
      console.log('❌ Prisma query still failing:', testError.message);
    }

    await prisma.$disconnect();
    console.log('\n🎉 Enum fix process completed!\n');
  } catch (error) {
    console.error('\n❌ Enum fix failed:', error.message);
    console.error('🔍 Full error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the fix
if (require.main === module) {
  fixEnumValues();
}

module.exports = fixEnumValues;
