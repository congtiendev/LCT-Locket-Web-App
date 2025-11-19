const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugFeed(userId) {
  try {
    console.log('🔍 Debug Feed for user:', userId);
    console.log('='.repeat(50));

    // 1. Check friendships
    console.log('\n📋 Friendships:');
    const friendships = await prisma.friendship.findMany({
      where: { userId },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    console.log(`Found ${friendships.length} friends:`);
    friendships.forEach((f) => {
      console.log(`  - ${f.friend.name} (${f.friend.email})`);
    });

    // 2. Check photos from friends
    const friendIds = friendships.map((f) => f.friendId);
    console.log('\n📸 Photos from friends:');
    const friendPhotos = await prisma.photo.findMany({
      where: {
        userId: { in: friendIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`Found ${friendPhotos.length} photos from friends:`);
    friendPhotos.forEach((p) => {
      console.log(
        `  - Photo by ${p.user.name}: isPublic=${p.isPublic}, created=${p.createdAt}`
      );
    });

    // 3. Check your own photos
    console.log('\n📸 Your photos:');
    const myPhotos = await prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`Found ${myPhotos.length} of your photos:`);
    myPhotos.forEach((p) => {
      console.log(`  - isPublic=${p.isPublic}, created=${p.createdAt}`);
    });

    // 4. Check feed photos (what API would return)
    console.log('\n🎯 Feed photos (userId IN [...friendIds, userId]):');
    const feedPhotos = await prisma.photo.findMany({
      where: {
        userId: { in: [...friendIds, userId] },
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`Found ${feedPhotos.length} photos in feed:`);
    feedPhotos.forEach((p) => {
      console.log(`  - Photo by ${p.user.name}, created=${p.createdAt}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ Debug complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get userId from command line argument
const userId = process.argv[2];

if (!userId) {
  console.error('Usage: node scripts/debug-feed.js <userId>');
  process.exit(1);
}

debugFeed(userId);
