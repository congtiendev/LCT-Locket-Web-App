const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🔄 Starting chat system migration...');

    // Create chat_threads table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "chat_threads" (
        "id" TEXT PRIMARY KEY,
        "post_id" TEXT NOT NULL,
        "user1_id" TEXT NOT NULL,
        "user2_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "chat_threads_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "chat_threads_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "chat_threads_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    console.log('✅ chat_threads table created');

    // Create unique constraint
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "chat_threads_post_id_user1_id_user2_id_key" ON "chat_threads"("post_id", "user1_id", "user2_id");
    `;
    console.log('✅ Unique constraint added');

    // Create indexes for chat_threads
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_threads_post_id_idx" ON "chat_threads"("post_id");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_threads_user1_id_idx" ON "chat_threads"("user1_id");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_threads_user2_id_idx" ON "chat_threads"("user2_id");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_threads_updated_at_idx" ON "chat_threads"("updated_at");`;
    console.log('✅ chat_threads indexes created');

    // Create chat_messages table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" TEXT PRIMARY KEY,
        "thread_id" TEXT NOT NULL,
        "post_id" TEXT NOT NULL,
        "sender_id" TEXT NOT NULL,
        "receiver_id" TEXT NOT NULL,
        "message" TEXT,
        "photo_url" TEXT,
        "is_read" BOOLEAN NOT NULL DEFAULT false,
        "read_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "chat_messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "chat_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "chat_messages_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "chat_messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    console.log('✅ chat_messages table created');

    // Create indexes for chat_messages
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_messages_thread_id_idx" ON "chat_messages"("thread_id");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_messages_sender_id_idx" ON "chat_messages"("sender_id");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_messages_receiver_id_idx" ON "chat_messages"("receiver_id");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "chat_messages_created_at_idx" ON "chat_messages"("created_at");`;
    console.log('✅ chat_messages indexes created');

    console.log('✅ Chat system migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('🎉 Migration finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration error:', error);
    process.exit(1);
  });
