const BaseTextToSpeech = require('./baseTextToSpeech');
const config = require('../config/env');

class TextToSpeechProvider extends BaseTextToSpeech {
  constructor() {
    super('lingovoice-unified-tts');
  }

  async synthesize(text, options = {}) {
    const { language = 'en-US', speed = 1.0, pitch = 1.0 } = options;

    if (!text || typeof text !== 'string') {
      throw new Error('Valid text is required for speech synthesis');
    }

    // Voice mapping per language
    const voiceProfiles = {
      'Spanish': { langCode: 'es-ES', voiceName: 'Lucia / Jorge (Spanish AI Tutor)' },
      'French': { langCode: 'fr-FR', voiceName: 'Amélie / Henri (French AI Tutor)' },
      'German': { langCode: 'de-DE', voiceName: 'Marlene / Hans (German AI Tutor)' },
      'Japanese': { langCode: 'ja-JP', voiceName: 'Kyoko / Kenji (Japanese AI Tutor)' },
      'Italian': { langCode: 'it-IT', voiceName: 'Chiara / Matteo (Italian AI Tutor)' },
      'Portuguese': { langCode: 'pt-BR', voiceName: 'Camila / Thiago (Portuguese AI Tutor)' },
      'English': { langCode: 'en-US', voiceName: 'Samantha / Alex (English AI Tutor)' },
      'es-ES': { langCode: 'es-ES', voiceName: 'Spanish Native Voice' },
      'fr-FR': { langCode: 'fr-FR', voiceName: 'French Native Voice' },
      'de-DE': { langCode: 'de-DE', voiceName: 'German Native Voice' },
      'ja-JP': { langCode: 'ja-JP', voiceName: 'Japanese Native Voice' },
      'en-US': { langCode: 'en-US', voiceName: 'English Native Voice' }
    };

    const profile = voiceProfiles[language] || { langCode: 'en-US', voiceName: 'Default AI Tutor Voice' };

    return {
      text,
      language: profile.langCode,
      voiceName: profile.voiceName,
      speed,
      pitch,
      audioUrl: null, // Client plays natively via Web Speech Synthesis or audio stream
      mode: 'web-synthesis-stream',
      status: 'synthesized'
    };
  }

  async getVoices(language) {
    return [
      { id: 'tutor-natural-1', name: 'LingoVoice Natural AI (Standard)', lang: language || 'en-US' },
      { id: 'tutor-gentle-2', name: 'LingoVoice Gentle Coach (Slower cadence)', lang: language || 'en-US' }
    ];
  }
}

module.exports = new TextToSpeechProvider();
