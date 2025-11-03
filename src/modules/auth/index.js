const authRoutes = require('./routes/auth.routes');
const { authenticate, authorize } = require('./middlewares/auth.middleware');

module.exports = {
  authRoutes,
  authenticate,
  authorize,
};
