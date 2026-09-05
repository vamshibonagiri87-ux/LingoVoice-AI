const express = require('express');
const { body } = require('express-validator');
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', sessionController.listSessions);
router.post(
  '/',
  validate([
    body('mode').optional().isIn(['conversation', 'scenario', 'interview', 'pronunciation', 'challenge'])
  ]),
  sessionController.createSession
);
router.get('/:id', sessionController.getSession);
router.post('/:id/end', sessionController.endSession);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;
