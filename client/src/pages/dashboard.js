import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Mic,
  Flame,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
  Calendar,
  Compass,
  Zap,
  Play,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import AppShell from '../components/AppShell/AppShell';
import ProgressChart from '../components/ProgressChart/ProgressChart';
import { useAuthStore } from '../store/authStore';
import { useLearnerStore } from '../store/learnerStore';
import api from '../services/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const { progress, fetchProgress, history, fetchHistory } = useLearnerStore();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [isStartingFreeConv, setIsStartingFreeConv] = useState(false);

  useEffect(() => {
    fetchProgress();
    fetchHistory(7);

    // Fetch daily challenge
    api.get('/practice/daily-challenge').then((res) => {
      if (res.data.success) setDailyChallenge(res.data.data);
    }).catch((e) => {});

    // Fetch recent sessions
    api.get('/sessions?limit=4').then((res) => {
      if (res.data.success) setRecentSessions(res.data.data.sessions);
    }).catch((e) => {});
  }, [fetchProgress, fetchHistory]);

  const handleStartFreeConversation = async () => {
    setIsStartingFreeConv(true);
    try {
      const res = await api.post('/sessions', {
        mode: 'conversation',
        targetLanguage: profile?.targetLanguage || user?.targetLanguage || 'Spanish'
      });
      if (res.data.success) {
        router.push(`/conversation/${res.data.data.session._id}`);
      }
    } catch (err) {
      console.error('[Dashboard] Start conversation error:', err);
      setIsStartingFreeConv(false);
    }
  };

  const currentStreak = progress?.streak || user?.currentStreak || 1;
  const targetLang = profile?.targetLanguage || user?.targetLanguage || 'Spanish';
  const userName = user?.name ? user.name.split(' ')[0] : 'Learner';

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Welcome & Primary CTA Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-brand-900/90 via-dark-850 to-dark-900 border border-brand-500/25 shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-500/15 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Ready for today&apos;s voice practice</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              ¡Hola, {userName}! 🎙️
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
              Your personal AI voice coach is ready to practice speaking <strong className="text-white font-bold">{targetLang}</strong> with you. Practice for just a few minutes to grow your daily streak!
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartFreeConversation}
                disabled={isStartingFreeConv}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-brand-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Mic className="w-4 h-4" />
                <span>{isStartingFreeConv ? 'Starting Studio...' : 'Start Voice Conversation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <NextLink
                href="/scenarios"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-dark-800 hover:bg-dark-750 text-gray-200 text-xs font-semibold border border-white/10 transition-all"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Roleplay Scenarios</span>
              </NextLink>
            </div>
          </div>
        </div>

        {/* Student Quick Start Guide: 3 Steps to Practice */}
        <div className="p-5 sm:p-6 rounded-3xl bg-dark-850/90 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Quick Practice Guide: 3 Easy Steps</span>
            </h2>
            <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">Beginner & Student Friendly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-dark-900/80 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 font-extrabold text-xs flex items-center justify-center">1</span>
                <h3 className="text-xs font-bold text-white">Pick a Fun Topic</h3>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Choose Free Conversation or a Scenario like ordering pizza or asking directions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900/80 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs flex items-center justify-center">2</span>
                <h3 className="text-xs font-bold text-white">Speak Naturally</h3>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Tap the big mic and speak. The AI listens, responds, and provides instant coaching!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900/80 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs flex items-center justify-center">3</span>
                <h3 className="text-xs font-bold text-white">Level Up Your Fluency</h3>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Earn XP points, maintain your streak, and watch your pronunciation score climb.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl glass-panel space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium">Daily Streak</span>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{currentStreak}</span>
              <span className="text-xs text-amber-400 font-semibold">Days Active 🔥</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium">Practice Time</span>
              <Clock className="w-5 h-5 text-brand-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress?.totalPracticeMinutes || 0}</span>
              <span className="text-xs text-gray-400 font-semibold">Minutes</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium">Spoken Sessions</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress?.totalSessions || 0}</span>
              <span className="text-xs text-emerald-400 font-semibold">Completed</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium">Words Learned</span>
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress?.totalVocabulary || 0}</span>
              <span className="text-xs text-cyan-400 font-semibold">Saved Terms</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Skills & Daily Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Skill Radar & Progress Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-400" />
                    <span>Speaking Skill Breakdown</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Pronunciation clarity, grammar structure, and fluency</p>
                </div>
                <NextLink href="/progress" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                  Full Analytics <ArrowRight className="w-3.5 h-3.5" />
                </NextLink>
              </div>

              <ProgressChart skills={progress?.skills || {}} />
            </div>

            {/* Recent Sessions */}
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>Recent Spoken Sessions</span>
                </h3>
                <NextLink href="/history" className="text-xs text-gray-400 hover:text-white font-medium">
                  View all
                </NextLink>
              </div>

              {recentSessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No sessions yet. Tap &ldquo;Start Voice Conversation&rdquo; above to begin speaking!
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentSessions.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => router.push(`/conversation/${s._id}`)}
                      className="py-3 px-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-200">
                            {s.scenarioTitle || `${s.mode.charAt(0).toUpperCase() + s.mode.slice(1)} Session`}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {Math.round((s.duration || 60) / 60)} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brand-300 font-semibold">
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Daily Challenge & Recommended Mode */}
          <div className="space-y-6">
            {/* Daily Speaking Challenge */}
            <div className="rounded-3xl p-6 glass-panel border border-amber-500/30 relative overflow-hidden bg-gradient-to-b from-amber-950/30 to-dark-900">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Daily Challenge
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                  {dailyChallenge?.targetMinutes || 1} min speaking
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {dailyChallenge?.title || 'Describe Your Morning Routine'}
              </h3>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed italic bg-dark-850/80 p-3 rounded-2xl border border-white/5">
                &ldquo;{dailyChallenge?.prompt || 'Habla durante 60 segundos sobre tu rutina de la mañana...'}&rdquo;
              </p>

              {dailyChallenge?.keyVocabulary && (
                <div className="mt-4">
                  <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">Target Words:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dailyChallenge.keyVocabulary.map((word, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <NextLink
                href="/practice"
                className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Daily Challenge (+50 XP)</span>
              </NextLink>
            </div>

            {/* Quick Practice Modes Widget */}
            <div className="glass-panel rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Practice Modes</h3>
              
              {[
                { title: 'Free Conversation', href: '/learn', icon: Mic, color: 'text-brand-400', desc: 'Open-ended chat' },
                { title: 'Scenario Roleplay', href: '/scenarios', icon: Compass, color: 'text-cyan-400', desc: 'Real-world situations' },
                { title: 'Pronunciation Studio', href: '/practice', icon: Volume2, color: 'text-emerald-400', desc: 'Sound-it-out drills' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <NextLink
                    key={m.title}
                    href={m.href}
                    className="p-3 rounded-2xl bg-dark-850/80 hover:bg-dark-800 border border-white/5 flex items-center justify-between text-xs font-medium text-gray-200 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${m.color}`} />
                      <div>
                        <span className="block font-bold text-white">{m.title}</span>
                        <span className="text-[10px] text-gray-400">{m.desc}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </NextLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
