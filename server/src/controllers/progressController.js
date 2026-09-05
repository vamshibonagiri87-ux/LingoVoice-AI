const progressService = require('../services/progressService');

const getProgress = async (req, res, next) => {
  try {
    const data = await progressService.getLearnerProgress(req.user._id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const data = await progressService.getProgressHistory(req.user._id, {
      limit: parseInt(limit, 10) || 14
    });
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const data = await progressService.getInsights(req.user._id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, getHistory, getInsights };
