import { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Globe,
  Award,
  Clock,
  Cpu,
  Volume2,
  CheckCircle,
  Save,
  Loader2,
  Sparkles,
  AlertCircle,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import AppShell from '../components/AppShell/AppShell';
import api from '../services/api';
import voiceService from '../services/voice';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function SettingsPage() {
  const { user, profile, updateUserProfile, setProfile } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nativeLanguage: profile?.nativeLanguage || user?.nativeLanguage || 'English',
    targetLanguage: profile?.targetLanguage || user?.targetLanguage || 'Spanish',
    proficiencyLevel: profile?.proficiencyLevel || user?.proficiencyLevel || 'Beginner',
    dailyTargetMinutes: profile?.dailyTargetMinutes || 15
  });

  const [speechSpeed, setSpeechSpeed] = useState('0.9');
  const [healthStatus, setHealthStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        name: user.name || '',
        nativeLanguage: profile.nativeLanguage || user.nativeLanguage || 'English',
        targetLanguage: profile.targetLanguage || user.targetLanguage || 'Spanish',
        proficiencyLevel: profile.proficiencyLevel || user.proficiencyLevel || 'Beginner',
        dailyTargetMinutes: profile.dailyTargetMinutes || 15
      });
    }

    // Fetch health status
    api.get('/health')
      .then((res) => {
        if (res.data.success) setHealthStatus(res.data);
      })
      .catch((e) => console.warn(e));
  }, [user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserProfile(formData);
      const profileRes = await api.put('/profile', formData);
      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const testVoiceSynthesis = (rateMultiplier = 0.9) => {
    setTestAudioPlaying(true);
    const greeting =
      formData.targetLanguage === 'Spanish'
        ? '¡Hola! La síntesis de voz en español está funcionando perfectamente. ¡Buen trabajo!'
        : formData.targetLanguage === 'French'
        ? 'Bonjour! La synthèse vocale en français fonctionne parfaitement. Bon travail!'
        : 'Hello! Your AI voice tutor audio playback is operating normally. Great job!';

    voiceService.speakText(greeting, {
      language: formData.targetLanguage === 'Spanish' ? 'es-ES' : formData.targetLanguage === 'French' ? 'fr-FR' : 'en-US',
      rate: parseFloat(speechSpeed) || rateMultiplier,
      onEnd: () => setTestAudioPlaying(false),
      onError: () => setTestAudioPlaying(false)
    });
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7 text-brand-400" />
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Customize your learning goals, speech speed, and check AI voice diagnostics.
          </p>
        </div>

        {/* Profile Settings Form */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" />
              <span>Learner Profile</span>
            </h2>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle className="w-4 h-4" /> Changes saved successfully! 🎉
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Your Native Language</label>
                <select
                  value={formData.nativeLanguage}
                  onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="English">English 🇺🇸</option>
                  <option value="Spanish">Spanish 🇪🇸</option>
                  <option value="French">French 🇫🇷</option>
                  <option value="German">German 🇩🇪</option>
                  <option value="Japanese">Japanese 🇯🇵</option>
                  <option value="Italian">Italian 🇮🇹</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Language to Practice</label>
                <select
                  value={formData.targetLanguage}
                  onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="Spanish">Spanish 🇪🇸</option>
                  <option value="French">French 🇫🇷</option>
                  <option value="German">German 🇩🇪</option>
                  <option value="Japanese">Japanese 🇯🇵</option>
                  <option value="English">English 🇺🇸</option>
                  <option value="Italian">Italian 🇮🇹</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Speaking Level</label>
                <select
                  value={formData.proficiencyLevel}
                  onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="Beginner">🌱 Starter (A1)</option>
                  <option value="Elementary">🌿 Elementary (A2)</option>
                  <option value="Intermediate">🚀 Conversational (B1)</option>
                  <option value="Upper Intermediate">⭐ Confident (B2)</option>
                  <option value="Advanced">🏆 Fluent (C1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Daily Goal (Minutes per day)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={formData.dailyTargetMinutes}
                  onChange={(e) => setFormData({ ...formData, dailyTargetMinutes: parseInt(e.target.value, 10) || 15 })}
                  className="w-full px-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Interface Theme (Light vs Dark) */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Color Theme & Appearance</span>
                </label>
                <span className="text-xs font-bold text-brand-300">
                  {theme === 'dark' ? '🌙 Dark Theme' : '☀️ Light Theme'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  key="dark"
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    theme === 'dark'
                      ? 'bg-brand-500/20 border-brand-500 text-white shadow-md shadow-brand-500/20 ring-2 ring-brand-500'
                      : 'bg-dark-900 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-dark-950 border border-white/10 flex items-center justify-center text-amber-300">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">Dark Mode 🌙</span>
                    <span className="text-[10px] text-gray-400">Deep luxury dark background</span>
                  </div>
                </button>

                <button
                  key="light"
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    theme === 'light'
                      ? 'bg-brand-500/20 border-brand-500 text-white shadow-md shadow-brand-500/20 ring-2 ring-brand-500'
                      : 'bg-dark-900 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-500">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">Light Mode ☀️</span>
                    <span className="text-[10px] text-gray-400">Clean bright modern background</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Audio Speech Speed Slider / Selector */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-400" />
                  <span>AI Tutor Speech Speed</span>
                </label>
                <span className="text-xs font-bold text-brand-300">
                  {speechSpeed === '0.75' ? '🐢 Slower (0.75x)' : speechSpeed === '0.9' ? '🚀 Standard (0.9x)' : '⚡ Fast (1.0x)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '0.75', label: '🐢 Slower (0.75x)' },
                  { value: '0.9', label: '🚀 Standard (0.9x)' },
                  { value: '1.0', label: '⚡ Native (1.0x)' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSpeechSpeed(item.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      speechSpeed === item.value
                        ? 'bg-brand-500 text-white border-brand-400 shadow-sm'
                        : 'bg-dark-900 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Audio Speaker & Voice Diagnostics */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Sound & AI Engine Diagnostics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
              <span className="text-gray-400 font-semibold block">AI Tutor Engine</span>
              <p className="font-bold text-white">
                {healthStatus?.aiProvider?.provider || 'Deterministic Adaptive Multi-Agent Pipeline'}
              </p>
              <span className="text-[11px] text-brand-300 block">
                Status: Operational & Ready
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
              <span className="text-gray-400 font-semibold block">Database Connection</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="font-bold text-white capitalize">{healthStatus?.database?.status || 'Connected'}</p>
              </div>
              <span className="text-[11px] text-gray-400 block">Session & Progress Records Synced</span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 font-semibold block">Speaker & Sound Test</span>
                <p className="font-bold text-white">Native Voice Synthesizer</p>
              </div>
              <button
                type="button"
                onClick={() => testVoiceSynthesis()}
                disabled={testAudioPlaying}
                className="mt-2 w-fit px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>{testAudioPlaying ? 'Playing Sound...' : 'Test Speaker Audio 🔊'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
              <span className="text-gray-400 font-semibold block">Microphone Layer</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <p className="font-bold text-white">Web Speech API & Audio Streams</p>
              </div>
              <span className="text-[11px] text-gray-400 block">Zero-Latency Speech Recognition Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
