const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateNotifications() {
  console.log('Starting notification migration...');

  try {
    // Get all existing notifications
    const notifications = await prisma.$queryRaw`
      SELECT * FROM notifications WHERE type = 'reaction'
    `;

    console.log(`Found ${notifications.length} notifications with type 'reaction'`);

    // Update type from 'reaction' to 'photo_reaction'
    if (notifications.length > 0) {
      await prisma.$executeRaw`
        UPDATE notifications
        SET type = 'photo_reaction'
        WHERE type = 'reaction'
      `;
      console.log(`✅ Updated ${notifications.length} notifications to 'photo_reaction'`);
    }

    // Migrate action_data to data field if needed
    const withActionData = await prisma.$queryRaw`
      SELECT id, action_data FROM notifications WHERE action_data IS NOT NULL
    `;

    console.log(`Found ${withActionData.length} notifications with action_data`);

    for (const notif of withActionData) {
      await prisma.$executeRaw`
        UPDATE notifications
        SET data = action_data
        WHERE id = ${notif.id}
      `;
    }

    console.log('✅ Migration completed successfully!');
    console.log('Now you can run: npx prisma db push --accept-data-loss');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateNotifications();
