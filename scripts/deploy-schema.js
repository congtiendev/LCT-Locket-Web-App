const { PrismaClient } = require('@prisma/client');

async function generateAndDeploy() {
  console.log('\n🔄 Starting Prisma schema generation and deployment...\n');

  try {
    // Step 1: Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    const { execSync } = require('child_process');

    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log('✅ Prisma Client generated successfully!');

    // Step 2: Test database connection
    console.log('\n🔌 Testing database connection...');
    const prisma = new PrismaClient();

    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Step 3: Check enum values in production
    console.log('\n🔍 Checking production enum values...');

    try {
      const enumCheck = await prisma.$queryRaw`
        SELECT 
          t.typname as enum_name,
          e.enumlabel as enum_value
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname IN ('AuthProvider', 'UserRole', 'UserStatus')
        ORDER BY t.typname, e.enumsortorder;
      `;

      console.log('📋 Production enum values:');
      console.log(JSON.stringify(enumCheck, null, 2));
    } catch (enumError) {
      console.log('⚠️ Could not query enum values:', enumError.message);
    }

    // Step 4: Test user query with new schema
    console.log('\n👤 Testing user query with updated schema...');

    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User count query successful: ${userCount} users found`);

      // Try to find a user with Google provider
      const googleUser = await prisma.user.findFirst({
        where: {
          provider: 'google',
        },
        select: {
          id: true,
          email: true,
          provider: true,
          googleId: true,
          role: true,
          status: true,
        },
      });

      if (googleUser) {
        console.log('✅ Google user found:', JSON.stringify(googleUser, null, 2));
      } else {
        console.log('ℹ️ No Google users found in database');
      }
    } catch (queryError) {
      console.log('❌ User query failed:', queryError.message);

      // If enum error, show the specific issue
      if (queryError.message.includes('invalid input value for enum')) {
        console.log(
          '\n🔧 Detected enum value mismatch. Schema and database enum values do not match.'
        );
        console.log('💡 Suggestion: Check if production database uses different enum values.');
      }
    }

    await prisma.$disconnect();

    console.log('\n🎉 Schema deployment test completed!');
  } catch (error) {
    console.error('\n❌ Schema deployment failed:', error.message);
    console.error('🔍 Full error:', error);

    if (error.message.includes('Unknown argument')) {
      console.log('\n💡 Tip: Make sure all new schema fields have proper types and constraints.');
    }

    process.exit(1);
  }
}

// Run the deployment
if (require.main === module) {
  generateAndDeploy();
}

module.exports = generateAndDeploy;
