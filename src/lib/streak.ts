export type StreakEvent = {
  id: string;
  active_start: string | null;
  counts_toward_streak: boolean;
};

export function multiplierFor(streak: number): number {
  const raw = Math.min(1 + 0.2 * (streak - 1), 2);
  return Math.round(raw * 10) / 10;
}

export function computeStreak(
  currentEvent: StreakEvent,
  streakEvents: StreakEvent[],
  attendedEventIds: Iterable<string>,
): number {
  if (!currentEvent.counts_toward_streak) return 0;

  const attended = new Set(attendedEventIds);
  const currentStart = currentEvent.active_start
    ? new Date(currentEvent.active_start).getTime()
    : Infinity;

  const prior = streakEvents
    .filter(
      (e) =>
        e.id !== currentEvent.id &&
        e.active_start !== null &&
        new Date(e.active_start).getTime() < currentStart,
    )
    .sort(
      (a, b) =>
        new Date(b.active_start!).getTime() -
        new Date(a.active_start!).getTime(),
    );

  let streak = 0;
  for (const e of prior) {
    if (!attended.has(e.id)) break;
    streak++;
  }
  return streak + 1;
}

export function bonusFor(base: number, streak: number): number {
  return Math.round(base * (multiplierFor(streak) - 1));
}
