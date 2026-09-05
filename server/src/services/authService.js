const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LearningProfile = require('../models/LearningProfile');
const ProgressRecord = require('../models/ProgressRecord');
const Notification = require('../models/Notification');
const config = require('../config/env');

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
  }

  async register({ name, email, password, nativeLanguage, targetLanguage, proficiencyLevel, learningGoal, dailyTargetMinutes }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error('An account with this email already exists');
      err.statusCode = 400;
      err.code = 'USER_ALREADY_EXISTS';
      throw err;
    }

    const user = await User.create({
      name,
      email,
      password,
      nativeLanguage: nativeLanguage || 'English',
      targetLanguage: targetLanguage || 'Spanish',
      proficiencyLevel: proficiencyLevel || 'Beginner',
      learningGoal: learningGoal || 'Daily conversation',
      dailyTargetMinutes: dailyTargetMinutes || 15
    });

    // Create initial learning profile
    const profile = await LearningProfile.create({
      userId: user._id,
      nativeLanguage: user.nativeLanguage,
      targetLanguage: user.targetLanguage,
      proficiencyLevel: user.proficiencyLevel,
      learningGoals: [user.learningGoal],
      dailyTargetMinutes: user.dailyTargetMinutes,
      isOnboardingCompleted: false
    });

    // Create initial progress record snapshot
    await ProgressRecord.create({
      userId: user._id,
      date: new Date(),
      speakingScore: 70,
      pronunciationScore: 75,
      grammarScore: 70,
      vocabularyScore: 72,
      fluencyScore: 68,
      practiceMinutes: 0
    });

    // Welcome notification
    await Notification.create({
      userId: user._id,
      type: 'system',
      title: 'Welcome to LingoVoice AI! 🎙️',
      message: 'Complete your onboarding setup to start natural voice practice with your personal AI language tutor.'
    });

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        proficiencyLevel: user.proficiencyLevel,
        learningGoal: user.learningGoal,
        dailyTargetMinutes: user.dailyTargetMinutes,
        currentStreak: user.currentStreak,
        role: user.role
      },
      profile,
      token
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const err = new Error('Invalid email or password credentials');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const err = new Error('Invalid email or password credentials');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const profile = await LearningProfile.findOne({ userId: user._id });
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        proficiencyLevel: user.proficiencyLevel,
        learningGoal: user.learningGoal,
        dailyTargetMinutes: user.dailyTargetMinutes,
        currentStreak: user.currentStreak,
        role: user.role
      },
      profile,
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    const profile = await LearningProfile.findOne({ userId });
    return { user, profile };
  }

  async updateUser(userId, updateData) {
    const allowedFields = ['name', 'nativeLanguage', 'targetLanguage', 'proficiencyLevel', 'learningGoal', 'dailyTargetMinutes'];
    const filtered = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filtered[key] = updateData[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, filtered, { new: true });
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Keep profile in sync
    await LearningProfile.findOneAndUpdate({ userId }, filtered);

    return user;
  }
}

module.exports = new AuthService();
