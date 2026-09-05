const speechToTextProvider = require('../voice/speechToTextProvider');
const textToSpeechProvider = require('../voice/textToSpeechProvider');
const config = require('../config/env');

class VoiceService {
  async transcribeAudio(audioData, options = {}) {
    return await speechToTextProvider.transcribe(audioData, options);
  }

  async synthesizeSpeech(text, options = {}) {
    return await textToSpeechProvider.synthesize(text, options);
  }

  async analyzeSpeech(recognizedText, targetText, language = 'en-US') {
    return await speechToTextProvider.analyzePronunciation(recognizedText, targetText, language);
  }

  getVoiceHealth() {
    return {
      speechToText: 'operational',
      textToSpeech: 'operational',
      webSpeechApiSupported: true,
      audioStreaming: true,
      primaryAiProvider: config.openRouterApiKey ? 'OpenRouter configured' : config.geminiApiKey ? 'Gemini configured' : 'Deterministic Engine (Zero key required)'
    };
  }
}

module.exports = new VoiceService();
