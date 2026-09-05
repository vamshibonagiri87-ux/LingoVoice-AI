import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Mic,
  Headphones,
  Sparkles,
  Zap,
  Globe,
  Volume2,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Smile,
  Gamepad2,
  BookOpen,
  HelpCircle,
  Play
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import voiceService from '../services/voice';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [demoState, setDemoState] = useState('idle'); // 'idle' | 'speaking' | 'tutor'
  const [demoStep, setDemoStep] = useState(0);

  const demoPhrases = [
    {
      user: '¡Hola! Quisiera pedir una mesa para dos personas.',
      tutor: '¡Por supuesto! Bienvenidos. ¿Prefieren una mesa en la terraza o adentro?',
      feedback: { clarity: '95%', grammar: 'Perfect!', vocab: 'quisiera pedir (Polite request)' }
    },
    {
      user: 'Prefiero en la terraza, gracias. ¿Cuál es el plato del día?',
      tutor: 'Hoy tenemos una deliciosa paella de mariscos y gazpacho andaluz.',
      feedback: { clarity: '92%', grammar: 'Great pacing', vocab: 'paella de mariscos' }
    }
  ];

  const triggerInteractiveDemo = () => {
    setDemoState('speaking');
    setTimeout(() => {
      setDemoState('tutor');
      // Speak tutor sentence
      voiceService.speakText(demoPhrases[demoStep].tutor, { language: 'es-ES', rate: 0.9 });
      setTimeout(() => {
        setDemoState('idle');
        setDemoStep((prev) => (prev + 1) % demoPhrases.length);
      }, 3500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col selection:bg-brand-500 selection:text-white transition-colors">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl text-white tracking-tight">LingoVoice</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">AI</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <NextLink
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          ) : (
            <>
              <NextLink
                href="/login"
                className="text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
              >
                Sign In
              </NextLink>
              <NextLink
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </NextLink>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Glowing Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Judgment-Free Interactive Voice Practice for Everyone</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
          Speak Any Language with your <span className="text-gradient-brand">Personal AI Voice Tutor</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
          Master Spanish, French, German, Japanese, and English through natural, low-pressure voice conversations. Perfect for middle school students, beginners, and lifelong learners!
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <NextLink
            href="/register"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-base shadow-xl shadow-brand-500/30 transition-all transform hover:-translate-y-1"
          >
            <Mic className="w-5 h-5" />
            <span>Start Speaking Now — Free 🚀</span>
          </NextLink>

          <button
            onClick={triggerInteractiveDemo}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-dark-850 hover:bg-dark-800 text-gray-200 font-semibold text-base border border-white/10 transition-all transform hover:-translate-y-1"
          >
            <Volume2 className="w-5 h-5 text-brand-accent" />
            <span>Hear Sample Voice Turn 🔊</span>
          </button>
        </div>

        {/* Interactive Voice Simulator Card */}
        <div className="mt-16 w-full max-w-3xl glass-panel rounded-3xl p-6 md:p-8 text-left border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-gray-300">Live Voice Learning Simulation</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Scenario: Restaurant Ordering 🇪🇸
            </span>
          </div>

          <div className="my-6 space-y-4">
            {/* User Voice Turn */}
            <div className={`p-4 rounded-2xl bg-dark-800/80 border border-white/5 transition-all ${demoState === 'speaking' ? 'ring-2 ring-brand-500 bg-brand-500/10' : ''}`}>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="font-semibold text-brand-300">Learner Voice:</span>
                {demoState === 'speaking' && <span className="text-brand-400 font-medium animate-pulse">● Listening...</span>}
              </div>
              <p className="text-sm font-medium text-white italic">
                &ldquo;{demoPhrases[demoStep].user}&rdquo;
              </p>
            </div>

            {/* AI Tutor Spoken Turn */}
            <div className={`p-4 rounded-2xl bg-brand-600/15 border border-brand-500/30 transition-all ${demoState === 'tutor' ? 'ring-2 ring-brand-accent bg-brand-accent/10' : ''}`}>
              <div className="flex items-center justify-between text-xs text-brand-300 mb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-brand-accent" /> AI Tutor Response:
                </span>
                {demoState === 'tutor' && <span className="text-brand-accent font-medium animate-pulse">Speaking...</span>}
              </div>
              <p className="text-sm font-medium text-gray-100">
                &ldquo;{demoPhrases[demoStep].tutor}&rdquo;
              </p>
            </div>
          </div>

          {/* Feedback Pills */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Clarity: {demoPhrases[demoStep].feedback.clarity}
              </span>
              <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">
                Grammar: {demoPhrases[demoStep].feedback.grammar}
              </span>
            </div>
            <button
              onClick={triggerInteractiveDemo}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              Simulate Next Turn <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 🎓 Perfect for Students & Beginners Section */}
      <section className="py-16 px-6 lg:px-12 bg-dark-900/60 border-y border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              Student & Beginner Friendly
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Designed for Easy, Stress-Free Learning
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              No scary tests or awkward pauses. LingoVoice AI gives students a friendly AI buddy to practice languages anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-400 flex items-center justify-center font-bold text-xl">
                🗣️
              </div>
              <h3 className="font-bold text-base text-white">Never Get Stuck</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Click prompt chips if you don&apos;t know what to say, or tap &ldquo;Show Meaning&rdquo; to see English translations instantly.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold text-xl">
                🐢
              </div>
              <h3 className="font-bold text-base text-white">Learn at Your Pace</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Slow down audio playback anytime (0.75x) to hear tricky syllables and pronounce words with crisp confidence.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xl">
                🔥
              </div>
              <h3 className="font-bold text-base text-white">Earn XP & Streaks</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Practice 5-15 minutes a day, complete fun daily speaking challenges, and celebrate your milestones with confetti!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 lg:px-12 border-t border-white/5 bg-dark-950 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-gray-300">LingoVoice AI</span>
            <span>— The Full-Stack AI Voice Language Tutor</span>
          </div>
          <p>© {new Date().getFullYear()} LingoVoice AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
