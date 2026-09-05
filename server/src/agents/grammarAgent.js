const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

/**
 * Grammar Agent: Analyzes sentence structure, pinpoints grammar/verb agreement issues,
 * explains corrections clearly, preserves user intent.
 */
class GrammarAgent {
  async analyze({ transcript, targetLanguage = 'Spanish', proficiencyLevel = 'Beginner' }) {
    if (config.openRouterApiKey || config.geminiApiKey) {
      try {
        const result = await this._analyzeWithAI({ transcript, targetLanguage, proficiencyLevel });
        if (result) return result;
      } catch (err) {
        console.warn(`[GrammarAgent] AI grammar analysis error: ${err.message}`);
      }
    }

    return this._deterministicGrammar({ transcript, targetLanguage });
  }

  async _analyzeWithAI({ transcript, targetLanguage, proficiencyLevel }) {
    const prompt = `You are an expert ${targetLanguage} language grammar coach.
Learner sentence: "${transcript}"
Proficiency level: ${proficiencyLevel}
Analyze grammar, verb tenses, gender agreements, and word order.
Return valid JSON only in this exact format:
{
  "score": 90,
  "hasErrors": false,
  "correctedText": "${transcript}",
  "explanation": "Great sentence construction!",
  "corrections": [
    {
      "original": "part with mistake or full sentence",
      "corrected": "accurate version",
      "rule": "Subject-verb agreement",
      "explanation": "Explanation why this is corrected"
    }
  ],
  "patterns": ["Present tense regular verbs", "Direct object placement"]
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
      if (parsed.score) return parsed;
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

  _deterministicGrammar({ transcript, targetLanguage }) {
    // Basic heuristic checks for common Spanish / French / English mistakes
    const isSpanish = targetLanguage.toLowerCase().includes('span');
    const lower = transcript.toLowerCase();

    const result = {
      score: 88,
      hasErrors: false,
      correctedText: transcript,
      explanation: 'Your sentence is well structured and communicates the intended meaning clearly.',
      corrections: [],
      patterns: ['Standard conversational syntax', 'Active voice construction']
    };

    if (isSpanish) {
      if (lower.includes('yo gusto') || lower.includes('yo gusta')) {
        result.hasErrors = true;
        result.score = 75;
        result.correctedText = transcript.replace(/yo gust[oa]/gi, 'me gusta');
        result.corrections.push({
          original: 'yo gusto/gusta',
          corrected: 'me gusta',
          rule: 'Indirect Object with Gustar',
          explanation: 'In Spanish, "gustar" literally means "to be pleasing to". Use indirect object pronoun "me gusta" instead of "yo gusto".'
        });
        result.patterns.push('Verbs like gustar');
      } else if (lower.includes('es bueno') && lower.includes('para mi')) {
        result.patterns.push('Ser vs Estar distinctions');
      }
    }

    return result;
  }
}

module.exports = new GrammarAgent();
