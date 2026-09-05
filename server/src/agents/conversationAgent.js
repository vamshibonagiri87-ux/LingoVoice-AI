const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

/**
 * Conversation Agent: Understands context, generates natural language tutor responses,
 * adapts vocabulary and complexity to proficiency level, encourages the learner.
 */
class ConversationAgent {
  async generateResponse({
    transcript,
    targetLanguage = 'Spanish',
    proficiencyLevel = 'Beginner',
    mode = 'conversation',
    scenario = null,
    history = []
  }) {
    // 1. Try OpenRouter if key is present
    if (config.openRouterApiKey) {
      try {
        const response = await this._callOpenRouter({
          transcript,
          targetLanguage,
          proficiencyLevel,
          mode,
          scenario,
          history
        });
        if (response) return response;
      } catch (err) {
        console.warn(`[ConversationAgent] OpenRouter failed: ${err.message}. Trying fallback...`);
      }
    }

    // 2. Try Google Gemini if key is present
    if (config.geminiApiKey) {
      try {
        const response = await this._callGemini({
          transcript,
          targetLanguage,
          proficiencyLevel,
          mode,
          scenario,
          history
        });
        if (response) return response;
      } catch (err) {
        console.warn(`[ConversationAgent] Gemini failed: ${err.message}. Using deterministic fallback...`);
      }
    }

    // 3. Fallback: High quality deterministic conversational response
    return this._deterministicResponse({
      transcript,
      targetLanguage,
      proficiencyLevel,
      mode,
      scenario,
      history
    });
  }

  async _callOpenRouter({ transcript, targetLanguage, proficiencyLevel, mode, scenario, history }) {
    const systemPrompt = this._buildSystemPrompt({ targetLanguage, proficiencyLevel, mode, scenario });
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((turn) => ({
        role: turn.speaker === 'user' ? 'user' : 'assistant',
        content: turn.transcript
      })),
      { role: 'user', content: transcript }
    ];

    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: config.openRouterModel,
        messages,
        temperature: 0.7,
        max_tokens: 350
      },
      {
        headers: {
          Authorization: `Bearer ${config.openRouterApiKey}`,
          'HTTP-Referer': config.clientUrl,
          'X-Title': 'LingoVoice AI Tutor'
        },
        timeout: 12000
      }
    );

    const reply = res.data?.choices?.[0]?.message?.content;
    return reply ? reply.trim() : null;
  }

  async _callGemini({ transcript, targetLanguage, proficiencyLevel, mode, scenario, history }) {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = this._buildSystemPrompt({ targetLanguage, proficiencyLevel, mode, scenario });
    const historyText = history
      .slice(-4)
      .map((t) => `${t.speaker === 'user' ? 'Learner' : 'Tutor'}: ${t.transcript}`)
      .join('\n');

    const prompt = `${systemPrompt}\n\nRecent Conversation History:\n${historyText}\n\nLearner's latest message:\n"${transcript}"\n\nTutor's direct spoken response:`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text ? text.trim() : null;
  }

  _buildSystemPrompt({ targetLanguage, proficiencyLevel, mode, scenario }) {
    let roleDescription = `You are a supportive, friendly native AI language tutor for ${targetLanguage}.`;
    if (scenario) {
      roleDescription += ` You are roleplaying as: "${scenario.role?.tutorRole || 'Roleplay partner'}" in the scenario "${scenario.title}". The learner is playing "${scenario.role?.userRole || 'Customer/Participant'}".`;
    }

    return `${roleDescription}
Learner proficiency level: ${proficiencyLevel}.
Target language: ${targetLanguage}.
Learning mode: ${mode}.
Rules:
1. Speak predominantly in ${targetLanguage} appropriate for level ${proficiencyLevel} (use simpler sentences for Beginner/A1-A2, richer expressions for Intermediate/Advanced).
2. Keep your response conversational, engaging, and under 3-4 sentences so it is natural to listen to via voice.
3. Always ask an open question or invite the learner to reply to maintain conversational momentum.
4. Do not list grammar rules inside your conversational reply; the separate feedback system handles that.`;
  }

  _deterministicResponse({ transcript, targetLanguage, proficiencyLevel, mode, scenario, history }) {
    const isSpanish = targetLanguage.toLowerCase().includes('span');
    const isFrench = targetLanguage.toLowerCase().includes('fren');
    const isGerman = targetLanguage.toLowerCase().includes('germ');
    const isJapanese = targetLanguage.toLowerCase().includes('japan');

    if (scenario) {
      if (scenario.title.includes('Airport') || scenario.title.includes('Aeropuerto')) {
        if (isSpanish) return '¡Perfecto! Aquí tiene su tarjeta de embarque. La puerta de salida es la B12. ¿Lleva equipaje de mano?';
        if (isFrench) return "Très bien! Voici votre carte d'embarquement. La porte est B12. Avez-vous un bagage à main?";
        return 'Great! Here is your boarding pass. Your gate is B12. Do you have any carry-on luggage with you?';
      }
      if (scenario.title.includes('Restaurant') || scenario.title.includes('Restaurante')) {
        if (isSpanish) return '¡Excelente elección! Nuestro plato especial del día es la paella marinera. ¿Desea algo para beber con su comida?';
        if (isFrench) return 'Excellent choix! Notre plat du jour est délicieux. Voulez-vous quelque chose à boire avec votre repas?';
        return 'Excellent choice! Our chef special today is fantastic. Would you like anything to drink to start?';
      }
      if (scenario.title.includes('Interview') || scenario.title.includes('Entrevista')) {
        if (isSpanish) return 'Muy interesante. Cuénteme sobre un desafío reciente en su trabajo y cómo logró solucionarlo.';
        if (isFrench) return 'Très intéressant. Parlez-moi d’un défi récent dans votre travail et de la façon dont vous l’avez résolu.';
        return 'Very interesting. Could you tell me about a recent challenge at work and how you handled it?';
      }
      if (scenario.title.includes('Hotel')) {
        if (isSpanish) return 'Bienvenido al hotel. Su habitación está en el cuarto piso con vista al mar. ¿A qué hora desea el desayuno?';
        return 'Welcome to the hotel! Your room is on the 4th floor. What time would you prefer breakfast tomorrow?';
      }
    }

    // Default conversational responses
    if (isSpanish) {
      const spanishReplies = [
        '¡Muy bien dicho! Me parece genial. ¿Y qué planes tienes para este fin de semana?',
        '¡Excelente! Entiendo perfectamente tu punto. ¿Te gustaría contarme más sobre tu rutina diaria?',
        '¡Qué interesante! Me gusta mucho cómo expresas tus ideas. ¿Cuánto tiempo llevas practicando español?'
      ];
      return spanishReplies[history.length % spanishReplies.length];
    }

    if (isFrench) {
      const frenchReplies = [
        'Très bien dit! C’est une excellente idée. Quels sont vos projets pour ce week-end?',
        'C’est fascinant! Vous avez un très bon accent. Depuis combien de temps apprenez-vous le français?',
        'Je comprends tout à fait. Pouvez-vous m’en dire plus sur vos activités préférées?'
      ];
      return frenchReplies[history.length % frenchReplies.length];
    }

    if (isGerman) {
      return 'Sehr gut gesprochen! Das klingt wirklich interessant. Was machst du heute noch Schönes?';
    }

    if (isJapanese) {
      return '素晴らしいですね！とても上手です。普段は週末にどんなことをしますか？';
    }

    return `That sounds great! You expressed that very clearly. Could you tell me a bit more about what you enjoy doing in your free time?`;
  }
}

module.exports = new ConversationAgent();
