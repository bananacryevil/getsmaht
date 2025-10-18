/**
 * Metrics & helper utilities derived from the current curriculum item shape.
 *
 * Item shape assumptions (no schema changes):
 * {
 *   day: number,
 *   title: string,
 *   readings: string[],
 *   exercises: string[],
 *   deliverable?: string,
 *   completed?: boolean,
 *   completedAt?: string | null
 * }
 */

/**
 * Calculate a simple calendar streak: consecutive days (including today)
 * with at least one completion.
 * @param {Array<Object>} items
 * @returns {number}
 */
export function calcStreak(items) {
  const days = new Set(
    (items || [])
      .filter(i => i && i.completedAt)
      .map(i => new Date(i.completedAt).toDateString())
  );

  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) streak += 1; else break;
  }
  return streak;
}

/**
 * Find the most recent completed day and return summary info.
 * @param {Array<Object>} items
 * @returns {{ day: number|null, date: Date|null, daysAgo: number|null }}
 */
export function lastCompletionInfo(items) {
  const completed = (items || [])
    .filter(i => i && i.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  if (!completed.length) return { day: null, date: null, daysAgo: null };

  const latest = completed[0];
  const now = new Date();
  const then = new Date(latest.completedAt);
  const ms = now.getTime() - then.getTime();
  const daysAgo = Math.floor(ms / (24 * 60 * 60 * 1000));
  return { day: latest.day ?? null, date: then, daysAgo };
}

/**
 * Derive a rough estimate (in minutes) for a day's workload.
 * Tuned to be conservative and require no new schema.
 * @param {Object} item
 * @returns {number}
 */
export function estimateDayMinutes(item) {
  if (!item) return 0;
  const r = (item.readings?.length || 0) * 8;     // ~8 min per reading
  const e = (item.exercises?.length || 0) * 15;   // ~15 min per exercise
  const d = item.deliverable ? 20 : 0;            // ~20 min if deliverable present
  return Math.max(10, r + e + d);                 // floor at 10 min
}

/**
 * Sum of estimated minutes for all remaining (not completed) days.
 * @param {Array<Object>} items
 * @returns {number}
 */
export function estimateRemainingMinutes(items) {
  return (items || [])
    .filter(i => !i?.completed)
    .reduce((sum, it) => sum + estimateDayMinutes(it), 0);
}

/**
 * Next N deliverables that are not completed.
 * @param {Array<Object>} items
 * @param {number} [limit=3]
 * @returns {Array<Object>}
 */
export function upcomingDeliverables(items, limit = 3) {
  return (items || [])
    .filter(i => i && i.deliverable && !i.completed)
    .slice(0, limit);
}
