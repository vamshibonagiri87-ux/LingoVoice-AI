import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Headphones, Mail, Lock, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both your email and password');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;
      if (profile && !profile.isOnboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleDemoLogin = async () => {
    setEmail('learner@lingovoice.ai');
    setPassword('password123');
    const res = await login('learner@lingovoice.ai', 'password123');
    if (!res.success) {
      // If demo user does not exist yet, register demo user
      const registerRes = await useAuthStore.getState().register({
        name: 'Alex Rivera',
        email: 'learner@lingovoice.ai',
        password: 'password123',
        nativeLanguage: 'English',
        targetLanguage: 'Spanish',
        proficiencyLevel: 'Intermediate',
        learningGoal: 'Daily conversation',
        dailyTargetMinutes: 15
      });
      if (registerRes.success) {
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <NextLink href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">LingoVoice <span className="text-brand-400">AI</span></span>
          </NextLink>
          <h2 className="text-xl font-bold text-gray-100">Welcome Back</h2>
          <p className="text-xs text-gray-400 mt-1">Sign in to continue your voice speaking journey</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
          {(formError || error) && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-dark-850 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/5 text-xs font-semibold text-brand-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Instant One-Click Demo Login</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <NextLink href="/register" className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4">
            Create Account
          </NextLink>
        </p>
      </div>
    </div>
  );
}
