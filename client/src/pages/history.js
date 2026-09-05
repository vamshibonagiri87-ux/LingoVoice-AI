import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  History,
  Search,
  Calendar,
  Clock,
  Mic,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Filter,
  Trash2,
  Eye
} from 'lucide-react';
import AppShell from '../components/AppShell/AppShell';
import api from '../services/api';

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [selectedMode, setSelectedMode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const modes = ['All', 'conversation', 'scenario', 'interview', 'pronunciation', 'challenge'];

  useEffect(() => {
    fetchSessions();
  }, [selectedMode]);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const modeParam = selectedMode !== 'All' ? `&mode=${selectedMode}` : '';
      const res = await api.get(`/sessions?limit=50${modeParam}`);
      if (res.data.success) {
        setSessions(res.data.data.sessions);
      }
    } catch (err) {
      console.error('[History] Fetch sessions error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const title = s.scenarioTitle || `${s.mode} session`;
    const summary = s.summary || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <History className="w-7 h-7 text-brand-400" />
            <span>Learning Session History</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review your past voice conversations, transcripts, and AI tutor evaluations.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past sessions by scenario or topic..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedMode === m
                    ? 'bg-brand-500 text-white'
                    : 'bg-dark-850 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Session List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-3xl glass-panel animate-pulse" />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="glass-panel rounded-3xl py-16 text-center text-gray-400 space-y-2">
            <History className="w-8 h-8 mx-auto text-gray-600" />
            <p className="font-semibold text-sm">No learning sessions found</p>
            <p className="text-xs text-gray-500">Completed sessions will appear here with full transcripts and feedback.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((s) => (
              <div
                key={s._id}
                onClick={() => router.push(`/conversation/${s._id}`)}
                className="glass-panel-interactive rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-brand-500/10 text-brand-400 mt-1">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                        {s.scenarioTitle || `${s.mode.charAt(0).toUpperCase() + s.mode.slice(1)} Session`}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-dark-800 text-brand-400 border border-white/5">
                        {s.targetLanguage}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {s.summary || 'Spoken session with AI language coach.'}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.round((s.duration || 60) / 60)} min duration
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  {s.overallFeedback?.speakingScore && (
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Score</span>
                      <span className="text-sm font-bold text-gradient-emerald">
                        {s.overallFeedback.speakingScore}%
                      </span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-dark-800 text-brand-300 group-hover:bg-brand-500 group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
