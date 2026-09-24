/**
 * Workout sessions, derived from the exercise logs.
 *
 * WHY THIS EXISTS (month brief Obj 16, a sibling of the day-count bug): the logger
 * saves ONE WorkoutLog PER EXERCISE, but four places counted those logs as
 * workouts. One six-exercise session showed up as:
 *   - "Day 7/36" on the program progress bar (ProgramProgressBar)
 *   - "6 Total Workouts" and "9.0h Training Time" on Progress (logs x 1.5h)
 *   - "Top 5% This Week! 6 workouts completed" on the banner (a percentile with no
 *     population behind it, over a count that was wrong)
 *   - "6 workouts" on the export sheet
 *
 * A session here is the set of logs for one plan on one local calendar day. That
 * is exact for the normal case (one workout a day). Two separate workouts of the
 * same plan on the same day count as one; that is the honest lower bound, since
 * the logs do not record where a session starts.
 */
import type { WorkoutLog, WorkoutPlan } from '@/types/user';

export interface WorkoutSession {
  planId: string;
  day: string;          // local YYYY-MM-DD
  logs: WorkoutLog[];
  completedSets: number;
  volumeKg: number;
}

function localDay(iso: string): string {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function groupSessions(logs: WorkoutLog[]): WorkoutSession[] {
  const byKey = new Map<string, WorkoutSession>();
  for (const log of logs) {
    const day = localDay(log.date);
    const key = `${log.workoutPlanId}|${day}`;
    let s = byKey.get(key);
    if (!s) {
      s = { planId: log.workoutPlanId, day, logs: [], completedSets: 0, volumeKg: 0 };
      byKey.set(key, s);
    }
    s.logs.push(log);
    for (const set of log.sets ?? []) {
      if (set.completed) {
        s.completedSets += 1;
        s.volumeKg += (set.weight || 0) * (set.reps || 0);
      }
    }
  }
  return [...byKey.values()].sort((a, b) => a.day.localeCompare(b.day));
}

export function countSessions(logs: WorkoutLog[], planId?: string): number {
  return groupSessions(planId ? logs.filter((l) => l.workoutPlanId === planId) : logs).length;
}

/** Sessions on or after `since` (a Date), across all plans. */
export function sessionsSince(logs: WorkoutLog[], since: Date): WorkoutSession[] {
  const floor = localDay(since.toISOString());
  return groupSessions(logs).filter((s) => s.day >= floor);
}

/**
 * Which day of the plan comes next: the day after the one the most recent session
 * of this plan covered, matched by the exercises it logged. Falls back to the
 * session count modulo the plan length, then to day 0.
 */
export function nextDayIndex(plan: WorkoutPlan, logs: WorkoutLog[]): number {
  const n = plan.plan.length;
  if (n === 0) return 0;
  const sessions = groupSessions(logs.filter((l) => l.workoutPlanId === plan.id));
  if (sessions.length === 0) return 0;
  const last = sessions[sessions.length - 1];
  const names = new Set(last.logs.map((l) => l.exerciseName));
  let best = -1;
  let bestOverlap = 0;
  plan.plan.forEach((d, i) => {
    const overlap = d.exercises.filter((e) => names.has(e.name)).length;
    if (overlap > bestOverlap) { best = i; bestOverlap = overlap; }
  });
  if (best >= 0) return (best + 1) % n;
  return sessions.length % n;
}
