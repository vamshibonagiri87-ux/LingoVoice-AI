import { useState, useEffect } from 'react';
import { Compass, Search, Filter, Sparkles, Globe, BookOpen } from 'lucide-react';
import AppShell from '../../components/AppShell/AppShell';
import ScenarioCard from '../../components/ScenarioCard/ScenarioCard';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ScenariosPage() {
  const { user, profile } = useAuthStore();
  const [scenarios, setScenarios] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'School & Daily Life', 'Dining', 'Travel', 'Social', 'Career & Work', 'Health'];
  const difficulties = ['All', 'Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'];

  useEffect(() => {
    fetchScenarios();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const fetchScenarios = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        const catParam = selectedCategory === 'School & Daily Life' ? 'Education' : selectedCategory;
        params.append('category', catParam);
      }
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/scenarios?${params.toString()}`);
      if (res.data.success) {
        setScenarios(res.data.data);
      }
    } catch (err) {
      console.error('[Scenarios] Failed to fetch scenarios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const targetLang = profile?.targetLanguage || user?.targetLanguage || 'Spanish';

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Compass className="w-7 h-7 text-brand-400" />
              <span>Real-World Roleplay Scenarios</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Step into fun, authentic situations like ordering pizza, chatting with an exchange student, or exploring a city in {targetLang}!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/20">
              Target Language: {targetLang}
            </span>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenarios (e.g. cafe, school, travel, doctor)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by Difficulty"
              className="px-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs font-bold text-gray-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-dark-900">Difficulty: {d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'bg-dark-850 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scenarios Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-3xl glass-panel animate-pulse p-6" />
            ))}
          </div>
        ) : scenarios.length === 0 ? (
          <div className="glass-panel rounded-3xl py-16 text-center text-gray-400 space-y-2">
            <Compass className="w-8 h-8 mx-auto text-gray-600" />
            <p className="font-semibold text-sm">No matching scenarios found</p>
            <p className="text-xs text-gray-500">Try adjusting your category filter or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario._id} scenario={scenario} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
