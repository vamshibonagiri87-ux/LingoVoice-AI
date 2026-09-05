import { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, User, Bot, HelpCircle, Eye, EyeOff, Award } from 'lucide-react';
import { useConversationStore } from '../../store/conversationStore';

export default function MessageBubble({ turn, onShowFeedback }) {
  const { playTutorVoice } = useConversationStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const isTutor = turn.speaker === 'tutor';
  const hasFeedback = Boolean(turn.feedback && Object.keys(turn.feedback).length > 0);
  const hasGrammarErrors = turn.feedback?.grammar?.hasErrors;
  const clarityScore = turn.feedback?.pronunciation?.clarityScore;

  // Simple student-friendly translation or translation hint
  const simulatedTranslation = turn.translation || (
    turn.transcript.toLowerCase().includes('hola')
      ? 'Hello! I am your AI tutor. What would you like to speak about today?'
      : turn.transcript.toLowerCase().includes('por supuesto')
      ? 'Of course! Welcome. Do you prefer a table on the terrace or inside?'
      : turn.transcript.toLowerCase().includes('excelente')
      ? 'Excellent! I understand you perfectly. Would you like to continue?'
      : 'Translation helper: Listen closely to the words and practice repeating aloud!'
  );

  return (
    <div className={`flex gap-3.5 my-4 ${isTutor ? 'justify-start' : 'justify-end'} group animate-in fade-in`}>
      {/* Tutor Avatar */}
      {isTutor && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20 mt-1">
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Bubble Content */}
      <div className={`max-w-xl flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
            isTutor
              ? 'bg-dark-850 border border-white/10 text-gray-100 rounded-tl-sm'
              : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-sm shadow-brand-500/20'
          }`}
        >
          <p className="font-medium text-sm sm:text-base leading-relaxed">{turn.transcript}</p>

          {/* Optional Student English Translation for Tutor Speech */}
          {isTutor && showTranslation && (
            <div className="mt-2.5 pt-2.5 border-t border-white/10 text-xs text-brand-200 bg-brand-950/40 p-2.5 rounded-xl animate-in fade-in flex items-start gap-2">
              <span className="font-bold text-[10px] uppercase tracking-wider text-brand-300 bg-brand-500/20 px-1.5 py-0.5 rounded shrink-0">English</span>
              <p className="italic text-gray-200">{simulatedTranslation}</p>
            </div>
          )}

          {/* Corrected text inline preview if learner had a grammar mistake */}
          {!isTutor && hasGrammarErrors && turn.feedback.grammar.correctedText && (
            <div className="mt-2.5 pt-2.5 border-t border-white/20 text-xs text-brand-100 flex items-start gap-2 bg-white/5 p-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">💡 Better way to say this:</span>
                <span className="text-emerald-200 font-semibold">{turn.feedback.grammar.correctedText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Footnotes (Listen back / Slow audio / English Help / Feedback) */}
        <div className="flex flex-wrap items-center gap-2.5 mt-2 px-1 text-[11px] text-gray-400">
          <span>{new Date(turn.timestamp || turn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

          {isTutor && (
            <>
              {/* Listen at normal speed */}
              <button
                onClick={() => playTutorVoice(turn.transcript, 0.95)}
                className="flex items-center gap-1 text-gray-300 hover:text-brand-300 transition-colors bg-dark-800 px-2 py-0.5 rounded-lg border border-white/5"
                title="Listen to native pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Listen</span>
              </button>

              {/* Listen slower for 7th graders */}
              <button
                onClick={() => playTutorVoice(turn.transcript, 0.72)}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20"
                title="Listen at slower learner pace"
              >
                <span>🐢 Slower</span>
              </button>

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20"
                title="Show English meaning"
              >
                {showTranslation ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showTranslation ? 'Hide Meaning' : 'Show Meaning'}</span>
              </button>
            </>
          )}

          {!isTutor && clarityScore && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
              <Award className="w-3 h-3 text-emerald-400" />
              <span>{clarityScore}% Clarity</span>
            </span>
          )}

          {!isTutor && hasFeedback && (
            <button
              onClick={() => onShowFeedback(turn.feedback)}
              className="flex items-center gap-1 text-brand-300 hover:text-brand-200 transition-colors font-medium bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Coach Feedback</span>
            </button>
          )}
        </div>
      </div>

      {/* Learner Avatar */}
      {!isTutor && (
        <div className="w-10 h-10 rounded-2xl bg-dark-800 border border-white/10 flex items-center justify-center text-gray-300 shrink-0 mt-1 shadow-md">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
