const logger = require('@utils/logger');
const { errorResponse } = require('@utils/response');
const AppException = require('@exceptions/app.exception');

const errorHandler = (err, req, res, _next) => {
  logger.error(err.message, { error: err.stack, url: req.originalUrl, method: req.method });

  if (err instanceof AppException) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation error', 400, err.details);
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return errorResponse(res, 'Duplicate entry', 400);
    }
    if (err.code === 'P2025') {
      return errorResponse(res, 'Record not found', 404);
    }
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  return errorResponse(res, 'Internal server error', 500);
};

const notFoundHandler = (req, res) => errorResponse(res, `Route ${req.originalUrl} not found`, 404);

module.exports = {
  errorHandler,
  notFoundHandler,
};
