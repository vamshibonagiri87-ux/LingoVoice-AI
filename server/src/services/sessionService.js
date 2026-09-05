const LearningSession = require('../models/LearningSession');
const ConversationTurn = require('../models/ConversationTurn');
const Scenario = require('../models/Scenario');
const User = require('../models/User');
const LearningProfile = require('../models/LearningProfile');
const ProgressRecord = require('../models/ProgressRecord');
const tutorOrchestrator = require('../agents/tutorOrchestrator');
const { emitSessionEvent } = require('../config/socket');

class SessionService {
  async listSessions(userId, { limit = 20, page = 1, mode } = {}) {
    const query = { userId };
    if (mode) query.mode = mode;

    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      LearningSession.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('scenarioId'),
      LearningSession.countDocuments(query)
    ]);

    return { sessions, total, page, pages: Math.ceil(total / limit) };
  }

  async createSession(userId, sessionData) {
    const user = await User.findById(userId);
    const profile = await LearningProfile.findOne({ userId });

    let scenarioTitle = '';
    let initialTutorGreeting = '';
    let targetLanguage = sessionData.targetLanguage || profile?.targetLanguage || user?.targetLanguage || 'Spanish';

    if (sessionData.scenarioId) {
      const scenario = await Scenario.findById(sessionData.scenarioId);
      if (scenario) {
        scenarioTitle = scenario.title;
        targetLanguage = scenario.targetLanguage || targetLanguage;
        initialTutorGreeting = scenario.initialTutorMessage;
      }
    }

    const session = await LearningSession.create({
      userId,
      mode: sessionData.mode || 'conversation',
      scenarioId: sessionData.scenarioId || null,
      scenarioTitle,
      targetLanguage,
      status: 'ACTIVE',
      startTime: new Date(),
      orchestrationMeta: {
        langGraph: tutorOrchestrator.getLangGraphStatus(),
        providerUsed: 'LingoVoice AI Multi-Agent Engine'
      }
    });

    // If there is an opening greeting for a scenario or conversation mode, create turn 0
    const tutorIntro =
      initialTutorGreeting ||
      (targetLanguage === 'Spanish'
        ? '¡Hola! Soy tu tutor de IA. ¿De qué te gustaría hablar hoy?'
        : targetLanguage === 'French'
        ? 'Bonjour! Je suis votre tuteur IA. De quoi aimeriez-vous parler aujourd’hui?'
        : 'Hello! I am your AI language tutor. What would you like to practice speaking about today?');

    const firstTurn = await ConversationTurn.create({
      sessionId: session._id,
      userId,
      turnIndex: 0,
      speaker: 'tutor',
      transcript: tutorIntro,
      normalizedTranscript: tutorIntro,
      timestamp: new Date()
    });

    return { session, firstTurn };
  }

  async getSession(sessionId, userId) {
    const session = await LearningSession.findOne({ _id: sessionId, userId }).populate('scenarioId');
    if (!session) {
      const err = new Error('Learning session not found');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    const turns = await ConversationTurn.find({ sessionId }).sort({ turnIndex: 1 });
    return { session, turns };
  }

  async endSession(sessionId, userId) {
    const session = await LearningSession.findOne({ _id: sessionId, userId });
    if (!session) {
      const err = new Error('Learning session not found');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    const turns = await ConversationTurn.find({ sessionId }).sort({ turnIndex: 1 });
    const user = await User.findById(userId);
    const profile = await LearningProfile.findOne({ userId });

    const startTime = new Date(session.startTime).getTime();
    const endTime = Date.now();
    const durationSeconds = Math.max(15, Math.round((endTime - startTime) / 1000));
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    // Synthesize session evaluation via ProgressAgent through tutorOrchestrator
    const evaluation = await tutorOrchestrator.synthesizeSessionEnd({
      session,
      turns,
      user,
      profile
    });

    session.status = 'COMPLETED';
    session.endTime = new Date(endTime);
    session.duration = durationSeconds;
    session.turnCount = turns.length;
    session.summary = evaluation.summary;
    session.overallFeedback = evaluation;
    await session.save();

    // Create progress snapshot
    await ProgressRecord.create({
      userId,
      date: new Date(),
      speakingScore: evaluation.speakingScore || 85,
      pronunciationScore: evaluation.pronunciationScore || 85,
      grammarScore: evaluation.grammarScore || 85,
      vocabularyScore: evaluation.vocabularyScore || 85,
      fluencyScore: evaluation.fluencyScore || 80,
      practiceMinutes: durationMinutes
    });

    // Increment user streak and streak calculation
    const today = new Date().toDateString();
    const lastLoginDay = user.lastLogin ? new Date(user.lastLogin).toDateString() : '';
    if (today !== lastLoginDay) {
      user.currentStreak = (user.currentStreak || 1) + 1;
    }
    await user.save();

    emitSessionEvent(sessionId, 'session_completed', {
      sessionId,
      summary: evaluation.summary,
      overallFeedback: evaluation
    });

    return { session, evaluation };
  }

  async deleteSession(sessionId, userId) {
    const session = await LearningSession.findOneAndDelete({ _id: sessionId, userId });
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      throw err;
    }
    await ConversationTurn.deleteMany({ sessionId });
    return { success: true, message: 'Session deleted successfully' };
  }
}

module.exports = new SessionService();
