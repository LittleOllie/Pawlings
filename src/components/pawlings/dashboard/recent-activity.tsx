"use client";

import type { ActivityEntry } from "@/types/dashboard";

interface RecentActivityProps {
  activities: ActivityEntry[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section aria-labelledby="recent-activity-heading" className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6">
      <h2 id="recent-activity-heading" className="font-display text-lg font-bold text-pawlings-white mb-4">
        Recent Activity
      </h2>
      {activities.length === 0 ? (
        <p className="text-sm text-pawlings-muted">Care actions will show up here.</p>
      ) : (
        <ul className="space-y-3">
          {activities.slice(0, 5).map((entry) => (
            <li key={entry.id} className="text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <p className="text-pawlings-white">{entry.label}</p>
              {entry.detail ? <p className="text-pawlings-muted text-xs mt-0.5">{entry.detail}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
