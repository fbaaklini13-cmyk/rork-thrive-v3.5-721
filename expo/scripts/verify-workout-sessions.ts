/**
 * verify-workout-sessions.ts -- lib/workout-sessions.ts, pure, no app runtime.
 * Run: npx tsx scripts/verify-workout-sessions.ts
 */
import { countSessions, groupSessions, nextDayIndex, sessionsSince } from '../lib/workout-sessions';
import type { WorkoutLog, WorkoutPlan } from '../types/user';

let passed = 0; const failures: string[] = [];
const check = (label: string, cond: boolean, detail = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${label}${detail && !cond ? ` -- ${detail}` : ''}`);
  if (cond) passed++; else failures.push(label);
};
const at = (y: number, m: number, d: number, h = 10) => new Date(y, m - 1, d, h).toISOString();
const log = (plan: string, ex: string, iso: string, sets: [number, number, boolean][] = [[50, 10, true]]): WorkoutLog =>
  ({ id: ex + iso, workoutPlanId: plan, exerciseName: ex, date: iso, sets: sets.map(([w, r, c], i) => ({ setNumber: i + 1, weight: w, reps: r, completed: c })) });

const push = ['Bench', 'Press', 'Dips', 'Flyes', 'Pushdown', 'Raise'];
const oneWorkout = push.map((e, i) => log('p1', e, at(2026, 9, 21, 10 + i / 10)));
check('one six-exercise workout is ONE session, not six', countSessions(oneWorkout) === 1, String(countSessions(oneWorkout)));
check('...and its completed sets are counted', groupSessions(oneWorkout)[0].completedSets === 6);
check('...and its volume is weight x reps of completed sets', groupSessions(oneWorkout)[0].volumeKg === 3000);
const two = [...oneWorkout, ...push.map((e) => log('p1', e, at(2026, 9, 23)))];
check('two days = two sessions', countSessions(two) === 2);
check('per-plan count ignores other plans', countSessions([...two, log('p2', 'Squat', at(2026, 9, 23))], 'p1') === 2);
check('the same day on two plans is two sessions', countSessions([log('p1', 'A', at(2026, 9, 23)), log('p2', 'B', at(2026, 9, 23))]) === 2);
check('an incomplete set adds nothing', groupSessions([log('p1', 'A', at(2026, 9, 23), [[100, 5, false]])])[0].completedSets === 0);
check('sessionsSince keeps only days on or after the date',
  sessionsSince(two, new Date(2026, 8, 22)).length === 1 && sessionsSince(two, new Date(2026, 8, 21)).length === 2);

const plan: WorkoutPlan = { id: 'p1', createdAt: '', goals: [], equipment: [], daysPerWeek: 3, plan: [
  { day: 'Day 1 - Push', exercises: push.map((n) => ({ name: n, sets: 3, reps: '10', restPeriod: '60s' } as any)) },
  { day: 'Day 2 - Pull', exercises: ['Row', 'Pulldown', 'Curl'].map((n) => ({ name: n, sets: 3, reps: '10', restPeriod: '60s' } as any)) },
  { day: 'Day 3 - Legs', exercises: ['Squat', 'Lunge'].map((n) => ({ name: n, sets: 3, reps: '10', restPeriod: '60s' } as any)) },
] };
check('no sessions yet: start at day 1', nextDayIndex(plan, []) === 0);
check('after Push: Pull is next', nextDayIndex(plan, oneWorkout) === 1);
check('after Legs: wraps to Push', nextDayIndex(plan, [...oneWorkout, log('p1', 'Squat', at(2026, 9, 24))]) === 0);
check('logs from another plan do not move this one', nextDayIndex(plan, [log('p2', 'Row', at(2026, 9, 24))]) === 0);

console.log(`\n${passed} passed, ${failures.length} failed`);
failures.forEach((f) => console.log('  - ' + f));
process.exit(failures.length ? 1 : 0);
