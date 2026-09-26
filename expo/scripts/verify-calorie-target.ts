/**
 * verify-calorie-target.ts -- the calorie target can't go dangerously low (App Review 1.4.1).
 * The three cases are the ones the 26 Sep guideline audit computed from the old formula.
 *   npx tsx scripts/verify-calorie-target.ts
 */
import { computeCalorieTarget, limitNote, targetWeightProblem, ageProblem, FLOOR_FEMALE, FLOOR_MALE } from '../lib/calorie-target';

let pass = 0; const fail: string[] = [];
const ok = (name: string, cond: boolean, detail = '') => { if (cond) { pass++; console.log(`  ok    ${name}`); } else { fail.push(name); console.log(`  FAIL  ${name} ${detail}`); } };

const woman60 = { age: 30, weight: 60, height: 165, gender: 'female', activityLevel: 'sedentary', fitnessGoal: 'Weight Loss', targetWeight: 55, weeklyWeightGoal: 1 };
const a = computeCalorieTarget(woman60)!;
ok('old formula gave 484 kcal; now at least the floor', a.target >= FLOOR_FEMALE, `got ${a.target}`);
ok('floor is at least her BMR (1,320)', a.floor >= 1320 && a.target === a.floor, `floor ${a.floor}, target ${a.target}`);
ok('the screen gets a note when the floor applies', !!limitNote(a) && limitNote(a)!.includes('safe minimum'));
ok('pace capped at 1% of body weight (0.6 kg)', a.paceUsed === 0.6 && a.paceCapped);

const woman50 = { ...woman60, age: 40, weight: 50, targetWeight: 48 };
ok('old formula gave 267 kcal; now >= 1,200', computeCalorieTarget(woman50)!.target >= 1200);

const typed2kg = { ...woman60, weeklyWeightGoal: 2 };
const c = computeCalorieTarget(typed2kg)!;
ok('2 kg/week typed: never negative, never below floor', c.target >= FLOOR_FEMALE, `got ${c.target}`);

const man = { age: 35, weight: 90, height: 180, gender: 'male', activityLevel: 'moderate', fitnessGoal: 'Fat Loss', targetWeight: 80, weeklyWeightGoal: 0.5 };
const m = computeCalorieTarget(man)!;
ok('a normal request is untouched (no floor, no cap)', !m.floorApplied && !m.paceCapped && limitNote(m) === null, JSON.stringify(m));
ok('man floor is 1,500 or BMR', m.floor >= FLOOR_MALE);
const gain = computeCalorieTarget({ ...man, fitnessGoal: 'Muscle Gain', targetWeight: 95, weeklyWeightGoal: 3 })!;
ok('gain pace capped too (0.9 kg for 90 kg)', gain.paceUsed === 0.9 && gain.paceCapped);
ok('maintain = maintenance', computeCalorieTarget({ ...man, fitnessGoal: 'General Fitness' })!.target === m.maintenance);
ok('missing inputs -> null', computeCalorieTarget({ weight: 70 }) === null);

ok('target weight under BMI 18.5 refused', !!targetWeightProblem(165, 48));
ok('healthy target weight accepted', targetWeightProblem(165, 55) === null);
ok('age 12 refused', !!ageProblem(12));
ok('age 30 accepted', ageProblem(30) === null);

console.log(`\n${pass} passed, ${fail.length} failed`);
process.exit(fail.length ? 1 : 0);
