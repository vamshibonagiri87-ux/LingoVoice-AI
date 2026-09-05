const express = require('express');
const { body } = require('express-validator');
const conversationController = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/:sessionId/message',
  conversationController.postMessage
);

router.post(
  '/:sessionId/messages',
  conversationController.postMessage
);

router.get('/:sessionId', conversationController.getConversation);

module.exports = router;
