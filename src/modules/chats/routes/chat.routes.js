const express = require('express');
const { authenticate } = require('@middlewares/authenticate.middleware');
const validate = require('@middlewares/validate.middleware');
const upload = require('@middlewares/upload.middleware');
const chatController = require('../controllers/chat.controller');
const {
  createThreadSchema,
  sendMessageSchema,
  getMessagesQuerySchema,
  getThreadsQuerySchema,
  threadIdParamSchema,
} = require('../validators/chat.validator');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Chat photo upload (separate endpoint)
router.post('/upload-photo', upload.single('photo'), chatController.uploadPhoto);

// Thread routes
router.post('/threads', validate(createThreadSchema), chatController.getOrCreateThread);

router.get(
  '/threads',
  validate(getThreadsQuerySchema, 'query'),
  chatController.getThreads
);

router.get(
  '/threads/:threadId/messages',
  validate(threadIdParamSchema, 'params'),
  validate(getMessagesQuerySchema, 'query'),
  chatController.getMessages
);

router.post(
  '/threads/:threadId/messages',
  validate(threadIdParamSchema, 'params'),
  validate(sendMessageSchema),
  chatController.sendMessage
);

router.put(
  '/threads/:threadId/read',
  validate(threadIdParamSchema, 'params'),
  chatController.markAsRead
);

module.exports = router;
