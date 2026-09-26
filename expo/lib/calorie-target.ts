/**
 * Daily calorie target with safety limits (App Review 1.4.1, 26 Sep 2026).
 *
 * Before this, the target was maintenance minus (pace x 7700 / 7) with no lower limit:
 * a 30-year-old 60 kg woman choosing "1 kg/week" got 484 kcal/day, and a pace typed
 * as 2 kg/week produced a negative target. Two limits now apply, and the result says
 * when either was applied so the screen can say so too:
 *
 *   1. PACE CAP: at most 1 kg/week and at most 1% of body weight per week, for loss
 *      or gain.
 *   2. FLOOR: never below 1,200 kcal (women) / 1,500 kcal (men), and never below the
 *      person's own BMR (Mifflin-St Jeor), whichever is higher.
 *
 * These are conservative general-population limits, not medical advice. The UI shows
 * a "check with a doctor" line next to the target.
 */

export type Sex = 'male' | 'female' | string | undefined;
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export interface CalorieInputs {
  age?: number;
  weight?: number;          // kg
  height?: number;          // cm
  gender?: Sex;
  activityLevel?: Activity | string;
  fitnessGoal?: string;
  targetWeight?: number;
  weeklyWeightGoal?: number; // kg per week the user asked for
}

export interface CalorieTarget {
  target: number;
  bmr: number;
  maintenance: number;
  floor: number;
  floorApplied: boolean;
  paceRequested: number;
  paceUsed: number;
  paceCapped: boolean;
  direction: 'loss' | 'gain' | 'maintain';
}

export const KCAL_PER_KG = 7700;
export const MAX_PACE_KG = 1;
export const MAX_PACE_FRACTION = 0.01;
export const FLOOR_FEMALE = 1200;
export const FLOOR_MALE = 1500;

const MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, 'very-active': 1.9,
};

export function bmrOf(p: CalorieInputs): number | null {
  if (!p.age || !p.weight || !p.height || !p.gender) return null;
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return p.gender === 'male' ? base + 5 : base - 161;
}

export function directionOf(goal?: string): 'loss' | 'gain' | 'maintain' {
  const g = (goal || '').toLowerCase();
  if (g.includes('weight loss') || g.includes('fat loss')) return 'loss';
  if (g.includes('muscle gain') || g.includes('bulking')) return 'gain';
  return 'maintain';
}

export function maxPaceFor(weightKg: number): number {
  return Math.min(MAX_PACE_KG, Math.round(weightKg * MAX_PACE_FRACTION * 100) / 100);
}

export function computeCalorieTarget(p: CalorieInputs): CalorieTarget | null {
  const bmr = bmrOf(p);
  if (bmr === null || !p.weight) return null;
  const maintenance = Math.round(bmr * (MULTIPLIERS[p.activityLevel || 'sedentary'] ?? 1.2));
  const direction = directionOf(p.fitnessGoal);
  const requested = direction !== 'maintain' && p.targetWeight && p.weeklyWeightGoal
    ? Math.max(0, p.weeklyWeightGoal) : 0;
  const cap = maxPaceFor(p.weight);
  const paceUsed = Math.min(requested, cap);
  const daily = (paceUsed * KCAL_PER_KG) / 7;
  let target = direction === 'loss' ? maintenance - daily : direction === 'gain' ? maintenance + daily : maintenance;
  const floor = Math.max(p.gender === 'male' ? FLOOR_MALE : FLOOR_FEMALE, Math.round(bmr));
  let floorApplied = false;
  if (target < floor) {
    target = floor;
    floorApplied = true;
  }
  return {
    target: Math.round(target), bmr: Math.round(bmr), maintenance, floor, floorApplied,
    paceRequested: requested, paceUsed, paceCapped: paceUsed < requested, direction,
  };
}

/** One short sentence for the screen when a limit changed what the user asked for. */
export function limitNote(t: CalorieTarget | null): string | null {
  if (!t) return null;
  if (t.floorApplied) return `Set to ${t.floor.toLocaleString()} kcal, the safe minimum for you. A faster pace would need a doctor's supervision.`;
  if (t.paceCapped) return `Based on ${t.paceUsed} kg a week, the most we plan for at your weight.`;
  return null;
}

export const TARGET_DISCLAIMER = 'An estimate, not medical advice. Check with a doctor before a big change to your diet.';

/** Why a target weight shouldn't be planned for, or null. BMI under 18.5 is underweight. */
export function targetWeightProblem(heightCm?: number, targetKg?: number): string | null {
  if (!heightCm || !targetKg) return null;
  const bmi = targetKg / Math.pow(heightCm / 100, 2);
  if (bmi < 18.5) {
    const min = Math.ceil(18.5 * Math.pow(heightCm / 100, 2));
    return `At your height, ${targetKg} kg would be underweight. Thrive plans for ${min} kg or more; below that, please talk to a doctor.`;
  }
  return null;
}

/** Ages the app plans for. Under 13 isn't allowed (and the targets aren't made for children). */
export function ageProblem(age?: number): string | null {
  if (!age) return null;
  if (age < 13) return 'Thrive is for people aged 13 and over.';
  if (age > 100) return 'Please check the age you entered.';
  return null;
}
