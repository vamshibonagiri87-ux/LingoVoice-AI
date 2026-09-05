import { useState } from 'react';
import { Mic, MicOff, Send, RotateCcw, X, Loader2, Volume2, AlertTriangle, Keyboard, HelpCircle, Sparkles } from 'lucide-react';
import AudioVisualizer from '../AudioVisualizer/AudioVisualizer';
import { useConversationStore } from '../../store/conversationStore';

export default function VoiceRecorder({ onSendMessage }) {
  const {
    recordingState,
    audioLevel,
    frequencyData,
    interimTranscript,
    currentTranscript,
    startVoiceRecording,
    stopVoiceRecordingAndSubmit,
    cancelRecording,
    sendMessage,
    isTtsPlaying,
    stopTts,
    error
  } = useConversationStore();

  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const isListening = recordingState === 'listening';
  const isProcessing = recordingState === 'processing' || recordingState === 'responding';

  const handleMicClick = () => {
    if (isTtsPlaying) {
      stopTts();
    }

    if (isListening) {
      stopVoiceRecordingAndSubmit();
    } else if (!isProcessing) {
      startVoiceRecording();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendMessage(textInput.trim());
      setTextInput('');
    }
  };

  const spokenPreview = (currentTranscript + ' ' + interimTranscript).trim();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Error / Permission Alert */}
      {error && (
        <div className="mb-4 w-full p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold block text-white">Microphone note:</span>
              <span>{error}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTextInput(true)}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-200 font-semibold text-[11px]"
            >
              Switch to Typing ⌨️
            </button>
            <button
              onClick={() => cancelRecording()}
              className="p-1 hover:bg-rose-500/20 rounded-lg text-rose-400"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* AI Speaking Banner */}
      {isTtsPlaying && (
        <div className="mb-3 px-5 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-3 animate-pulse shadow-lg shadow-cyan-500/10">
          <Volume2 className="w-4 h-4 text-cyan-300 animate-bounce" />
          <span className="font-semibold">AI Coach is speaking aloud...</span>
          <button
            onClick={stopTts}
            className="ml-2 px-2.5 py-1 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 text-[11px] font-bold text-white transition-colors"
          >
            Mute Voice ⏹️
          </button>
        </div>
      )}

      {/* Dynamic Voice Waves & Spoken Text Preview */}
      {(isListening || spokenPreview) && (
        <div className="w-full mb-4 p-4 rounded-3xl bg-dark-850 border border-brand-500/30 shadow-xl shadow-brand-500/10 animate-in fade-in slide-in-from-bottom-2">
          <AudioVisualizer
            isActive={isListening}
            audioLevel={audioLevel}
            frequencyData={frequencyData}
            height={44}
          />
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-[11px] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>{isListening ? 'Listening Live to your Voice...' : 'Transcript recognized:'}</span>
            </div>
            <p className="text-sm font-semibold text-white italic mt-1">
              &ldquo;{spokenPreview || 'Speak clearly into your microphone...'}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Main Control Console */}
      <div className="w-full flex flex-col items-center">
        {showTextInput ? (
          <form onSubmit={handleTextSubmit} className="w-full flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your response in target language (e.g. ¡Hola!)..."
              className="flex-1 px-4 py-3.5 rounded-2xl bg-dark-850 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTextInput(false)}
              className="p-3.5 rounded-2xl bg-dark-800 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Switch to Voice Microphone"
            >
              <Mic className="w-4 h-4 text-brand-400" />
              <span className="hidden sm:inline">Use Mic</span>
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-6">
            {/* Cancel/Reset Button (Only when listening or transcript present) */}
            {(isListening || spokenPreview) && (
              <button
                onClick={cancelRecording}
                className="p-3.5 rounded-full bg-dark-800 border border-white/10 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all transform hover:scale-105"
                title="Cancel & retry speaking"
                aria-label="Cancel recording"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}

            {/* Central Master Microphone Button */}
            <div className="relative flex flex-col items-center justify-center">
              {isListening && (
                <div className="absolute -inset-4 rounded-full bg-rose-500/25 animate-ping pointer-events-none" />
              )}
              {isListening && (
                <div className="absolute -inset-2 rounded-full bg-rose-500/35 animate-pulse pointer-events-none" />
              )}

              <button
                onClick={handleMicClick}
                disabled={isProcessing}
                className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/50 ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/50 scale-105 ring-4 ring-rose-400/40'
                    : isProcessing
                    ? 'bg-dark-800 text-brand-400 border border-brand-500/30 cursor-wait'
                    : 'bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white shadow-brand-500/40 hover:scale-105'
                }`}
                aria-label={isListening ? 'Stop Speaking and Submit Turn' : 'Start Speaking with AI Tutor'}
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Manual Submit Button if user finished speaking */}
            {isListening && spokenPreview && (
              <button
                onClick={stopVoiceRecordingAndSubmit}
                className="p-3.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
                title="Submit your speech"
                aria-label="Submit Speech"
              >
                <Send className="w-5 h-5" />
              </button>
            )}

            {/* Switch to Text mode toggle */}
            {!isListening && (
              <button
                onClick={() => setShowTextInput(true)}
                className="p-3.5 rounded-full bg-dark-800 border border-white/10 text-gray-400 hover:text-white hover:bg-dark-750 transition-all"
                title="Switch to keyboard typing"
                aria-label="Type with keyboard"
              >
                <Keyboard className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Dynamic Status Helper Text for Students */}
        <div className="mt-3 flex items-center gap-2">
          <p className="text-xs text-gray-300 font-medium text-center">
            {isListening ? (
              <span className="text-rose-400 font-bold animate-pulse">
                🔴 Speaking now... Tap the red mic or checkmark when done!
              </span>
            ) : isProcessing ? (
              <span className="text-brand-300 font-semibold">
                ⏳ AI Tutor is checking pronunciation & replying...
              </span>
            ) : (
              <span>
                👉 <strong className="text-white">Tap the big microphone</strong> to practice speaking (or click ⌨️ to type)
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-gray-400 hover:text-brand-300 transition-colors p-1"
            title="Student Voice Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Student Voice Helper Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-brand-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>How to Practice with AI Voice</span>
              </h4>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
                <span className="font-bold text-white block">1. Allow Microphone 🎙️</span>
                <p>When the browser asks for permission, click &ldquo;Allow&rdquo; so the tutor can hear you.</p>
              </div>

              <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
                <span className="font-bold text-white block">2. Speak Clearly & Naturally 🗣️</span>
                <p>Say complete sentences in your target language. Don&apos;t worry about mistakes—the AI is here to help you learn!</p>
              </div>

              <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
                <span className="font-bold text-white block">3. Prefer Typing? ⌨️</span>
                <p>Click the keyboard icon anytime to type your answers if you are in a noisy room.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-colors"
            >
              Got it! Let&apos;s Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
