import { useEffect, useRef } from 'react';
import { Bot, Loader2, Sparkles, HelpCircle, Volume2, MessageSquare, Lightbulb } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useConversationStore } from '../../store/conversationStore';

export default function ConversationPanel({ onSelectFeedback }) {
  const { turns, recordingState, session, sendMessage, playTutorVoice } = useConversationStore();
  const bottomRef = useRef(null);

  const isTutorResponding = recordingState === 'responding';
  const targetLang = session?.targetLanguage || 'Spanish';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isTutorResponding]);

  // Student Quick Prompt Suggestions based on target language
  const promptSuggestions = targetLang === 'Spanish' ? [
    { text: '¡Hola! ¿Cómo estás hoy?', meaning: 'Hello! How are you today?' },
    { text: '¿Puedes hablar un poco más despacio?', meaning: 'Can you speak a bit slower?' },
    { text: 'Me gusta aprender idiomas en mi escuela.', meaning: 'I like learning languages at my school.' },
    { text: '¿Qué me recomiendas hacer hoy?', meaning: 'What do you recommend I do today?' }
  ] : targetLang === 'French' ? [
    { text: 'Bonjour! Comment allez-vous?', meaning: 'Hello! How are you?' },
    { text: 'Pouvez-vous parler plus lentement?', meaning: 'Can you speak slower?' },
    { text: 'J’aime apprendre le français.', meaning: 'I like learning French.' },
    { text: 'Que recommandez-vous aujourd’hui?', meaning: 'What do you recommend today?' }
  ] : [
    { text: 'Hello! How are you doing today?', meaning: 'Friendly greeting' },
    { text: 'Can you explain this again please?', meaning: 'Asking for clarification' },
    { text: 'I would like to practice speaking about my hobbies.', meaning: 'Topic choice' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-3 max-h-[60vh] min-h-[380px]">
      {turns.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600/30 to-brand-accent/20 border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/10">
            <Sparkles className="w-8 h-8 text-brand-400" />
          </div>

          <div className="max-w-md">
            <h3 className="text-base font-bold text-white">Your AI Voice Coach is Ready! 🎙️</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Don&apos;t worry about mistakes—this is a friendly, judgment-free space to practice speaking {targetLang}.
            </p>
          </div>

          {/* Student 3-Step Guide */}
          <div className="grid grid-cols-3 gap-2 max-w-lg w-full text-left pt-2">
            <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">STEP 1</span>
              <p className="text-[11px] font-semibold text-gray-200">Tap the Big Mic</p>
              <p className="text-[10px] text-gray-400">Speak your phrase clearly</p>
            </div>
            <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">STEP 2</span>
              <p className="text-[11px] font-semibold text-gray-200">Listen to Coach</p>
              <p className="text-[10px] text-gray-400">Hear native audio replay</p>
            </div>
            <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">STEP 3</span>
              <p className="text-[11px] font-semibold text-gray-200">See AI Feedback</p>
              <p className="text-[10px] text-gray-400">Grammar & clarity tips</p>
            </div>
          </div>
        </div>
      ) : (
        turns.map((turn, index) => (
          <MessageBubble
            key={turn._id || `turn-${index}`}
            turn={turn}
            onShowFeedback={(fb) => onSelectFeedback?.(fb)}
          />
        ))
      )}

      {/* AI Tutor Formulating Response */}
      {isTutorResponding && (
        <div className="flex items-center gap-3 my-4 animate-in fade-in">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div className="px-5 py-3.5 rounded-2xl bg-dark-850 border border-brand-500/30 text-xs text-gray-200 flex items-center gap-2.5 shadow-lg shadow-brand-500/10">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>AI Tutor is listening and crafting friendly spoken coaching...</span>
          </div>
        </div>
      )}

      {/* Student Prompt Helper Chips (Click to speak/fill) */}
      {turns.length > 0 && !isTutorResponding && (
        <div className="pt-2 pb-1">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Not sure what to say? Click a quick phrase:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(item.text)}
                className="text-left px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-brand-500/20 text-gray-300 hover:text-white border border-white/10 hover:border-brand-500/40 text-xs transition-all group flex items-center gap-2"
              >
                <span className="font-semibold text-brand-300 group-hover:text-white">&ldquo;{item.text}&rdquo;</span>
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300 italic hidden sm:inline">({item.meaning})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
