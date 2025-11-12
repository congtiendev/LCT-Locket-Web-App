const storageConfig = require('@config/storage.config');
const localStorage = require('./local.storage');
const s3Storage = require('./s3.storage');
const path = require('path');

/**
 * Storage Service
 * Provides unified interface for file storage operations
 * Supports: local, AWS S3
 */
class StorageService {
  constructor() {
    this.driver = this.getDriver();
  }

  /**
   * Get storage driver based on configuration
   */
  getDriver() {
    const driver = storageConfig.driver || 'local';

    switch (driver) {
      case 's3':
        return s3Storage;
      case 'local':
      default:
        return localStorage;
    }
  }

  /**
   * Store file (Buffer or file path)
   * @param {Buffer|string} fileData - File buffer or file path
   * @param {string} filePath - Destination path
   * @param {string} mimeType - File MIME type
   * @returns {Promise<string>} - URL or path to stored file
   */
  async store(fileData, filePath, mimeType = 'application/octet-stream') {
    let buffer = fileData;

    // If fileData is a file path, read it
    if (typeof fileData === 'string') {
      const fs = require('fs').promises;
      buffer = await fs.readFile(fileData);
    }

    // Upload using driver
    const relativePath = await this.driver.upload({ buffer }, filePath);

    // Return full URL for S3, or full URL with base for local
    if (storageConfig.driver === 's3') {
      return `https://${storageConfig.aws.bucket}.s3.${storageConfig.aws.region}.amazonaws.com/${relativePath}`;
    }

    // For local storage, return full URL with base
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${relativePath}`;
  }

  /**
   * Delete file
   * @param {string} filePathOrUrl - File path or URL
   */
  async delete(filePathOrUrl) {
    // Extract relative path from URL if needed
    let filePath = filePathOrUrl;

    if (filePathOrUrl.startsWith('http')) {
      // Extract path from URL
      const url = new URL(filePathOrUrl);
      filePath = url.pathname.replace('/uploads/', '');
    } else if (filePathOrUrl.startsWith('/uploads/')) {
      filePath = filePathOrUrl.replace('/uploads/', '');
    }

    await this.driver.delete(filePath);
  }

  /**
   * Check if file exists
   * @param {string} filePath - File path
   * @returns {Promise<boolean>}
   */
  async exists(filePath) {
    return await this.driver.exists(filePath);
  }

  /**
   * Get file
   * @param {string} filePath - File path
   * @returns {Promise<Buffer>}
   */
  async get(filePath) {
    return await this.driver.get(filePath);
  }
}

module.exports = new StorageService();
