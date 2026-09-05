/**
 * Voice Service: Wraps Web Speech API (SpeechRecognition & SpeechSynthesis)
 * and audio stream capture for interactive voice conversation.
 */

class VoiceService {
  constructor() {
    this.recognition = null;
    this.isRecording = false;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.currentUtterance = null;
  }

  isSpeechRecognitionSupported() {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  isSpeechSynthesisSupported() {
    if (typeof window === 'undefined') return false;
    return Boolean('speechSynthesis' in window);
  }

  /**
   * Start speech recognition and audio stream capture
   */
  async startListening({
    language = 'es-ES',
    onResult,
    onError,
    onEnd,
    onAudioLevel
  }) {
    if (!this.isSpeechRecognitionSupported()) {
      onError?.(new Error('Speech recognition is not supported in this browser. You can still type your answers!'));
      return;
    }

    try {
      // 1. Request microphone access for visualization
      if (navigator.mediaDevices?.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this._setupAudioAnalyser(this.mediaStream, onAudioLevel);
      }

      // 2. Setup SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = language;

      this.recognition.onstart = () => {
        this.isRecording = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        onResult?.({
          final: finalTranscript,
          interim: interimTranscript,
          isFinal: Boolean(finalTranscript)
        });
      };

      this.recognition.onerror = (event) => {
        console.warn('[VoiceService] Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          onError?.(new Error('Microphone permission denied. Please allow microphone access in your browser settings.'));
        } else if (event.error !== 'no-speech') {
          onError?.(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        onEnd?.();
      };

      this.recognition.start();
    } catch (err) {
      console.error('[VoiceService] Failed to start microphone:', err);
      onError?.(err);
    }
  }

  /**
   * Stop listening and cleanup audio streams
   */
  stopListening() {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isRecording = false;
    this._cleanupAudioStream();
  }

  /**
   * Synthesize text to speech using Web Speech Synthesis
   */
  speakText(text, { language = 'es-ES', rate = 1.0, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (!this.synthesis) {
      onError?.(new Error('Speech synthesis is not supported in this browser'));
      return;
    }

    // Cancel any active speaking
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick best matching voice if available
    const voices = this.synthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(language.split('-')[0]) || v.lang === language);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
      console.warn('[VoiceService] Speech synthesis error:', e);
      onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  _setupAudioAnalyser(stream, onAudioLevel) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;

      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkLevel = () => {
        if (!this.isRecording) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        onAudioLevel?.(normalized, dataArray);
        requestAnimationFrame(checkLevel);
      };

      requestAnimationFrame(checkLevel);
    } catch (e) {
      console.warn('[VoiceService] Audio analyser setup failed:', e);
    }
  }

  _cleanupAudioStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
    }
  }
}

const voiceService = new VoiceService();
export default voiceService;
