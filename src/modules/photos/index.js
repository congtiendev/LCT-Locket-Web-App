/**
 * Photos Module
 * Export all photo-related components
 */

const photoRoutes = require('./routes/photo.routes');
const photoController = require('./controllers/photo.controller');
const reactionController = require('./controllers/reaction.controller');
const photoService = require('./services/photo.service');
const reactionService = require('./services/reaction.service');
const photoRepository = require('./repositories/photo.repository');
const reactionRepository = require('./repositories/reaction.repository');

module.exports = {
  photoRoutes,
  photoController,
  reactionController,
  photoService,
  reactionService,
  photoRepository,
  reactionRepository,
};
