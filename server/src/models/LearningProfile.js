const mongoose = require('mongoose');

const LearningProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    nativeLanguage: {
      type: String,
      default: 'English'
    },
    targetLanguage: {
      type: String,
      default: 'Spanish'
    },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'A1', 'A2', 'B1', 'B2', 'C1'],
      default: 'Beginner'
    },
    proficiencyConfidence: {
      type: Number,
      default: 75,
      min: 0,
      max: 100
    },
    learningGoals: {
      type: [String],
      default: ['Daily conversation', 'Travel']
    },
    preferredTopics: {
      type: [String],
      default: ['Daily life', 'Food & Dining', 'Travel & Culture']
    },
    dailyTargetMinutes: {
      type: Number,
      default: 15
    },
    strengths: {
      type: [String],
      default: ['Enthusiasm to speak', 'Basic vocabulary comprehension']
    },
    improvementAreas: {
      type: [String],
      default: ['Verb conjugation consistency', 'Pronunciation rhythm']
    },
    isOnboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LearningProfile', LearningProfileSchema);
