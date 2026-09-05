import { X, CheckCircle, AlertTriangle, BookOpen, Volume2, Sparkles, Award, ThumbsUp } from 'lucide-react';
import voiceService from '../../services/voice';

export default function TutorFeedback({ feedback, onClose }) {
  if (!feedback) return null;

  const { grammar, vocabulary, pronunciation, fluency } = feedback;

  const playWordAudio = (word) => {
    voiceService.speakText(word, { rate: 0.85 });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-900/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">AI Coach Insights 🌟</h3>
            <p className="text-[11px] text-brand-300">Helpful tips for your last sentence</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close feedback"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Feedback Sections */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 divide-y divide-white/5">
        {/* Fluency & Score Badges */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 space-y-0.5">
            <span className="text-[11px] text-gray-400 block font-medium">Clarity Score</span>
            <span className="text-2xl font-extrabold text-gradient-emerald">
              {pronunciation?.clarityScore || 85}%
            </span>
            <span className="text-[10px] text-emerald-300 block font-semibold">
              {(pronunciation?.clarityScore || 85) >= 80 ? '🎉 Clear & understood!' : '👍 Good effort!'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 space-y-0.5">
            <span className="text-[11px] text-gray-400 block font-medium">Fluency Rating</span>
            <span className="text-2xl font-extrabold text-gradient-brand">
              {fluency?.score || 82}%
            </span>
            <span className="text-[10px] text-brand-300 block font-semibold">
              {(fluency?.score || 82) >= 80 ? '🚀 Smooth pace' : 'Keep practicing'}
            </span>
          </div>
        </div>

        {/* Grammar Section with Plain-English explanations */}
        <div className="pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-2 mb-2.5">
            <CheckCircle className="w-4 h-4 text-brand-400" />
            <span>Grammar & Phrasing</span>
          </h4>

          {grammar?.hasErrors ? (
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-xs space-y-2.5">
              <div>
                <span className="text-gray-300 font-bold block mb-1">💡 Suggested way to say it:</span>
                <p className="font-semibold text-brand-100 bg-dark-900/60 p-2.5 rounded-xl border border-white/10">
                  {grammar.correctedText}
                </p>
              </div>
              {grammar.explanation && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[11px] text-gray-400 block mb-0.5 font-medium">Why:</span>
                  <p className="text-gray-200 leading-relaxed text-xs">
                    {grammar.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
              <ThumbsUp className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Great job! Your grammar and sentence order was natural and clear.</span>
            </div>
          )}
        </div>

        {/* Vocabulary Section */}
        <div className="pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2 mb-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Cool Words to Learn</span>
          </h4>

          {vocabulary?.suggestions && vocabulary.suggestions.length > 0 ? (
            <div className="space-y-2">
              {vocabulary.suggestions.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-cyan-200">
                    <div className="flex items-center gap-2">
                      <span>{item.word}</span>
                      <button
                        onClick={() => playWordAudio(item.word)}
                        className="p-1 hover:text-white text-cyan-400 hover:bg-cyan-500/20 rounded-md transition-colors"
                        title="Hear pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-gray-400 font-normal">{item.meaning}</span>
                  </div>
                  {item.context && (
                    <p className="text-gray-300 text-[11px] italic bg-dark-900/40 p-1.5 rounded-lg">
                      &ldquo;{item.context}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Great vocabulary choices in this turn!</p>
          )}
        </div>

        {/* Pronunciation & Phonetic Drill */}
        <div className="pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 mb-2.5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Pronunciation Breakdown</span>
          </h4>

          {pronunciation?.practiceWords && pronunciation.practiceWords.length > 0 ? (
            <div className="space-y-2">
              {pronunciation.practiceWords.map((pw, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-200 text-sm">{pw.word}</span>
                      <button
                        onClick={() => playWordAudio(pw.word)}
                        className="p-1 hover:text-white text-amber-400 hover:bg-amber-500/20 rounded-md transition-colors"
                        title="Hear sound"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-amber-300 font-mono text-xs bg-amber-500/20 px-2 py-0.5 rounded-md">
                      {pw.phonetic}
                    </span>
                  </div>
                  <p className="text-gray-200 mt-1 text-[11px]">💡 {pw.tip}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 text-xs text-gray-300">
              {pronunciation?.note || 'Your phonetic rhythm and sound cadence were clear!'}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-dark-950/80 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all"
        >
          Got it! Continue Speaking 🎙️
        </button>
      </div>
    </div>
  );
}
