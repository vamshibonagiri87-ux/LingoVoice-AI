const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Travel', 'Daily Life', 'Career & Work', 'Education', 'Health', 'Social', 'Dining', 'Custom'],
      default: 'Daily Life'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    targetLanguage: {
      type: String,
      default: 'Spanish'
    },
    role: {
      tutorRole: { type: String, default: 'Barista / Shopkeeper' },
      userRole: { type: String, default: 'Customer' }
    },
    objectives: [{ type: String }],
    vocabulary: [{ word: String, translation: String, context: String }],
    openingPrompt: {
      type: String,
      required: true
    },
    initialTutorMessage: {
      type: String,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Scenario', ScenarioSchema);
