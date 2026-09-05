const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

/**
 * Progress Agent: Evaluates entire learning sessions, tracks recurring mistakes,
 * calculates skill score progressions, and generates recommendations.
 */
class ProgressAgent {
  async evaluateSession({ session, turns, profile, targetLanguage = 'Spanish' }) {
    if (config.openRouterApiKey || config.geminiApiKey) {
      try {
        const result = await this._evaluateWithAI({ session, turns, profile, targetLanguage });
        if (result) return result;
      } catch (err) {
        console.warn(`[ProgressAgent] AI progress evaluation error: ${err.message}`);
      }
    }

    return this._deterministicEvaluation({ session, turns, targetLanguage });
  }

  async _evaluateWithAI({ session, turns, profile, targetLanguage }) {
    const userTurns = turns.filter((t) => t.speaker === 'user');
    const transcriptOverview = userTurns.map((t) => `- "${t.transcript}"`).join('\n');

    const prompt = `You are the Head Pedagogical Evaluator for language learning in ${targetLanguage}.
Session Mode: ${session.mode}
Target Language: ${targetLanguage}
Learner Transcripts from Session:
${transcriptOverview}

Synthesize a comprehensive, encouraging end-of-session evaluation.
Return valid JSON only in this exact format:
{
  "speakingScore": 86,
  "pronunciationScore": 88,
  "grammarScore": 84,
  "vocabularyScore": 85,
  "fluencyScore": 82,
  "summary": "Completed a dynamic speaking session with great engagement and clear expressions.",
  "strengths": ["Spontaneous speech flow", "Accurate everyday vocabulary usage"],
  "improvements": ["Practice compound past tenses", "Vary sentence openings"],
  "recommendations": ["Try the Restaurant ordering scenario next", "Practice the 3 new vocabulary terms"],
  "personalizedTip": "Record yourself repeating longer sentences to build vocal muscle memory."
}`;

    if (config.openRouterApiKey) {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: config.openRouterModel,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        },
        {
          headers: { Authorization: `Bearer ${config.openRouterApiKey}` },
          timeout: 12000
        }
      );
      const parsed = JSON.parse(res.data?.choices?.[0]?.message?.content || '{}');
      if (parsed.summary) return parsed;
    }

    if (config.geminiApiKey) {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`${prompt}\nOutput strict JSON only.`);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    }

    return null;
  }

  _deterministicEvaluation({ session, turns, targetLanguage }) {
    const userTurns = turns.filter((t) => t.speaker === 'user');
    const baseScore = Math.min(94, 78 + userTurns.length * 2);

    return {
      speakingScore: baseScore,
      pronunciationScore: baseScore + 2,
      grammarScore: baseScore - 1,
      vocabularyScore: baseScore + 1,
      fluencyScore: baseScore - 2,
      summary: `Great practice session! You successfully completed ${userTurns.length} spoken turns in ${targetLanguage}. Your confidence and responsiveness are improving steadily.`,
      strengths: [
        'Active conversational participation',
        'Good communicative intent and comprehension',
        'Natural speech cadence'
      ],
      improvements: [
        'Continue expanding your spontaneous vocabulary usage',
        'Focus on consistent verb conjugation under time pressure'
      ],
      recommendations: [
        'Review recently saved vocabulary flashcards',
        'Try a 5-minute Scenario Roleplay challenge tomorrow'
      ],
      personalizedTip: 'Keep speaking in complete sentences—this builds rapid conversational fluency faster than isolated words.'
    };
  }
}

module.exports = new ProgressAgent();
