const ConversationTurn = require('../models/ConversationTurn');
const LearningSession = require('../models/LearningSession');
const LearningProfile = require('../models/LearningProfile');
const User = require('../models/User');
const Scenario = require('../models/Scenario');
const Vocabulary = require('../models/Vocabulary');
const tutorOrchestrator = require('../agents/tutorOrchestrator');
const { emitSessionEvent } = require('../config/socket');

class ConversationService {
  async processMessage(sessionId, userId, { transcript, audioReference = null }) {
    if (!transcript || !transcript.trim()) {
      const err = new Error('Transcript is required');
      err.statusCode = 400;
      throw err;
    }

    const session = await LearningSession.findOne({ _id: sessionId, userId });
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    emitSessionEvent(sessionId, 'audio_processing', { sessionId, state: 'processing' });
    emitSessionEvent(sessionId, 'tutor_thinking', { sessionId, state: 'thinking' });

    const user = await User.findById(userId);
    const profile = await LearningProfile.findOne({ userId });
    const scenario = session.scenarioId ? await Scenario.findById(session.scenarioId) : null;
    const previousTurns = await ConversationTurn.find({ sessionId }).sort({ turnIndex: 1 });

    const nextIndex = previousTurns.length;

    // 1. Run Tutor Orchestration pipeline
    const orchestrationResult = await tutorOrchestrator.processLearnerTurn({
      transcript: transcript.trim(),
      sessionId,
      user,
      profile,
      session,
      scenario,
      history: previousTurns
    });

    const { tutorReply, turnFeedback, meta } = orchestrationResult;

    // 2. Save Learner turn with feedback
    const userTurn = await ConversationTurn.create({
      sessionId,
      userId,
      turnIndex: nextIndex,
      speaker: 'user',
      transcript: transcript.trim(),
      normalizedTranscript: transcript.trim().toLowerCase(),
      audioReference,
      feedback: turnFeedback,
      timestamp: new Date()
    });

    // 3. Save AI Tutor turn
    const tutorTurn = await ConversationTurn.create({
      sessionId,
      userId,
      turnIndex: nextIndex + 1,
      speaker: 'tutor',
      transcript: tutorReply,
      normalizedTranscript: tutorReply.toLowerCase(),
      timestamp: new Date()
    });

    // 4. Save any newly discovered vocabulary words asynchronously
    if (turnFeedback.vocabulary?.suggestions?.length > 0) {
      for (const item of turnFeedback.vocabulary.suggestions) {
        await Vocabulary.findOneAndUpdate(
          { userId, word: item.word },
          {
            userId,
            word: item.word,
            meaning: item.meaning,
            language: session.targetLanguage || 'Spanish',
            example: item.context || '',
            sourceSessionId: sessionId,
            lastPracticedAt: new Date()
          },
          { upsert: true, new: true }
        );
      }
    }

    emitSessionEvent(sessionId, 'tutor_response_ready', {
      sessionId,
      tutorTurn,
      meta
    });

    emitSessionEvent(sessionId, 'feedback_ready', {
      sessionId,
      userTurnId: userTurn._id,
      feedback: turnFeedback
    });

    return {
      userTurn,
      tutorTurn,
      feedback: turnFeedback,
      meta
    };
  }

  async getConversationHistory(sessionId, userId) {
    const session = await LearningSession.findOne({ _id: sessionId, userId });
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    const turns = await ConversationTurn.find({ sessionId }).sort({ turnIndex: 1 });
    return { session, turns };
  }
}

module.exports = new ConversationService();
