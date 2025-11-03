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
    });

    if (!user) {
      throw new AppException('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppException('Invalid email or password', 401);
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new AppException('Account is not active', 403);
    }

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user);

    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user;

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
        role: true,
        avatar: true,
        phone: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppException('User not found', 404);
    }

    return user;
  }

  async verifyEmail(token) {
    const decoded = await tokenService.verifyToken(token, 'EMAIL_VERIFICATION');

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: true },
    });

    await tokenService.revokeToken(token);
  }
}

module.exports = new AuthService();
