const mongoose = require('mongoose');

const ConversationTurnSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningSession',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    turnIndex: {
      type: Number,
      required: true
    },
    speaker: {
      type: String,
      enum: ['user', 'tutor'],
      required: true
    },
    transcript: {
      type: String,
      required: true
    },
    normalizedTranscript: {
      type: String,
      default: ''
    },
    audioReference: {
      type: String,
      default: null
    },
    // Turn-level structured feedback (for user turns)
    feedback: {
      grammar: {
        hasErrors: { type: Boolean, default: false },
        correctedText: { type: String, default: '' },
        explanation: { type: String, default: '' },
        patterns: [{ type: String }]
      },
      vocabulary: {
        suggestions: [{ word: String, meaning: String, context: String }],
        newWords: [{ type: String }]
      },
      pronunciation: {
        clarityScore: { type: Number, default: 85 },
        practiceWords: [{ word: String, phonetic: String, tip: String }],
        note: { type: String, default: '' }
      },
      fluency: {
        score: { type: Number, default: 80 },
        pacing: { type: String, default: 'Good' }
      }
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ConversationTurn', ConversationTurnSchema);
