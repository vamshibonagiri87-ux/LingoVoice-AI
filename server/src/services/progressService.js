const ProgressRecord = require('../models/ProgressRecord');
const LearningSession = require('../models/LearningSession');
const Vocabulary = require('../models/Vocabulary');
const LearningProfile = require('../models/LearningProfile');
const User = require('../models/User');

class ProgressService {
  async getLearnerProgress(userId) {
    const [user, profile, latestRecord, totalSessions, totalVocabulary] = await Promise.all([
      User.findById(userId),
      LearningProfile.findOne({ userId }),
      ProgressRecord.findOne({ userId }).sort({ date: -1 }),
      LearningSession.countDocuments({ userId, status: 'COMPLETED' }),
      Vocabulary.countDocuments({ userId })
    ]);

    // Calculate total practice minutes from sessions
    const sessions = await LearningSession.find({ userId, status: 'COMPLETED' });
    const totalPracticeSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalPracticeMinutes = Math.round(totalPracticeSeconds / 60);

    return {
      streak: user?.currentStreak || 1,
      totalPracticeMinutes,
      totalSessions,
      totalVocabulary,
      proficiencyLevel: profile?.proficiencyLevel || user?.proficiencyLevel || 'Beginner',
      proficiencyConfidence: profile?.proficiencyConfidence || 80,
      skills: {
        speaking: latestRecord?.speakingScore || 78,
        pronunciation: latestRecord?.pronunciationScore || 82,
        grammar: latestRecord?.grammarScore || 75,
        vocabulary: latestRecord?.vocabularyScore || 80,
        fluency: latestRecord?.fluencyScore || 76,
        listening: 85
      },
      strengths: profile?.strengths || ['Natural speech pace', 'Clear intention'],
      improvementAreas: profile?.improvementAreas || ['Verb conjugation speed', 'Complex sentences']
    };
  }

  async getProgressHistory(userId, { limit = 14 } = {}) {
    const records = await ProgressRecord.find({ userId })
      .sort({ date: -1 })
      .limit(limit);

    return records.reverse();
  }

  async getInsights(userId) {
    const profile = await LearningProfile.findOne({ userId });
    const vocabList = await Vocabulary.find({ userId }).sort({ lastPracticedAt: -1 }).limit(10);
    const recentSessions = await LearningSession.find({ userId, status: 'COMPLETED' }).sort({ createdAt: -1 }).limit(5);

    const recurringMistakes = [
      {
        pattern: 'Preterite vs Imperfect nuance',
        category: 'Grammar',
        frequency: 'Occasional',
        tip: 'Use imperfect for ongoing habits in the past, and preterite for specific completed events.'
      },
      {
        pattern: 'Rapid vowel liaison',
        category: 'Pronunciation',
        frequency: 'Common',
        tip: 'Practice linking ending vowels smoothly with starting vowels of consecutive words.'
      }
    ];

    const recommendations = [
      {
        title: 'Master ordering & dining',
        mode: 'scenario',
        action: 'Start Restaurant Scenario',
        reason: 'Reinforces polite requests and immediate culinary vocabulary.'
      },
      {
        title: '60-Second Daily Challenge',
        mode: 'challenge',
        action: 'Describe your favorite movie',
        reason: 'Builds spontaneous descriptive storytelling fluency.'
      }
    ];

    return {
      profile,
      recurringMistakes,
      recommendations,
      recentVocabulary: vocabList,
      recentSessionsCount: recentSessions.length
    };
  }
}

module.exports = new ProgressService();
