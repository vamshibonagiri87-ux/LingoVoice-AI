const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningSession',
      required: true
    },
    turnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConversationTurn',
      default: null
    },
    pronunciationFeedback: {
      score: { type: Number, default: 85 },
      clarity: { type: String, default: 'Clear' },
      tips: [{ type: String }],
      mispronouncedWords: [{ word: String, phonetic: String, soundGuide: String }]
    },
    grammarFeedback: {
      score: { type: Number, default: 85 },
      corrections: [
        {
          original: String,
          corrected: String,
          rule: String,
          explanation: String
        }
      ]
    },
    vocabularyFeedback: {
      score: { type: Number, default: 85 },
      wordsLearned: [{ word: String, definition: String, example: String }],
      recommendedWords: [{ word: String, level: String, reason: String }]
    },
    fluencyFeedback: {
      score: { type: Number, default: 80 },
      coherence: { type: String, default: 'Natural conversational flow' },
      speakingRate: { type: String, default: 'Optimal' }
    },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    recommendations: [{ type: String }],
    evaluationMethod: {
      type: String,
      default: 'AI Tutor multi-agent pedagogical assessment'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
