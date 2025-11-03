const app = require('./app.config');
const database = require('./database.config');
const redis = require('./redis.config');
const mail = require('./mail.config');
const storage = require('./storage.config');

module.exports = {
  app,
  database,
  redis,
  mail,
  storage,
};
