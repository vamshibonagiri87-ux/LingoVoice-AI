const express = require('express');
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', progressController.getProgress);
router.get('/history', progressController.getHistory);
router.get('/insights', progressController.getInsights);

module.exports = router;
