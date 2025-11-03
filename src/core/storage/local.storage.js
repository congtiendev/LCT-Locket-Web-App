const fs = require('fs').promises;
const path = require('path');
const StorageInterface = require('./storage.interface');

class LocalStorage extends StorageInterface {
  constructor() {
    super();
    this.basePath = process.env.UPLOAD_PATH || './uploads';
  }

  async upload(file, filePath) {
    const fullPath = path.join(this.basePath, filePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    return filePath;
  }

  async delete(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    await fs.unlink(fullPath);
  }

  async get(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    return fs.readFile(fullPath);
  }

  async exists(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new LocalStorage();
