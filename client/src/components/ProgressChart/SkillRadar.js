export default function SkillRadar({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-gray-500">
        Complete your first speaking session to generate progress trajectory trends.
      </div>
    );
  }

  const maxPoints = Math.min(10, history.length);
  const displayHistory = history.slice(-maxPoints);

  return (
    <div className="space-y-3">
      <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2">
        {displayHistory.map((item, idx) => {
          const heightPercent = Math.min(100, Math.max(20, item.speakingScore || 70));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.speakingScore}%
              </span>
              <div
                className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-brand-600 to-cyan-400 group-hover:from-brand-500 group-hover:to-cyan-300 transition-all duration-300"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[10px] text-gray-500">
                {new Date(item.date).toLocaleDateString([], { weekday: 'narrow' })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
        <span>Recent Practice Sessions</span>
        <span className="text-emerald-400 font-medium">+14% Growth</span>
      </div>
    </div>
  );
}
