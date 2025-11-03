const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class TokenRepository {
  async create(data) {
    return prisma.token.create({
      data,
    });
  }

  async findByToken(token) {
    return prisma.token.findUnique({
      where: { token },
    });
  }

  async revoke(tokenId) {
    return prisma.token.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  async deleteExpired() {
    return prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async revokeAllUserTokens(userId) {
    return prisma.token.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}

module.exports = new TokenRepository();
