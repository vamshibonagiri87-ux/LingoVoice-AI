const express = require('express');
const { body } = require('express-validator');
const voiceController = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.post('/transcribe', voiceController.transcribe);
router.post(
  '/synthesize',
  validate([
    body('text').notEmpty().withMessage('Text to synthesize is required')
  ]),
  voiceController.synthesize
);
router.post('/analyze', voiceController.analyze);
router.get('/status', voiceController.getStatus);

module.exports = router;
