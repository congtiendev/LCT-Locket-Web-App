const { authenticate, authorize } = require('@middlewares/authenticate.middleware');
const authRoutes = require('./routes/auth.routes');

module.exports = {
  authRoutes,
  authenticate,
  authorize,
};
