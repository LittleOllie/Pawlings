"use client";

interface Achievement {
  id: string;
  label: string;
  emoji: string;
  unlocked: boolean;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <section aria-labelledby="achievements-heading" className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6">
      <h2 id="achievements-heading" className="font-display text-lg font-bold text-pawlings-white mb-4">
        Achievements
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((a) => (
          <li
            key={a.id}
            className={`rounded-xl px-3 py-3 text-center border ${
              a.unlocked
                ? "border-pawlings-lime/30 bg-pawlings-lime/5"
                : "border-white/5 bg-black/15 opacity-60"
            }`}
          >
            <span className="text-2xl block mb-1" aria-hidden>
              {a.emoji}
            </span>
            <p className="text-xs font-display font-bold text-pawlings-white">{a.label}</p>
            <p className="text-[10px] text-pawlings-muted mt-1">{a.unlocked ? "Unlocked" : "Locked"}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
