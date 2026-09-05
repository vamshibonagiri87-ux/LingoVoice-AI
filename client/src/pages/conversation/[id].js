import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Mic,
  ArrowLeft,
  Square,
  Sparkles,
  Bot,
  Award,
  BookOpen,
  Volume2,
  CheckCircle,
  TrendingUp,
  RotateCcw,
  Loader2,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AppShell from '../../components/AppShell/AppShell';
import ConversationPanel from '../../components/ConversationPanel/ConversationPanel';
import VoiceRecorder from '../../components/VoiceRecorder/VoiceRecorder';
import TutorFeedback from '../../components/TutorFeedback/TutorFeedback';
import { useConversationStore } from '../../store/conversationStore';
import { useAuthStore } from '../../store/authStore';

export default function ConversationPage() {
  const router = useRouter();
  const { id: sessionId } = router.query;
  const { user } = useAuthStore();

  const {
    session,
    turns,
    initSession,
    isLoadingSession,
    endCurrentSession,
    sessionSummary,
    activeFeedback,
    setActiveFeedback,
    cleanup,
    error
  } = useConversationStore();

  const [selectedTurnFeedback, setSelectedTurnFeedback] = useState(null);
  const [isEnding, setIsEnding] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    if (sessionId && user) {
      initSession(sessionId, user.id || user._id);
    }

    return () => {
      cleanup();
    };
  }, [sessionId, user, initSession, cleanup]);

  useEffect(() => {
    if (sessionSummary) {
      setShowSummaryModal(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [sessionSummary]);

  const handleEndSession = async () => {
    setIsEnding(true);
    const summary = await endCurrentSession();
    setIsEnding(false);
  };

  const feedbackToShow = selectedTurnFeedback || activeFeedback;

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <NextLink
              href="/learn"
              className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-400 hover:text-white border border-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </NextLink>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold text-white">
                  {session?.scenarioTitle || (session?.mode ? `${session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} Session` : 'Voice Studio')}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {session?.targetLanguage || 'Spanish'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Speak naturally in complete sentences</p>
            </div>
          </div>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            disabled={isEnding || turns.length < 2}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-850 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-gray-300 hover:text-rose-300 transition-all disabled:opacity-40"
          >
            {isEnding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Square className="w-3.5 h-3.5 fill-current" />
            )}
            <span>End Session & Evaluate</span>
          </button>
        </div>

        {/* Middle Conversation Turns Stream */}
        <div className="flex-1 min-h-0 relative my-2">
          <ConversationPanel onSelectFeedback={(fb) => setSelectedTurnFeedback(fb)} />
        </div>

        {/* Bottom Voice Recorder & Controls */}
        <div className="shrink-0 pt-3 border-t border-white/5 bg-dark-950/80 backdrop-blur-md">
          <VoiceRecorder />
        </div>

        {/* Turn-level Feedback Drawer */}
        {feedbackToShow && (
          <TutorFeedback
            feedback={feedbackToShow}
            onClose={() => {
              setSelectedTurnFeedback(null);
              setActiveFeedback(null);
            }}
          />
        )}

        {/* Session Completed Summary Modal */}
        {showSummaryModal && sessionSummary && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-brand-500/30 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-brand-500/30">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Session Completed! 🌟</h2>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                  {sessionSummary.summary || 'Great work completing your spoken language session!'}
                </p>
              </div>

              {/* Score Highlights */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 text-center">
                  <span className="text-[10px] text-gray-400 block">Speaking</span>
                  <span className="text-lg font-bold text-gradient-emerald">
                    {sessionSummary.speakingScore || 85}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 text-center">
                  <span className="text-[10px] text-gray-400 block">Pronunciation</span>
                  <span className="text-lg font-bold text-gradient-amber">
                    {sessionSummary.pronunciationScore || 88}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-dark-850 border border-white/5 text-center">
                  <span className="text-[10px] text-gray-400 block">Grammar</span>
                  <span className="text-lg font-bold text-gradient-brand">
                    {sessionSummary.grammarScore || 84}%
                  </span>
                </div>
              </div>

              {/* Personalized Tip */}
              {sessionSummary.personalizedTip && (
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs">
                  <span className="font-semibold text-brand-300 block mb-1">Coach Learning Tip:</span>
                  <p className="text-gray-200 leading-relaxed">{sessionSummary.personalizedTip}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <NextLink
                  href="/dashboard"
                  className="flex-1 py-3 rounded-2xl bg-dark-850 hover:bg-dark-800 text-center font-semibold text-xs text-gray-300 border border-white/5 transition-colors"
                >
                  Go to Dashboard
                </NextLink>
                <NextLink
                  href="/learn"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-center font-bold text-xs text-white shadow-lg shadow-brand-500/25 transition-all"
                >
                  Practice Another Mode
                </NextLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
