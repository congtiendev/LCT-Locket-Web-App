const photoRepository = require('../repositories/photo.repository');
const reactionRepository = require('../repositories/reaction.repository');
const storageService = require('@core/storage/storage.service');
const AppException = require('@exceptions/app.exception');
const logger = require('@utils/logger');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

/**
 * Photo Service
 * Business logic for photo management
 */
class PhotoService {
  /**
   * Upload new photo
   */
  async uploadPhoto(userId, file, caption = null) {
    try {
      if (!file) {
        throw new AppException('No file uploaded', 400);
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        // Delete uploaded file
        await fs.unlink(file.path).catch(() => {});
        throw new AppException('Invalid file format. Only JPEG, PNG, and WebP are allowed', 400);
      }

      // Get image metadata
      const metadata = await sharp(file.path).metadata();

      // Resize if too large (max 2048px)
      let imageBuffer;
      if (metadata.width > 2048 || metadata.height > 2048) {
        imageBuffer = await sharp(file.path)
          .resize(2048, 2048, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 90 })
          .toBuffer();
      } else {
        imageBuffer = await fs.readFile(file.path);
      }

      // Upload to storage
      const fileName = `${Date.now()}-${file.originalname}`;
      const imageUrl = await storageService.store(imageBuffer, `photos/${fileName}`, file.mimetype);

      // Generate thumbnail (400px width)
      const thumbnailBuffer = await sharp(file.path)
        .resize(400, null, {
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailName = `thumb-${fileName}`;
      await storageService.store(thumbnailBuffer, `photos/thumbnails/${thumbnailName}`, file.mimetype);

      // Delete temporary file
      await fs.unlink(file.path).catch(() => {});

      // Save to database
      const photo = await photoRepository.create({
        userId,
        imageUrl,
        caption: caption || null,
        width: metadata.width,
        height: metadata.height,
        fileSize: file.size,
        mimeType: file.mimetype,
        isPublic: true,
      });

      logger.info(`Photo uploaded successfully: ${photo.id} by user ${userId}`);

      return this.formatPhotoResponse(photo, userId);
    } catch (error) {
      logger.error('Photo upload error:', error);
      throw error;
    }
  }

  /**
   * Get photo by ID
   */
  async getPhotoById(photoId, currentUserId) {
    const photo = await photoRepository.findById(photoId);

    if (!photo) {
      throw new AppException('Photo not found', 404);
    }

    // Check permission: owner or friend
    if (photo.userId !== currentUserId) {
      const areFriends = await photoRepository.areFriends(currentUserId, photo.userId);
      if (!areFriends) {
        throw new AppException('You do not have permission to view this photo', 403);
      }
    }

    return this.formatPhotoResponse(photo, currentUserId);
  }

  /**
   * Get user's own photos
   */
  async getMyPhotos(userId, { limit = 20, offset = 0, order = 'desc' }) {
    const photos = await photoRepository.findByUserId(userId, { limit, offset, order });
    const total = await photoRepository.countByUserId(userId);

    return {
      photos: photos.map((p) => this.formatPhotoResponse(p, userId)),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    };
  }

  /**
   * Get feed (friends' photos)
   */
  async getFeed(userId, { limit = 20, offset = 0, order = 'desc', friendId = null }) {
    const photos = await photoRepository.findFeedPhotos(userId, { limit, offset, order, friendId });
    const total = await photoRepository.countFeedPhotos(userId, friendId);

    return {
      photos: photos.map((p) => this.formatPhotoResponse(p, userId)),
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    };
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId, userId) {
    const photo = await photoRepository.findById(photoId, false, false);

    if (!photo) {
      throw new AppException('Photo not found', 404);
    }

    // Check ownership
    if (photo.userId !== userId) {
      throw new AppException('You can only delete your own photos', 403);
    }

    // Delete from storage
    try {
      await storageService.delete(photo.imageUrl);
    } catch (error) {
      logger.warn('Failed to delete photo from storage:', error);
    }

    // Delete from database
    await photoRepository.delete(photoId);

    logger.info(`Photo deleted: ${photoId} by user ${userId}`);

    return { message: 'Photo deleted successfully' };
  }

  /**
   * Format photo response with reactions
   */
  formatPhotoResponse(photo, currentUserId) {
    const reactionsSummary = {};
    let myReaction = null;
    let reactionsCount = 0;

    if (photo.reactions && photo.reactions.length > 0) {
      photo.reactions.forEach((reaction) => {
        // Count reactions by emoji
        reactionsSummary[reaction.emoji] = (reactionsSummary[reaction.emoji] || 0) + 1;
        reactionsCount++;

        // Find current user's reaction
        if (reaction.userId === currentUserId) {
          myReaction = reaction.emoji;
        }
      });
    }

    return {
      id: photo.id,
      user_id: photo.userId,
      image_url: photo.imageUrl,
      caption: photo.caption,
      width: photo.width,
      height: photo.height,
      file_size: photo.fileSize,
      mime_type: photo.mimeType,
      is_public: photo.isPublic,
      created_at: photo.createdAt,
      updated_at: photo.updatedAt,
      expires_at: photo.expiresAt,
      user: photo.user
        ? {
            id: photo.user.id,
            email: photo.user.email,
            name: photo.user.name,
            username: photo.user.username,
            avatar: photo.user.avatar,
            bio: photo.user.bio,
          }
        : null,
      reactions: reactionsSummary,
      my_reaction: myReaction,
      reactions_count: reactionsCount,
    };
  }
}

module.exports = new PhotoService();
