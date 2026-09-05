const mongoose = require('mongoose');

const ProgressRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    speakingScore: {
      type: Number,
      default: 75
    },
    pronunciationScore: {
      type: Number,
      default: 80
    },
    grammarScore: {
      type: Number,
      default: 78
    },
    vocabularyScore: {
      type: Number,
      default: 82
    },
    fluencyScore: {
      type: Number,
      default: 76
    },
    practiceMinutes: {
      type: Number,
      default: 0
    },
    sessionsCompleted: {
      type: Number,
      default: 1
    },
    sourceMethod: {
      type: String,
      default: 'Session performance aggregation & progressive rolling average'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ProgressRecord', ProgressRecordSchema);
