const mongoose = require('mongoose');

const VocabularySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    word: {
      type: String,
      required: true,
      trim: true
    },
    meaning: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      required: true,
      default: 'Spanish'
    },
    example: {
      type: String,
      default: ''
    },
    sourceSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningSession',
      default: null
    },
    familiarityLevel: {
      type: Number,
      default: 1, // 1: New, 2: Practiced, 3: Familiar, 4: Mastered
      min: 1,
      max: 5
    },
    lastPracticedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Vocabulary', VocabularySchema);
