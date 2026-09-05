/**
 * Base abstract class for Text-to-Speech providers
 */
class BaseTextToSpeech {
  constructor(name) {
    this.name = name;
  }

  /**
   * Synthesize text to speech
   * @param {string} text - Text to synthesize
   * @param {Object} options - voice, language, speed, pitch
   * @returns {Promise<{ audioUrl: string|null, audioBase64: string|null, mimeType: string, format: string }>}
   */
  async synthesize(text, options = {}) {
    throw new Error('synthesize() method must be implemented by the provider');
  }

  /**
   * Get available voices for a language
   * @param {string} language
   * @returns {Promise<Array>}
   */
  async getVoices(language) {
    throw new Error('getVoices() method must be implemented by the provider');
  }
}

module.exports = BaseTextToSpeech;
