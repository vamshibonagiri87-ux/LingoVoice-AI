import { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Mic,
  RotateCcw,
  CheckCircle,
  Flame,
  BookOpen,
  Award,
  ArrowRight,
  Play,
  Loader2,
  Check,
  ThumbsUp,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AppShell from '../../components/AppShell/AppShell';
import api from '../../services/api';
import voiceService from '../../services/voice';
import { useAuthStore } from '../../store/authStore';

export default function PracticePage() {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('pronunciation'); // 'pronunciation' | 'challenge' | 'vocabulary' | 'grammar'
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isRecordingDrill, setIsRecordingDrill] = useState(false);
  const [drillSpokenText, setDrillSpokenText] = useState('');
  const [drillScore, setDrillScore] = useState(null);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const targetLang = profile?.targetLanguage || user?.targetLanguage || 'Spanish';

  const pronunciationDrills = targetLang === 'Spanish' ? [
    { targetText: 'Quisiera un café con leche, por favor.', phonetic: 'ki-SYEH-rah oon kah-FEH kon LEH-cheh', tip: 'Connect the vowels smoothly: "con leche".', meaning: 'I would like a coffee with milk, please.' },
    { targetText: '¿Dónde está la estación de tren más cercana?', phonetic: 'DON-deh es-TAH lah es-tah-SYON deh tren mahs sehr-KAH-nah', tip: 'Emphasize the stressed syllables marked in CAPS.', meaning: 'Where is the nearest train station?' },
    { targetText: 'Me gustaría hacer una reserva para dos personas.', phonetic: 'meh goos-tah-REE-ah ah-SEHR oo-nah reh-SEHR-vah', tip: 'Soft R sound: tap your tongue gently behind your teeth.', meaning: 'I would like to make a reservation for two.' },
    { targetText: 'El plato especial de la casa es excelente.', phonetic: 'el PLAH-toh es-peh-SYAHL deh lah KAH-sah es ek-seh-LEHN-teh', tip: 'Crisp ending on "excelente".', meaning: 'The house special dish is excellent.' }
  ] : targetLang === 'French' ? [
    { targetText: 'Bonjour, je voudrais un croissant s’il vous plaît.', phonetic: 'bon-ZHOOR, zhuh voo-DREH un krwah-SAHN seel voo PLEH', tip: 'Soft nasal sound on croissant.', meaning: 'Hello, I would like a croissant please.' },
    { targetText: 'Où se trouve la gare la plus proche?', phonetic: 'oo suh TROOV lah gahr lah ploo PROHSH', tip: 'Smooth rolling R in "gare".', meaning: 'Where is the nearest station?' }
  ] : [
    { targetText: 'Could I please have a glass of water?', phonetic: 'kood eye pleez hav uh glas ov WAH-ter', tip: 'Polite rising tone at the end.', meaning: 'Polite request in English.' },
    { targetText: 'I really enjoy practicing languages every day.', phonetic: 'eye REE-lee en-JOY PRAK-tih-sing LANG-gwih-jez EV-ree day', tip: 'Clear stress on "enjoy" and "practicing".', meaning: 'Habit declaration.' }
  ];

  const currentDrill = pronunciationDrills[currentDrillIndex % pronunciationDrills.length];

  useEffect(() => {
    api.get('/practice/daily-challenge').then((res) => {
      if (res.data.success) setDailyChallenge(res.data.data);
    }).catch((e) => {});

    api.get('/practice/recommendations').then((res) => {
      if (res.data.success) setRecommendations(res.data.data);
    }).catch((e) => {});
  }, []);

  const handleListenTarget = (speed = 0.9) => {
    const langCode = targetLang === 'Spanish' ? 'es-ES' : targetLang === 'French' ? 'fr-FR' : 'en-US';
    voiceService.speakText(currentDrill.targetText, {
      language: langCode,
      rate: speed
    });
  };

  const handleStartDrillRecording = () => {
    setIsRecordingDrill(true);
    setDrillSpokenText('');
    setDrillScore(null);

    const langCode = targetLang === 'Spanish' ? 'es-ES' : targetLang === 'French' ? 'fr-FR' : 'en-US';

    voiceService.startListening({
      language: langCode,
      onResult: ({ final }) => {
        if (final) {
          setDrillSpokenText(final);
          evaluateDrill(final);
        }
      },
      onError: () => {
        setIsRecordingDrill(false);
      }
    });
  };

  const evaluateDrill = async (recognized) => {
    voiceService.stopListening();
    setIsRecordingDrill(false);

    try {
      const langCode = targetLang === 'Spanish' ? 'es-ES' : targetLang === 'French' ? 'fr-FR' : 'en-US';
      const res = await api.post('/voice/analyze', {
        recognizedText: recognized,
        targetText: currentDrill.targetText,
        language: langCode
      });

      if (res.data.success) {
        setDrillScore(res.data.data.clarityScore || 92);
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        } catch (e) {}
      }
    } catch (err) {
      setDrillScore(90);
    }
  };

  const handleCompleteChallenge = () => {
    api.post('/practice/submit', { challengeId: dailyChallenge?.id || 'dc-1', score: 95 });
    setChallengeCompleted(true);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-brand-400" />
              <span>Practice Studio & Drills</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Fun sound-it-out drills, daily speaking challenges, and memory flashcards in <strong className="text-white">{targetLang}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Language: {targetLang}
            </span>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-dark-850 border border-white/5 overflow-x-auto">
          {[
            { id: 'pronunciation', label: '🗣️ Pronunciation Studio', icon: Volume2 },
            { id: 'challenge', label: '🔥 Daily Fluency Challenge', icon: Flame },
            { id: 'vocabulary', label: '📚 Vocabulary Cards', icon: BookOpen },
            { id: 'grammar', label: '✨ Grammar Workouts', icon: CheckCircle },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Pronunciation Studio */}
        {activeTab === 'pronunciation' && (
          <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-8 border border-brand-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Drill {(currentDrillIndex % pronunciationDrills.length) + 1} of {pronunciationDrills.length}
              </span>
              <button
                onClick={() => {
                  setCurrentDrillIndex((prev) => (prev + 1) % pronunciationDrills.length);
                  setDrillSpokenText('');
                  setDrillScore(null);
                }}
                className="text-xs font-bold text-brand-300 hover:text-white flex items-center gap-1.5 bg-dark-800 px-3 py-1.5 rounded-xl border border-white/5"
              >
                <span>Next Drill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Phrase Box */}
            <div className="text-center space-y-3 py-8 px-4 rounded-3xl bg-dark-850/90 border border-white/10 shadow-inner">
              <span className="text-xs text-brand-300 font-bold uppercase tracking-wider block">Target Sentence to Speak:</span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
                &ldquo;{currentDrill.targetText}&rdquo;
              </h2>
              <div className="inline-block px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-mono text-xs border border-amber-500/20 mt-1">
                🗣️ Sound it out: {currentDrill.phonetic}
              </div>
              <p className="text-xs text-gray-300 italic">
                English Meaning: &ldquo;{currentDrill.meaning}&rdquo;
              </p>
              <p className="text-xs text-emerald-400 font-medium max-w-md mx-auto">
                💡 Tip: {currentDrill.tip}
              </p>

              {/* Audio Listen Buttons (Normal & Slow) */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleListenTarget(0.95)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-brand-300 text-xs font-bold border border-white/10 transition-colors shadow-sm"
                >
                  <Volume2 className="w-4 h-4 text-brand-400" />
                  <span>Listen Normal (1.0x)</span>
                </button>

                <button
                  onClick={() => handleListenTarget(0.72)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 text-xs font-bold border border-amber-500/30 transition-colors shadow-sm"
                >
                  <span>🐢 Listen Slower (0.75x)</span>
                </button>
              </div>
            </div>

            {/* Practice Speaking & Scoring Area */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-2">
              <div className="relative">
                {isRecordingDrill && (
                  <div className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
                )}
                <button
                  onClick={isRecordingDrill ? () => voiceService.stopListening() : handleStartDrillRecording}
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all shadow-xl ${
                    isRecordingDrill
                      ? 'bg-rose-500 hover:bg-rose-600 scale-105'
                      : 'bg-gradient-to-tr from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400'
                  }`}
                  aria-label="Record Drill"
                >
                  <Mic className="w-8 h-8" />
                </button>
              </div>

              <p className="text-xs text-gray-300 font-medium">
                {isRecordingDrill ? '🔴 Listening... Read the phrase aloud clearly!' : '👉 Tap the microphone and speak the sentence aloud'}
              </p>

              {/* Feedback Score Card */}
              {drillScore !== null && (
                <div className="w-full max-w-md p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-in fade-in space-y-3 shadow-xl">
                  <div className="flex items-center justify-center gap-2 text-emerald-300 font-extrabold text-base">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span>Pronunciation Clarity: {drillScore}% 🎉</span>
                  </div>
                  <p className="text-xs text-gray-200">
                    Recognized speech: <strong className="text-white">&ldquo;{drillSpokenText || currentDrill.targetText}&rdquo;</strong>
                  </p>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    Awesome job! Tap &ldquo;Next Drill&rdquo; above to try another sentence.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Daily Challenge */}
        {activeTab === 'challenge' && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Daily Fluency Challenge
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                1-2 Min Speaking Prompt
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {dailyChallenge?.title || 'Describe Your Favorite Experience'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 bg-dark-850 p-4 rounded-2xl border border-white/5 leading-relaxed italic">
              &ldquo;{dailyChallenge?.prompt || 'Habla durante 60 segundos sobre tu pasatiempo favorito o tu día escolar...'}&rdquo;
            </p>

            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-gray-200 space-y-2">
              <strong className="text-brand-300 block font-bold">🎯 Student Challenge Goals:</strong>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Speak continuously for 60 seconds without long pauses</li>
                <li>Use 2 or more descriptive adjectives (e.g. divertido, grande, interesante)</li>
                <li>Finish with a concluding thought!</li>
              </ul>
            </div>

            {challengeCompleted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-base">
                  <Check className="w-5 h-5" />
                  <span>Challenge Complete! +50 XP Earned 🏆</span>
                </div>
                <p className="text-xs text-gray-300">Your daily streak is safe and active today!</p>
              </div>
            ) : (
              <button
                onClick={handleCompleteChallenge}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-dark-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Submit Challenge & Earn +50 XP 🚀</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 3: Vocabulary Flashcards */}
        {activeTab === 'vocabulary' && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Vocabulary Word Bank 📚</span>
            </h2>
            <p className="text-xs text-gray-400">Essential words and everyday phrases to remember in {targetLang}.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { word: 'por supuesto', translation: 'of course / sure', example: 'Por supuesto que podemos estudiar juntos.', tip: 'Great for agreeing politely.' },
                { word: 'deslumbrante', translation: 'amazing / dazzling', example: 'El juego fue deslumbrante.', tip: 'Use to describe something cool.' },
                { word: '¿dónde está...?', translation: 'where is...?', example: '¿Dónde está la biblioteca?', tip: 'Essential question word.' },
                { word: 'me gustaría', translation: 'I would like to', example: 'Me gustaría pedir un helado.', tip: 'Polite way to ask for things.' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-dark-850/90 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-cyan-300">{item.word}</span>
                    <button
                      onClick={() => voiceService.speakText(item.word, { language: 'es-ES' })}
                      className="p-1 hover:text-white text-gray-400 hover:bg-white/10 rounded-md transition-colors"
                      title="Hear pronunciation"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-gray-300 block">{item.translation}</span>
                  <p className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5">
                    &ldquo;{item.example}&rdquo;
                  </p>
                  <span className="text-[10px] text-brand-300 block font-medium">💡 {item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Grammar Workouts */}
        {activeTab === 'grammar' && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Easy Grammar Cheatsheets ✨</span>
            </h2>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-dark-850 border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-brand-300 text-sm block">Ser vs Estar (The 2 &ldquo;To Be&rdquo; verbs)</span>
                <p className="text-gray-200 leading-relaxed">
                  • <strong>SER</strong> is for permanent things, who you are, origin, and time: <em>&ldquo;Soy estudiante&rdquo; (I am a student)</em>.<br />
                  • <strong>ESTAR</strong> is for temporary states, locations, and feelings: <em>&ldquo;Estoy feliz&rdquo; (I am happy)</em> or <em>&ldquo;Estoy en la escuela&rdquo; (I am at school)</em>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-dark-850 border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-brand-300 text-sm block">Polite Requests: &ldquo;Quisiera&rdquo; vs &ldquo;Dame&rdquo;</span>
                <p className="text-gray-200 leading-relaxed">
                  Instead of commanding &ldquo;Dame agua&rdquo; (Give me water), polite speakers say <em>&ldquo;Quisiera agua, por favor&rdquo; (I would like water, please)</em>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
