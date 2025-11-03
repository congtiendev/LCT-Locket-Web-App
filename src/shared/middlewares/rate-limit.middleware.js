const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) =>
  rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });

const authLimiter = createRateLimiter(15 * 60 * 1000, 5);
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
};
