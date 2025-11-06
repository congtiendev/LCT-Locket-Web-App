const { PrismaClient } = require('@prisma/client');
const AppException = require('@exceptions/app.exception');
const { hashPassword, comparePassword } = require('@utils/crypto');
const tokenService = require('./token.service');

const prisma = new PrismaClient();

class AuthService {
  async register(data) {
    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppException('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user);

    return {
      user,
      tokens,
    };
  }

  async login(data) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        avatar: true,
        provider: true,
        googleId: true,
      },
    });

    if (!user) {
      throw new AppException('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppException('Invalid email or password', 401);
    }

    // NOTE: The schema used by Prisma in this project does not include a `status` column.
    // If you have an account status concept, add it to the Prisma schema and migrate the DB.

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user);

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        username: true,
        provider: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new AppException('User not found', 404);
    }

    return user;
  }

  async verifyEmail(token) {
    await tokenService.verifyToken(token, 'EMAIL_VERIFICATION');

    // The project schema currently does not include `emailVerified`. If you want to
    // track email verification, add `emailVerified` to the Prisma `User` model and run a migration.
    // For now, just revoke the verification token.
    await tokenService.revokeToken(token);
  }
}

module.exports = new AuthService();
