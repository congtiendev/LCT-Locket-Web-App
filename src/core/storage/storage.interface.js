class StorageInterface {
  async upload(_file, _path) {
    throw new Error('Method upload() must be implemented');
  }

  async delete(_path) {
    throw new Error('Method delete() must be implemented');
  }

  async get(_path) {
    throw new Error('Method get() must be implemented');
  }

  async exists(_path) {
    throw new Error('Method exists() must be implemented');
  }
}

module.exports = StorageInterface;
