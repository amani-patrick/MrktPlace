type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const MESSAGE_COUNTS: Record<TimeOfDay, number> = {
  morning: 4,
  afternoon: 3,
  evening: 3,
  night: 2,
};

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/** Stable per-user, per-day welcome key for next-intl `hero` namespace. */
export function pickWelcomeMessageKey(userId: string, date = new Date()): string {
  const period = getTimeOfDay(date);
  const count = MESSAGE_COUNTS[period];
  const daySeed = date.getFullYear() * 1000 + date.getMonth() * 50 + date.getDate();

  let hash = 0;
  for (const char of userId) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10000;
  }

  const index = (hash + daySeed) % count;
  const periodKey = period.charAt(0).toUpperCase() + period.slice(1);
  return `welcome${periodKey}${index}`;
}
