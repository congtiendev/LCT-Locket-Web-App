const fs = require('fs').promises;
const path = require('path');

const ensureDir = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getFileExtension = (filename) => path.extname(filename).toLowerCase();

module.exports = {
  ensureDir,
  deleteFile,
  fileExists,
  getFileExtension,
};
