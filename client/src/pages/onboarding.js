import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Globe,
  Award,
  Target,
  Clock,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Loader2,
  Gamepad2,
  BookOpen,
  Compass,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, setProfile } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nativeLanguage, setNativeLanguage] = useState(profile?.nativeLanguage || user?.nativeLanguage || 'English');
  const [targetLanguage, setTargetLanguage] = useState(profile?.targetLanguage || user?.targetLanguage || 'Spanish');
  const [proficiencyLevel, setProficiencyLevel] = useState(profile?.proficiencyLevel || user?.proficiencyLevel || 'Beginner');
  const [selectedGoals, setSelectedGoals] = useState(profile?.learningGoals || ['Daily conversation']);
  const [dailyMinutes, setDailyMinutes] = useState(profile?.dailyTargetMinutes || 15);
  const [selectedTopics, setSelectedTopics] = useState(profile?.preferredTopics || ['Daily life & Friends', 'Food & Snacks']);

  const languages = [
    { code: 'Spanish', flag: '🇪🇸', label: 'Spanish' },
    { code: 'French', flag: '🇫🇷', label: 'French' },
    { code: 'German', flag: '🇩🇪', label: 'German' },
    { code: 'Japanese', flag: '🇯🇵', label: 'Japanese' },
    { code: 'English', flag: '🇺🇸', label: 'English' },
    { code: 'Italian', flag: '🇮🇹', label: 'Italian' },
  ];

  const proficiencyOptions = [
    { level: 'Beginner', badge: '🌱 Starter (A1)', desc: 'I am starting from scratch or know a few simple words.' },
    { level: 'Elementary', badge: '🌿 Elementary (A2)', desc: 'I can understand simple greetings and ask basic questions.' },
    { level: 'Intermediate', badge: '🚀 Conversational (B1)', desc: 'I can chat about school, hobbies, and favorite topics.' },
    { level: 'Upper Intermediate', badge: '⭐ Confident (B2)', desc: 'I can speak comfortably with good grammar.' },
    { level: 'Advanced', badge: '🏆 Fluent (C1)', desc: 'I communicate fluently and easily in any situation.' },
  ];

  const goalOptions = [
    { label: 'Chatting with Friends & Daily Life 🗣️', id: 'Daily conversation' },
    { label: 'School Classes & Homework 🎒', id: 'Academic exams & Studies' },
    { label: 'Travel & Vacations ✈️', id: 'Travel & Adventure' },
    { label: 'Video Games & Online Fun 🎮', id: 'Social communication & Friends' },
    { label: 'Movies, Music & Anime 🍿', id: 'Culture & Entertainment' },
    { label: 'Future Career & Jobs 💼', id: 'Career & Work' },
  ];

  const topicOptions = [
    'Daily Life & Friends 🌟',
    'Food, Pizza & Snacks 🍕',
    'Video Games & YouTube 🎮',
    'Music, Movies & Shows 🎵',
    'Sports & Outdoor Games ⚽',
    'School & Fun Subjects 📚',
    'Travel & Exploring Cities 🗺️',
    'Animals & Nature 🐾'
  ];

  const toggleGoal = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        nativeLanguage,
        targetLanguage,
        proficiencyLevel,
        learningGoals: selectedGoals.length > 0 ? selectedGoals : ['Daily conversation'],
        dailyTargetMinutes: dailyMinutes,
        preferredTopics: selectedTopics.length > 0 ? selectedTopics : ['Daily Life & Friends'],
        isOnboardingCompleted: true
      };

      const res = await api.put('/profile', payload);
      if (res.data.success) {
        setProfile(res.data.data);

        // Celebration confetti effect
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error('[Onboarding] Update profile error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-dark-950 flex flex-col justify-between py-10 px-4 max-w-2xl mx-auto selection:bg-brand-500 selection:text-white transition-colors">
        {/* Top Stepper */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Step {step} of 6
              </span>
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">Personalizing Your Voice AI Coach 🌟</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="h-2 w-full bg-dark-850 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>

          {/* Step 1: Native Language */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What is your first (native) language?</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  We will give you helpful tips and explanations in this language whenever you need them.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setNativeLanguage(l.code)}
                    className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                      nativeLanguage === l.code
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/20 scale-[1.02]'
                        : 'bg-dark-850 border-white/5 text-gray-300 hover:bg-dark-800'
                    }`}
                  >
                    <span className="text-3xl">{l.flag}</span>
                    <span className="text-sm font-bold">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Target Language */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Which language do you want to learn?</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  Your AI voice coach will speak with you in this language!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setTargetLanguage(l.code)}
                    className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                      targetLanguage === l.code
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/20 scale-[1.02]'
                        : 'bg-dark-850 border-white/5 text-gray-300 hover:bg-dark-800'
                    }`}
                  >
                    <span className="text-3xl">{l.flag}</span>
                    <span className="text-sm font-bold">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Proficiency Level */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What is your current speaking level?</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  The AI coach will match its speed, words, and grammar to your level.
                </p>
              </div>

              <div className="space-y-3">
                {proficiencyOptions.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => setProficiencyLevel(opt.level)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between border text-left transition-all ${
                      proficiencyLevel === opt.level
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-dark-850 border-white/5 text-gray-300 hover:bg-dark-800'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-white block">{opt.badge}</span>
                      <p className="text-xs text-gray-300 mt-1">{opt.desc}</p>
                    </div>
                    {proficiencyLevel === opt.level && (
                      <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 ml-3">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Learning Goals */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why do you want to learn {targetLanguage}?</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  Choose any goals that excite you (tap to select):
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-2xl flex items-center justify-between border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-500/20 border-brand-500 text-white shadow-md shadow-brand-500/20'
                          : 'bg-dark-850 border-white/5 text-gray-300 hover:bg-dark-800'
                      }`}
                    >
                      <span className="text-xs font-semibold">{goal.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Daily Target Minutes */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Pick your daily practice goal</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  Even just 5 to 15 minutes a day builds super-fast speaking habits!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                {[
                  { minutes: 5, label: '🌱 Casual', desc: '5 min / day' },
                  { minutes: 15, label: '🚀 Standard', desc: '15 min / day (Recommended)' },
                  { minutes: 30, label: '🏆 Intensive', desc: '30 min / day' },
                ].map((item) => (
                  <button
                    key={item.minutes}
                    onClick={() => setDailyMinutes(item.minutes)}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      dailyMinutes === item.minutes
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/20 scale-[1.02]'
                        : 'bg-dark-850 border-white/5 text-gray-300 hover:bg-dark-800'
                    }`}
                  >
                    <Clock className="w-6 h-6 text-brand-400 mx-auto mb-2" />
                    <span className="text-sm font-bold block text-white">{item.label}</span>
                    <span className="text-[11px] text-gray-400 mt-1 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Preferred Topics */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What topics do you like talking about?</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  Your AI coach will use your favorite themes for conversations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {topicOptions.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`p-4 rounded-2xl flex items-center justify-between border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-500/20 border-brand-500 text-white shadow-md shadow-brand-500/20'
                          : 'bg-dark-850 border-white/5 text-gray-300 hover:bg-dark-800'
                      }`}
                    >
                      <span className="text-xs font-bold">{topic}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-gray-300 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Launching AI Voice Coach...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Learning Now! 🚀</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
