const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const AppException = require('@exceptions/app.exception');

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppException('Access token is required', 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppException('User not found', 401);
    }

    if (user.status !== 'ACTIVE') {
      throw new AppException('Account is not active', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppException('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppException('Token expired', 401));
    } else {
      next(error);
    }
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new AppException('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppException('Insufficient permissions', 403));
    }

    next();
  };

module.exports = {
  authenticate,
  authorize,
};
