const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.post('/assessment', profileController.submitAssessment);

module.exports = router;
