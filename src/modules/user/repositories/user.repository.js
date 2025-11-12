const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class UserRepository {
  async create(data) {
    return prisma.user.create({
      data,
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany({ where, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          phone: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Search users by name, username, or email
   */
  async searchUsers(query, { limit = 20, offset = 0 }) {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        status: 'ACTIVE', // Only search active users
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        name: 'asc',
      },
    });
  }
}

module.exports = new UserRepository();
