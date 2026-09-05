const profileService = require('../services/profileService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user._id);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Learning profile updated successfully',
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

const submitAssessment = async (req, res, next) => {
  try {
    const result = await profileService.submitAssessment(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Assessment evaluated successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, submitAssessment };
