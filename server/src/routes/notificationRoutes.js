const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.listNotifications);
router.put('/:id/read', notificationController.markRead);

module.exports = router;
