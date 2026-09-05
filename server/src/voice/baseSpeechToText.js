/**
 * Base abstract class for Speech-to-Text providers
 */
class BaseSpeechToText {
  constructor(name) {
    this.name = name;
  }

  /**
   * Transcribe an audio buffer or audio payload
   * @param {Buffer|string} audioData - Audio buffer or base64 data
   * @param {Object} options - Language code, sample rate, etc.
   * @returns {Promise<{ transcript: string, confidence: number, language: string, provider: string }>}
   */
  async transcribe(audioData, options = {}) {
    throw new Error('transcribe() method must be implemented by the provider');
  }

  /**
   * Analyze speech pronunciation against target reference
   * @param {string} recognizedText
   * @param {string} targetText
   * @param {string} language
   * @returns {Promise<Object>}
   */
  async analyzePronunciation(recognizedText, targetText, language) {
    throw new Error('analyzePronunciation() method must be implemented by the provider');
  }
}

module.exports = BaseSpeechToText;
