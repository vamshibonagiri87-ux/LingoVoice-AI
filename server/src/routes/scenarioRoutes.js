const express = require('express');
const { body } = require('express-validator');
const scenarioController = require('../controllers/scenarioController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', scenarioController.listScenarios);
router.get('/:id', scenarioController.getScenario);
router.post('/:id/start', scenarioController.startScenario);

// Admin route to create custom scenario
router.post(
  '/',
  authorize('admin'),
  validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('openingPrompt').notEmpty().withMessage('Opening prompt is required'),
    body('initialTutorMessage').notEmpty().withMessage('Initial tutor message is required')
  ]),
  scenarioController.createScenario
);

module.exports = router;
