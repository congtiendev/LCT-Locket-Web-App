const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');
const friendRequestController = require('../controllers/friend-request.controller');
const {
  validateGetFriendsQuery,
  validateFriendId,
  validateUpdateFriendSettings,
  validateGetFriendRequestsQuery,
  validateSendFriendRequest,
  validateFriendRequestId,
} = require('../validators/friend.validator');
const { authenticate } = require('@middlewares/authenticate.middleware');

/**
 * Friend Routes
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authenticate);

// Friend management routes
router.get('/friends', validateGetFriendsQuery, friendController.getFriends);
router.delete('/friends/:friendId', validateFriendId, friendController.removeFriend);
router.patch(
  '/friends/:friendId',
  validateFriendId,
  validateUpdateFriendSettings,
  friendController.updateFriendSettings
);

// Friend request routes
router.get(
  '/friend-requests',
  validateGetFriendRequestsQuery,
  friendRequestController.getReceivedRequests
);
router.get(
  '/friend-requests/sent',
  validateGetFriendRequestsQuery,
  friendRequestController.getSentRequests
);
router.post('/friend-requests', validateSendFriendRequest, friendRequestController.sendRequest);
router.post(
  '/friend-requests/:id/accept',
  validateFriendRequestId,
  friendRequestController.acceptRequest
);
router.post(
  '/friend-requests/:id/reject',
  validateFriendRequestId,
  friendRequestController.rejectRequest
);
router.delete(
  '/friend-requests/:id',
  validateFriendRequestId,
  friendRequestController.cancelRequest
);

module.exports = router;
