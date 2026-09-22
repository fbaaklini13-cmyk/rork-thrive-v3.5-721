/**
 * The one list of fitness goals, used by every picker that writes
 * `profile.fitnessGoal`.
 *
 * Until 22 Sep the first-run questionnaire and the Edit-goals sheet each had
 * their own list, and they disagreed: onboarding wrote "Muscle Gain/Bulking",
 * "Maintain Current Weight" and "General Health & Wellness"; Edit-goals
 * offered "Muscle Gain", "Maintain Weight", "Improve Endurance" and "General
 * Fitness". So a new user who picked a goal at sign-up opened Edit-goals and
 * found nothing selected, and anyone who picked "Improve Endurance" there had
 * a goal onboarding could never have produced. The calorie estimate in
 * user-profile-store.ts keys on substrings ("weight loss", "muscle gain",
 * "bulking"), which is why the mismatch never crashed anything -- it only
 * showed the wrong thing.
 *
 * The strings below are the stored values. Change one here and both pickers
 * change; `hasWeightGoal` is the single place that decides which goals need a
 * target weight and a weekly pace.
 */
export const FITNESS_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Maintain Weight',
  'Build Strength',
  'Improve Endurance',
  'General Fitness',
] as const;

export type FitnessGoal = (typeof FITNESS_GOALS)[number];

/** Goals that need a target weight and a weekly pace. Substring-based on
 *  purpose so that legacy stored values ("Muscle Gain/Bulking") and free-text
 *  "Other" answers ("fat loss for a wedding") still get the right form. */
export const hasWeightGoal = (goal?: string | null): boolean => {
  const g = (goal ?? '').toLowerCase();
  return g.includes('weight loss') || g.includes('fat loss') || g.includes('muscle gain') || g.includes('bulking');
};
