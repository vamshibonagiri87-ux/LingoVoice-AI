const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

/**
 * Vocabulary Agent: Detects vocabulary gaps, suggests contextual alternatives,
 * introduces level-appropriate new terms.
 */
class VocabularyAgent {
  async analyze({ transcript, targetLanguage = 'Spanish', proficiencyLevel = 'Beginner' }) {
    if (config.openRouterApiKey || config.geminiApiKey) {
      try {
        const result = await this._analyzeWithAI({ transcript, targetLanguage, proficiencyLevel });
        if (result) return result;
      } catch (err) {
        console.warn(`[VocabularyAgent] AI vocabulary analysis error: ${err.message}`);
      }
    }

    return this._deterministicVocabulary({ transcript, targetLanguage });
  }

  async _analyzeWithAI({ transcript, targetLanguage, proficiencyLevel }) {
    const prompt = `You are a vocabulary specialist for ${targetLanguage}.
Learner message: "${transcript}"
Proficiency: ${proficiencyLevel}
Suggest 2-3 richer vocabulary alternatives or contextual terms that will expand the learner's lexicon.
Return valid JSON only in this exact format:
{
  "score": 86,
  "suggestions": [
    {
      "word": "deslumbrante",
      "meaning": "dazzling / stunning",
      "context": "Use this instead of just 'muy bonito' to describe scenery"
    }
  ],
  "newWords": ["deslumbrante", "cotidiano"]
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
          timeout: 10000
        }
      );
      const parsed = JSON.parse(res.data?.choices?.[0]?.message?.content || '{}');
      if (parsed.suggestions) return parsed;
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

  _deterministicVocabulary({ transcript, targetLanguage }) {
    const isSpanish = targetLanguage.toLowerCase().includes('span');
    const isFrench = targetLanguage.toLowerCase().includes('fren');

    if (isSpanish) {
      return {
        score: 85,
        suggestions: [
          {
            word: 'por supuesto',
            meaning: 'of course / naturally',
            context: 'Use to naturally agree during voice conversations instead of repetitive "sí".'
          },
          {
            word: 'en realidad',
            meaning: 'actually / in reality',
            context: 'Great transitional phrase for expanding conversational nuance.'
          }
        ],
        newWords: ['por supuesto', 'en realidad']
      };
    }

    if (isFrench) {
      return {
        score: 85,
        suggestions: [
          {
            word: 'absolument',
            meaning: 'absolutely',
            context: 'A great natural agreement word in spoken French.'
          },
          {
            word: 'en fait',
            meaning: 'actually / in fact',
            context: 'Use to add detail or clarify statements fluently.'
          }
        ],
        newWords: ['absolument', 'en fait']
      };
    }

    return {
      score: 85,
      suggestions: [
        {
          word: 'furthermore',
          meaning: 'in addition',
          context: 'Use to connect related ideas smoothly.'
        }
      ],
      newWords: ['furthermore']
    };
  }
}

module.exports = new VocabularyAgent();
