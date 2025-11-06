const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class TokenRepository {
  async create(data) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findByToken(token) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async revoke(tokenId) {
    return prisma.refreshToken.update({
      where: { id: tokenId },
      data: { 
        isRevoked: true,
        revokedAt: new Date()
      },
    });
  }

  async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async revokeAllUserTokens(userId) {
    return prisma.refreshToken.updateMany({
      where: { userId },
      data: { 
        isRevoked: true,
        revokedAt: new Date()
      },
    });
  }
}

module.exports = new TokenRepository();
