const { PrismaClient } = require('@prisma/client');

class BaseRepository {
  constructor(model) {
    this.prisma = new PrismaClient();
    this.model = this.prisma[model];
  }

  async create(data) {
    return this.model.create({ data });
  }

  async findById(id) {
    return this.model.findUnique({ where: { id } });
  }

  async findMany(options = {}) {
    return this.model.findMany(options);
  }

  async update(id, data) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}

module.exports = BaseRepository;
