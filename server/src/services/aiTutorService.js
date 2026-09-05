const tutorOrchestrator = require('../agents/tutorOrchestrator');
const conversationAgent = require('../agents/conversationAgent');
const pronunciationAgent = require('../agents/pronunciationAgent');
const grammarAgent = require('../agents/grammarAgent');
const vocabularyAgent = require('../agents/vocabularyAgent');
const progressAgent = require('../agents/progressAgent');

class AiTutorService {
  async processLearnerTurn(params) {
    return await tutorOrchestrator.processLearnerTurn(params);
  }

  async generateResponse(params) {
    return await conversationAgent.generateResponse(params);
  }

  async analyzePronunciation(params) {
    return await pronunciationAgent.analyze(params);
  }

  async analyzeGrammar(params) {
    return await grammarAgent.analyze(params);
  }

  async analyzeVocabulary(params) {
    return await vocabularyAgent.analyze(params);
  }

  async evaluateSession(params) {
    return await progressAgent.evaluateSession(params);
  }

  getOrchestrationStatus() {
    return {
      langGraph: tutorOrchestrator.getLangGraphStatus(),
      agents: ['conversationAgent', 'pronunciationAgent', 'grammarAgent', 'vocabularyAgent', 'progressAgent']
    };
  }
}

module.exports = new AiTutorService();
