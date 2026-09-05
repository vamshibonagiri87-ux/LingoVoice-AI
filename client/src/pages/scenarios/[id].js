import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Compass,
  ArrowLeft,
  Mic,
  Users,
  Target,
  BookOpen,
  Sparkles,
  ArrowRight,
  Loader2,
  Volume2
} from 'lucide-react';
import AppShell from '../../components/AppShell/AppShell';
import api from '../../services/api';
import voiceService from '../../services/voice';

export default function ScenarioDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [scenario, setScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/scenarios/${id}`)
        .then((res) => {
          if (res.data.success) setScenario(res.data.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const res = await api.post(`/scenarios/${id}/start`);
      if (res.data.success) {
        const sessionId = res.data.data.session._id;
        router.push(`/conversation/${sessionId}`);
      }
    } catch (err) {
      console.error(err);
      setIsStarting(false);
    }
  };

  const playWordAudio = (word) => {
    const langCode = scenario?.targetLanguage === 'French' ? 'fr-FR' : 'es-ES';
    voiceService.speakText(word, { language: langCode, rate: 0.85 });
  };

  if (isLoading || !scenario) {
    return (
      <AppShell>
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <NextLink
          href="/scenarios"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all scenarios
        </NextLink>

        {/* Scenario Header Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden border border-brand-500/20">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> {scenario.category}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold">
              {scenario.difficulty} Level
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {scenario.title}
          </h1>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed max-w-2xl">
            {scenario.description}
          </p>

          {/* Roleplay Persona Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-dark-850/80 border border-white/5 space-y-1">
              <span className="text-[11px] font-bold text-brand-accent block uppercase">Your Role 🗣️</span>
              <p className="text-sm font-bold text-white">{scenario.role?.userRole || 'Student / Learner'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850/80 border border-white/5 space-y-1">
              <span className="text-[11px] font-bold text-brand-400 block uppercase">AI Coach Persona 🤖</span>
              <p className="text-sm font-bold text-white">{scenario.role?.tutorRole || 'Helpful Local Conversationalist'}</p>
            </div>
          </div>

          {/* Start CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Language: {scenario.targetLanguage || 'Spanish'}</span>
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Starting Roleplay...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Begin Voice Roleplay 🚀</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Objectives & Target Vocabulary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objectives */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>What You Will Practice</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {scenario.objectives?.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vocabulary with Sound Buttons */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Key Words to Use (Click to Listen 🔊)</span>
            </h3>
            <div className="space-y-2.5">
              {scenario.vocabulary?.map((v, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-cyan-300">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{v.word}</span>
                      <button
                        onClick={() => playWordAudio(v.word)}
                        className="p-1 text-cyan-400 hover:text-white hover:bg-cyan-500/20 rounded-md transition-colors"
                        title="Hear pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400 font-normal">{v.translation}</span>
                  </div>
                  {v.context && (
                    <p className="text-[11px] text-gray-400 mt-1 italic">&ldquo;{v.context}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
