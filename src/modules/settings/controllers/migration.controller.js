const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Migration Controller
 * Manual migration endpoint for adding settings columns
 */
class MigrationController {
  /**
   * Run settings migration
   * POST /api/migrate/settings
   */
  async migrateSettings(req, res, next) {
    try {
      console.log('🚀 Starting settings migration...');

      // Check if columns already exist
      try {
        await prisma.$queryRaw`
          SELECT notifications_enabled FROM user_settings LIMIT 1
        `;
        return res.json({
          success: true,
          message: 'Migration already completed - columns exist',
          alreadyMigrated: true,
        });
      } catch (error) {
        // Columns don't exist, continue
        console.log('Columns do not exist, proceeding with migration...');
      }

      // Add new columns
      await prisma.$executeRaw`
        ALTER TABLE user_settings
        ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS auto_save_photos BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS photo_quality VARCHAR(20) DEFAULT 'high',
        ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'system',
        ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'vi',
        ADD COLUMN IF NOT EXISTS allow_photos_from VARCHAR(30) DEFAULT 'friends_only',
        ADD COLUMN IF NOT EXISTS hide_from_suggestions BOOLEAN DEFAULT false
      `;

      console.log('✅ Columns added successfully');

      // Update existing rows
      const result = await prisma.$executeRaw`
        UPDATE user_settings
        SET
          notifications_enabled = COALESCE(notifications_enabled, true),
          sound_enabled = COALESCE(sound_enabled, true),
          auto_save_photos = COALESCE(auto_save_photos, false),
          photo_quality = COALESCE(photo_quality, 'high'),
          theme = COALESCE(theme, 'system'),
          language = COALESCE(language, 'vi'),
          allow_photos_from = COALESCE(allow_photos_from, 'friends_only'),
          hide_from_suggestions = COALESCE(hide_from_suggestions, false)
      `;

      console.log(`✅ Updated ${result} existing rows`);

      const count = await prisma.userSettings.count();

      res.json({
        success: true,
        message: 'Settings migration completed successfully',
        rowsUpdated: result,
        totalRows: count,
      });
    } catch (error) {
      console.error('❌ Migration failed:', error);
      next(error);
    }
  }
}

module.exports = new MigrationController();
