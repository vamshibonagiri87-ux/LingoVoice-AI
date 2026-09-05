import { TrendingUp, Award, Zap, Volume2, BookOpen, CheckCircle, Activity } from 'lucide-react';

export default function ProgressChart({ skills = {} }) {
  const skillList = [
    { label: 'Speaking Spontaneity', score: skills.speaking || 78, icon: Activity, color: 'from-brand-600 to-brand-500' },
    { label: 'Pronunciation & Clarity', score: skills.pronunciation || 82, icon: Volume2, color: 'from-amber-500 to-orange-500' },
    { label: 'Grammar Accuracy', score: skills.grammar || 75, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: 'Vocabulary Breadth', score: skills.vocabulary || 80, icon: BookOpen, color: 'from-cyan-500 to-blue-500' },
    { label: 'Conversational Fluency', score: skills.fluency || 76, icon: Zap, color: 'from-purple-500 to-indigo-500' },
  ];

  return (
    <div className="space-y-4">
      {skillList.map((skill) => {
        const Icon = skill.icon;
        return (
          <div key={skill.label} className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-200 font-medium">
                <Icon className="w-4 h-4 text-brand-400" />
                <span>{skill.label}</span>
              </div>
              <span className="font-bold text-white">{skill.score}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-dark-950 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(100, Math.max(5, skill.score))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
