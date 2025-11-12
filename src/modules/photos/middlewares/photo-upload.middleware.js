const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AppException = require('@exceptions/app.exception');

/**
 * Photo Upload Middleware
 * Specific configuration for photo uploads
 */

// Ensure upload directories exist
const uploadDir = 'uploads/photos';
const thumbnailDir = 'uploads/photos/thumbnails';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow image files for photos
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypeAllowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
    file.mimetype
  );

  if (extname && mimetypeAllowed) {
    cb(null, true);
  } else {
    cb(
      new AppException('Invalid file format. Only JPEG, PNG, and WebP images are allowed', 415)
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for photos
  },
  fileFilter,
});

module.exports = upload;
