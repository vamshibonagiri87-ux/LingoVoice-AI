const LearningProfile = require('../models/LearningProfile');
const User = require('../models/User');

class ProfileService {
  async getProfile(userId) {
    let profile = await LearningProfile.findOne({ userId });
    const user = await User.findById(userId);
    if (!profile) {
      profile = await LearningProfile.create({
        userId,
        nativeLanguage: user?.nativeLanguage || 'English',
        targetLanguage: user?.targetLanguage || 'Spanish',
        proficiencyLevel: user?.proficiencyLevel || 'Beginner'
      });
    }
    const profileObj = profile.toObject ? profile.toObject() : { ...profile };
    if (user) {
      profileObj.name = user.name;
      profileObj.email = user.email;
    }
    return profileObj;
  }

  async updateProfile(userId, profileData) {
    const profile = await LearningProfile.findOneAndUpdate(
      { userId },
      { ...profileData, isOnboardingCompleted: true },
      { new: true, upsert: true }
    );

    // Sync user targetLanguage and proficiencyLevel if changed
    const userUpdates = {};
    if (profileData.name) userUpdates.name = profileData.name;
    if (profileData.targetLanguage) userUpdates.targetLanguage = profileData.targetLanguage;
    if (profileData.nativeLanguage) userUpdates.nativeLanguage = profileData.nativeLanguage;
    if (profileData.proficiencyLevel) userUpdates.proficiencyLevel = profileData.proficiencyLevel;
    if (profileData.dailyTargetMinutes) userUpdates.dailyTargetMinutes = profileData.dailyTargetMinutes;

    let user = null;
    if (Object.keys(userUpdates).length > 0) {
      user = await User.findByIdAndUpdate(userId, userUpdates, { new: true });
    } else {
      user = await User.findById(userId);
    }

    const profileObj = profile.toObject ? profile.toObject() : { ...profile };
    if (user) {
      profileObj.name = user.name;
      profileObj.email = user.email;
    }

    return profileObj;
  }

  async submitAssessment(userId, assessmentData) {
    const { estimatedLevel, score, confidence } = assessmentData;
    const finalLevel = estimatedLevel || 'Intermediate';

    const profile = await LearningProfile.findOneAndUpdate(
      { userId },
      {
        proficiencyLevel: finalLevel,
        proficiencyConfidence: confidence || 85,
        isOnboardingCompleted: true
      },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, { proficiencyLevel: finalLevel });

    return {
      profile,
      assessmentResult: {
        level: finalLevel,
        score: score || 85,
        confidence: confidence || 85,
        feedback: `Based on your responses, your estimated speaking level is ${finalLevel}. You can adjust this anytime in Settings.`
      }
    };
  }
}

module.exports = new ProfileService();
