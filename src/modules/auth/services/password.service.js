const { PrismaClient } = require('@prisma/client');
const AppException = require('@exceptions/app.exception');
const { hashPassword, comparePassword } = require('@utils/crypto');
const tokenService = require('./token.service');

const prisma = new PrismaClient();

class PasswordService {
  async sendResetPasswordEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = tokenService.generatePasswordResetToken(user.id);

    // TODO: Send email with reset link
    // For now, just log the token
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return resetToken;
  }

  async resetPassword(token, newPassword) {
    const decoded = tokenService.verifyToken(token);

    if (decoded.type !== 'PASSWORD_RESET') {
      throw new AppException('Invalid token type', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppException('User not found', 404);
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new AppException('Current password is incorrect', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

module.exports = new PasswordService();
