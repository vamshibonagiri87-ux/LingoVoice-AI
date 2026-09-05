const sessionService = require('../services/sessionService');

const listSessions = async (req, res, next) => {
  try {
    const { limit, page, mode } = req.query;
    const result = await sessionService.listSessions(req.user._id, {
      limit: parseInt(limit, 10) || 20,
      page: parseInt(page, 10) || 1,
      mode
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const createSession = async (req, res, next) => {
  try {
    const result = await sessionService.createSession(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Learning session initialized',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getSession = async (req, res, next) => {
  try {
    const result = await sessionService.getSession(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const endSession = async (req, res, next) => {
  try {
    const result = await sessionService.endSession(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Session completed successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const result = await sessionService.deleteSession(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { listSessions, createSession, getSession, endSession, deleteSession };
