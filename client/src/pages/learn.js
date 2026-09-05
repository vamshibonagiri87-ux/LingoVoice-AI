import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Mic,
  Compass,
  Award,
  Volume2,
  Flame,
  ArrowRight,
  Sparkles,
  Play,
  Loader2,
  Globe
} from 'lucide-react';
import AppShell from '../components/AppShell/AppShell';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function LearnPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.targetLanguage || user?.targetLanguage || 'Spanish');
  const [isLaunching, setIsLaunching] = useState(null);

  const startSession = async (mode, extra = {}) => {
    setIsLaunching(mode);
    try {
      const res = await api.post('/sessions', {
        mode,
        targetLanguage: selectedLanguage,
        ...extra
      });
      if (res.data.success) {
        router.push(`/conversation/${res.data.data.session._id}`);
      }
    } catch (err) {
      console.error('[Learn] Failed to start session:', err);
      setIsLaunching(null);
    }
  };

  const learningModes = [
    {
      id: 'conversation',
      title: 'Free Conversation',
      subtitle: 'Open-ended natural spoken dialogue with AI',
      desc: 'Talk freely about everyday topics, your hobbies, weekend plans, or opinions. The AI tutor listens, responds, and adapts difficulty dynamically.',
      icon: Mic,
      gradient: 'from-brand-600 via-brand-500 to-indigo-500',
      actionText: 'Launch Conversation',
      badge: 'Spontaneous Speech'
    },
    {
      id: 'scenario',
      title: 'Scenario Role-Play',
      subtitle: 'Real-world simulation dialogues',
      desc: 'Step into real-life situations: ordering food at a Spanish tapas bar, checking in at the airport, asking for hotel amenities, and medical inquiries.',
      icon: Compass,
      gradient: 'from-cyan-600 via-teal-500 to-emerald-500',
      actionText: 'Browse Scenarios',
      customHref: '/scenarios',
      badge: 'Contextual Practice'
    },
    {
      id: 'interview',
      title: 'Interview Simulation',
      subtitle: 'Career & academic interview preparation',
      desc: 'Simulate high-stakes job or university admissions interviews. Practice articulating accomplishments, problem-solving, and career ambitions.',
      icon: Award,
      gradient: 'from-purple-600 via-indigo-600 to-brand-500',
      actionText: 'Start Interview',
      badge: 'Career & Academic'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Studio',
      subtitle: 'Phonetic precision & repetition drills',
      desc: 'Sharpen tricky phonemes, syllable cadence, and vowel sounds. Repeat targeted drills and receive real-time clarity feedback.',
      icon: Volume2,
      gradient: 'from-amber-600 via-orange-500 to-rose-500',
      actionText: 'Open Studio',
      customHref: '/practice',
      badge: 'Phonetic Accuracy'
    },
    {
      id: 'challenge',
      title: 'Daily Speaking Challenge',
      subtitle: '60-to-120 second quick challenge',
      desc: 'Speak continuously on a randomized daily theme. Complete daily challenges to grow your streak and build spontaneous fluency.',
      icon: Flame,
      gradient: 'from-rose-600 via-pink-500 to-amber-500',
      actionText: 'Start Daily Challenge',
      customHref: '/practice',
      badge: 'Streak Builder'
    }
  ];

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header with Language Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Voice Learning Studio</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                5 Modes
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Select your preferred speaking mode to begin practice with your AI language coach.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-dark-850 p-1.5 rounded-2xl border border-white/10">
            <Globe className="w-4 h-4 text-brand-accent ml-2" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Select Target Language"
              className="bg-transparent text-xs font-semibold text-white px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="Spanish" className="bg-dark-900">Spanish 🇪🇸</option>
              <option value="French" className="bg-dark-900">French 🇫🇷</option>
              <option value="German" className="bg-dark-900">German 🇩🇪</option>
              <option value="Japanese" className="bg-dark-900">Japanese 🇯🇵</option>
              <option value="English" className="bg-dark-900">English 🇺🇸</option>
              <option value="Italian" className="bg-dark-900">Italian 🇮🇹</option>
            </select>
          </div>
        </div>

        {/* Learning Modes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningModes.map((mode) => {
            const Icon = mode.icon;
            const isLoading = isLaunching === mode.id;

            return (
              <div
                key={mode.id}
                className="glass-panel-interactive rounded-3xl p-6 md:p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${mode.gradient} text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-dark-850 text-gray-300 border border-white/5">
                      {mode.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-xs font-medium text-brand-400 mt-0.5">{mode.subtitle}</p>

                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Ready in {selectedLanguage}</span>

                  {mode.customHref ? (
                    <NextLink
                      href={mode.customHref}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-white font-semibold text-xs border border-white/10 transition-all transform group-hover:translate-x-1"
                    >
                      <span>{mode.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </NextLink>
                  ) : (
                    <button
                      onClick={() => startSession(mode.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all transform group-hover:translate-x-1 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Starting...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{mode.actionText}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
