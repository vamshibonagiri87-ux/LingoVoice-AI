const conversationAgent = require('./conversationAgent');
const pronunciationAgent = require('./pronunciationAgent');
const grammarAgent = require('./grammarAgent');
const vocabularyAgent = require('./vocabularyAgent');
const progressAgent = require('./progressAgent');
const config = require('../config/env');

let langGraphStatus = 'not-installed';
try {
  // Test if langgraph is available
  require.resolve('@langchain/langgraph');
  langGraphStatus = 'available';
} catch (e) {
  langGraphStatus = 'not-installed';
}

/**
 * Tutor Orchestrator coordinates all AI agents into a single coherent learning turn pipeline
 */
class TutorOrchestrator {
  constructor() {
    this.langGraphStatus = langGraphStatus;
  }

  getLangGraphStatus() {
    return this.langGraphStatus;
  }

  /**
   * Process a single learner conversation turn through all specialized agents
   */
  async processLearnerTurn({
    transcript,
    sessionId,
    user,
    profile,
    session,
    scenario,
    history
  }) {
    const targetLanguage = session.targetLanguage || profile?.targetLanguage || 'Spanish';
    const proficiencyLevel = profile?.proficiencyLevel || user?.proficiencyLevel || 'Beginner';
    const mode = session.mode || 'conversation';

    // 1. Run Conversation Agent, Grammar Agent, Vocabulary Agent, and Pronunciation Agent in parallel
    const [tutorReply, grammarAnalysis, vocabularyAnalysis, pronunciationAnalysis] = await Promise.all([
      conversationAgent.generateResponse({
        transcript,
        targetLanguage,
        proficiencyLevel,
        mode,
        scenario,
        history
      }),
      grammarAgent.analyze({
        transcript,
        targetLanguage,
        proficiencyLevel
      }),
      vocabularyAgent.analyze({
        transcript,
        targetLanguage,
        proficiencyLevel
      }),
      pronunciationAgent.analyze({
        transcript,
        targetLanguage,
        proficiencyLevel
      })
    ]);

    // Structured combined turn feedback
    const turnFeedback = {
      grammar: {
        hasErrors: grammarAnalysis.hasErrors || false,
        correctedText: grammarAnalysis.correctedText || transcript,
        explanation: grammarAnalysis.explanation || '',
        patterns: grammarAnalysis.patterns || []
      },
      vocabulary: {
        suggestions: vocabularyAnalysis.suggestions || [],
        newWords: vocabularyAnalysis.newWords || []
      },
      pronunciation: {
        clarityScore: pronunciationAnalysis.clarityScore || 85,
        practiceWords: pronunciationAnalysis.practiceWords || [],
        note: pronunciationAnalysis.tips?.[0] || 'Good speech clarity'
      },
      fluency: {
        score: Math.min(100, Math.max(70, Math.round(((grammarAnalysis.score || 85) + (pronunciationAnalysis.clarityScore || 85)) / 2))),
        pacing: 'Optimal conversational tempo'
      }
    };

    const providerUsed = config.openRouterApiKey ? 'OpenRouter' : config.geminiApiKey ? 'Gemini' : 'Deterministic Engine';

    return {
      tutorReply,
      turnFeedback,
      grammarAnalysis,
      vocabularyAnalysis,
      pronunciationAnalysis,
      meta: {
        langGraph: this.langGraphStatus,
        providerUsed
      }
    };
  }

  /**
   * Process end-of-session synthesis through Progress Agent
   */
  async synthesizeSessionEnd({ session, turns, user, profile }) {
    const targetLanguage = session.targetLanguage || profile?.targetLanguage || 'Spanish';
    return await progressAgent.evaluateSession({
      session,
      turns,
      profile,
      targetLanguage
    });
  }
}

module.exports = new TutorOrchestrator();
