const mongoose = require('mongoose');

const LearningSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mode: {
      type: String,
      enum: ['conversation', 'scenario', 'interview', 'pronunciation', 'challenge'],
      default: 'conversation'
    },
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scenario',
      default: null
    },
    scenarioTitle: {
      type: String,
      default: ''
    },
    targetLanguage: {
      type: String,
      default: 'Spanish'
    },
    status: {
      type: String,
      enum: ['CREATED', 'ACTIVE', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'ACTIVE'
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      default: null
    },
    duration: {
      type: Number, // in seconds
      default: 0
    },
    turnCount: {
      type: Number,
      default: 0
    },
    summary: {
      type: String,
      default: ''
    },
    overallFeedback: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    orchestrationMeta: {
      langGraph: {
        type: String,
        enum: ['available', 'not-installed'],
        default: 'not-installed'
      },
      providerUsed: {
        type: String,
        default: 'deterministic'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LearningSession', LearningSessionSchema);
