"use client";

import { useEffect, useState } from "react";
import { GameButton } from "@/components/pawlings/game-button";
import type { MissionState } from "@/types/dashboard";

interface PackMissionsSectionProps {
  missions: MissionState[];
  onComplete: (missionId: string) => Promise<void>;
}

export function PackMissionsSection({ missions, onComplete }: PackMissionsSectionProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmReady, setConfirmReady] = useState<Record<string, boolean>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [timers, setTimers] = useState<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, [timers]);

  function startMission(mission: MissionState) {
    if (mission.completed) return;
    window.open(mission.url, "_blank", "noopener,noreferrer");
    setPendingId(mission.id);
    setConfirmReady((s) => ({ ...s, [mission.id]: false }));

    const timer = setTimeout(() => {
      setConfirmReady((s) => ({ ...s, [mission.id]: true }));
    }, mission.confirmDelayMs);

    setTimers((t) => ({ ...t, [mission.id]: timer }));
  }

  async function confirmMission(missionId: string) {
    setLoadingId(missionId);
    try {
      await onComplete(missionId);
      setPendingId(null);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section aria-labelledby="pack-missions-heading" className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6">
      <h2 id="pack-missions-heading" className="font-display text-lg font-bold text-pawlings-white mb-2">
        Pack Missions
      </h2>
      <p className="text-xs text-pawlings-muted mb-4">
        Manual confirmation — we don&apos;t verify X interactions automatically yet.
      </p>
      <ul className="space-y-3">
        {missions.map((mission) => (
          <li
            key={mission.id}
            className="rounded-xl border border-white/8 bg-black/15 p-4 space-y-3"
          >
            <div>
              <p className="font-display font-bold text-pawlings-white">{mission.title}</p>
              <p className="text-sm text-pawlings-muted">{mission.description}</p>
              <p className="text-xs text-pawlings-lime mt-1">Reward: +{mission.reward} Treats</p>
            </div>
            {mission.completed ? (
              <p className="text-sm text-pawlings-muted">Completed ✓</p>
            ) : pendingId === mission.id ? (
              <GameButton
                type="button"
                fullWidth
                disabled={!confirmReady[mission.id]}
                loading={loadingId === mission.id}
                onClick={() => confirmMission(mission.id)}
              >
                {confirmReady[mission.id] ? "I've done it" : "Visit X first…"}
              </GameButton>
            ) : (
              <GameButton type="button" variant="secondary" fullWidth onClick={() => startMission(mission)}>
                Start mission
              </GameButton>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
