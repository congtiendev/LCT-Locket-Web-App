const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AppException = require('@exceptions/app.exception');
const tokenRepository = require('../repositories/token.repository');

class TokenService {
  generateToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token, secret = process.env.JWT_SECRET) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new AppException('Invalid or expired token', 401);
    }
  }

  async generateAuthTokens(user) {
    const accessToken = this.generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '7d'
    );

    const refreshToken = this.generateToken(
      {
        userId: user.id,
        tokenId: uuidv4(),
      },
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    );

    // Save refresh token to database
    await tokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken) {
    // Verify refresh token
    const decoded = this.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in database and not revoked
    const tokenRecord = await tokenRepository.findByToken(refreshToken);

    if (!tokenRecord || tokenRecord.revoked) {
      throw new AppException('Invalid refresh token', 401);
    }

    // Generate new access token
    const accessToken = this.generateToken(
      {
        userId: decoded.userId,
        tokenId: uuidv4(),
      },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '7d'
    );

    return {
      accessToken,
    };
  }

  async revokeToken(token) {
    const tokenRecord = await tokenRepository.findByToken(token);

    if (tokenRecord) {
      await tokenRepository.revoke(tokenRecord.id);
    }
  }

  generateEmailVerificationToken(userId) {
    return this.generateToken(
      {
        userId,
        type: 'EMAIL_VERIFICATION',
      },
      process.env.JWT_SECRET,
      '24h'
    );
  }

  generatePasswordResetToken(userId) {
    return this.generateToken(
      {
        userId,
        type: 'PASSWORD_RESET',
      },
      process.env.JWT_SECRET,
      '1h'
    );
  }
}

module.exports = new TokenService();
