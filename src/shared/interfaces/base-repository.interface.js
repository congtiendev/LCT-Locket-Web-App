class BaseRepositoryInterface {
  async create(_data) {
    throw new Error('Method create() must be implemented');
  }

  async findById(_id) {
    throw new Error('Method findById() must be implemented');
  }

  async findMany(_options) {
    throw new Error('Method findMany() must be implemented');
  }

  async update(_id, _data) {
    throw new Error('Method update() must be implemented');
  }

  async delete(_id) {
    throw new Error('Method delete() must be implemented');
  }
}

module.exports = BaseRepositoryInterface;
