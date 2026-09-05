import { useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  Clock,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BarChart3
} from 'lucide-react';
import AppShell from '../components/AppShell/AppShell';
import ProgressChart from '../components/ProgressChart/ProgressChart';
import SkillRadar from '../components/ProgressChart/SkillRadar';
import { useLearnerStore } from '../store/learnerStore';
import { useAuthStore } from '../store/authStore';

export default function ProgressPage() {
  const { user } = useAuthStore();
  const { progress, fetchProgress, history, fetchHistory, insights, fetchInsights } = useLearnerStore();

  useEffect(() => {
    fetchProgress();
    fetchHistory(14);
    fetchInsights();
  }, [fetchProgress, fetchHistory, fetchInsights]);

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-brand-400" />
            <span>Progress & Skill Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track your speaking milestones, vocabulary expansion, and AI-detected growth patterns.
          </p>
        </div>

        {/* Top Analytics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl glass-panel">
            <span className="text-xs text-gray-400 font-medium block">Current Streak</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white">{progress?.streak || user?.currentStreak || 1}</span>
              <span className="text-xs text-amber-400 font-semibold">Days 🔥</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel">
            <span className="text-xs text-gray-400 font-medium block">Total Spoken Time</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white">{progress?.totalPracticeMinutes || 0}</span>
              <span className="text-xs text-brand-400 font-semibold">Minutes</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel">
            <span className="text-xs text-gray-400 font-medium block">Sessions Finished</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white">{progress?.totalSessions || 0}</span>
              <span className="text-xs text-emerald-400 font-semibold">Sessions</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel">
            <span className="text-xs text-gray-400 font-medium block">Vocabulary Size</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white">{progress?.totalVocabulary || 0}</span>
              <span className="text-xs text-cyan-400 font-semibold">Saved Terms</span>
            </div>
          </div>
        </div>

        {/* Skill Progression & Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-400" />
                <span>Skill Mastery Breakdown</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Multi-dimensional evaluation across spoken turns</p>
            </div>
            <ProgressChart skills={progress?.skills || {}} />
          </div>

          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Speaking Growth Trajectory</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Session-by-session performance progress</p>
            </div>
            <SkillRadar history={history} />
          </div>
        </div>

        {/* Recurring Mistake Patterns & AI Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recurring Patterns */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Recurring Mistake Detection</span>
            </h2>
            <p className="text-xs text-gray-400">Identified areas where subtle patterns reoccur during live voice turns.</p>

            <div className="space-y-3">
              {insights?.recurringMistakes?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>{item.pattern}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">{item.category}</span>
                  </div>
                  <p className="text-gray-300">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tutor Recommendations */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
              <span>Tailored Next Steps</span>
            </h2>
            <p className="text-xs text-gray-400">Personalized pedagogical plan crafted by the Progress Agent.</p>

            <div className="space-y-3">
              {insights?.recommendations?.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-xs">
                  <span className="font-bold text-emerald-300 text-sm block">{rec.title}</span>
                  <p className="text-gray-300">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
