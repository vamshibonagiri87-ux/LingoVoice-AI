import { useState } from 'react';
import { useRouter } from 'next/router';
import { Mic, ArrowRight, BookOpen, Users, Compass, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function ScenarioCard({ scenario }) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const res = await api.post(`/scenarios/${scenario._id}/start`);
      if (res.data.success) {
        const sessionId = res.data.data.session._id;
        router.push(`/conversation/${sessionId}`);
      }
    } catch (err) {
      console.error('[ScenarioCard] Failed to start scenario session:', err);
      setIsStarting(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Elementary':
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      case 'Intermediate':
        return 'bg-brand-500/15 text-brand-300 border-brand-500/30';
      case 'Upper Intermediate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Advanced':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="glass-panel-interactive rounded-3xl p-6 flex flex-col justify-between group">
      <div>
        {/* Category & Difficulty Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            {scenario.category}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getDifficultyColor(scenario.difficulty)}`}>
            {scenario.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
          {scenario.title}
        </h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
          {scenario.description}
        </p>

        {/* Roles */}
        {scenario.role && (
          <div className="mt-4 p-3 rounded-2xl bg-dark-850/60 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-4 h-4 text-brand-accent shrink-0" />
              <span>You: <strong className="text-white">{scenario.role.userRole}</strong></span>
            </div>
            <span className="text-[11px] text-gray-400">AI: {scenario.role.tutorRole}</span>
          </div>
        )}

        {/* Target Vocabulary Chips */}
        {scenario.vocabulary && scenario.vocabulary.length > 0 && (
          <div className="mt-4">
            <span className="text-[11px] text-gray-400 font-medium block mb-1.5">Key Vocabulary:</span>
            <div className="flex flex-wrap gap-1.5">
              {scenario.vocabulary.slice(0, 3).map((v, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-gray-300 border border-white/5"
                >
                  {v.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-brand-400 font-medium">{scenario.targetLanguage || 'Spanish'}</span>
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all transform group-hover:translate-x-1"
        >
          {isStarting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Starting...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Start Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
