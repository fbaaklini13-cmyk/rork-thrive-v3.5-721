import type { WorkoutPlan } from '@/types/user';

export interface ComprehensiveProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  daysPerWeek: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: string;
  category: 'strength' | 'hypertrophy' | 'endurance' | 'sport-specific' | 'split-variation';
  sportType?: string;
  splitType?: string;
  keyFeatures: string[];
  rating: number;
  enrolled: number;
  tags: string[];
  workoutPlan: Omit<WorkoutPlan, 'id' | 'createdAt'>;
}

// Helper function to create workout plan structure
const createWorkoutPlan = (
  goals: string[],
  equipment: string[],
  daysPerWeek: number,
  plan: any[]
): Omit<WorkoutPlan, 'id' | 'createdAt'> => ({
  goals,
  equipment,
  daysPerWeek,
  plan,
});

// ====================
// STRENGTH PROGRAMS
// ====================

export const STRENGTH_PROGRAMS: ComprehensiveProgram[] = [
  // 2 Days/Week Strength Programs
  {
    id: 'strength-2day-beginner',
    name: '2-Day Full-Body Strength Foundation',
    description: 'Build foundational strength with two weekly full-body sessions using compound movements. Perfect for beginners with limited time.',
    duration: '8-12 weeks',
    daysPerWeek: 2,
    difficulty: 'beginner',
    experienceLevel: 'Beginner',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      'Two full-body sessions per week',
      'Focus on major compound lifts (squat, bench, deadlift, rows)',
      '3–4 sets of 5–8 reps with heavy loads',
      'At least 2-3 days rest between sessions',
      'Evidence-based progression for novices'
    ],
    rating: 4.8,
    enrolled: 15420,
    tags: ['Beginner', 'Time-Efficient', 'Full-Body', 'Compound Lifts'],
    workoutPlan: createWorkoutPlan(
      ['Strength', 'Muscle Growth'],
      ['barbell', 'dumbbells', 'bench'],
      2,
      [
        {
          day: 'Day 1 - Full Body',
          exercises: [
            { name: 'Barbell Squat', sets: 3, reps: '5-8', notes: 'Heavy load (~80-85% 1RM)', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
            { name: 'Bench Press', sets: 3, reps: '5-8', notes: 'Compound chest movement', restPeriod: '2 minutes', muscleGroups: ['chest', 'triceps', 'shoulders'] },
            { name: 'Bent-Over Row', sets: 3, reps: '8', notes: 'Back thickness', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
            { name: 'Overhead Press', sets: 3, reps: '8', notes: 'Shoulder strength', restPeriod: '90 seconds', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Plank Hold', sets: 2, reps: '30-45 seconds', notes: 'Core stability', restPeriod: '60 seconds', muscleGroups: ['abs'] }
          ]
        },
        {
          day: 'Day 2 - Full Body',
          exercises: [
            { name: 'Deadlift', sets: 3, reps: '5', notes: 'Hip hinge pattern, heavy', restPeriod: '3 minutes', muscleGroups: ['hamstrings', 'glutes', 'back'] },
            { name: 'Dumbbell Bench Press', sets: 3, reps: '6-8', notes: 'Chest variation', restPeriod: '2 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Pull-Ups', sets: 3, reps: 'Max (or assisted)', notes: 'Back width', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
            { name: 'Bulgarian Split Squat', sets: 2, reps: '8 each leg', notes: 'Unilateral leg work', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
            { name: 'Plank Hold', sets: 2, reps: '30-45 seconds', notes: 'Core stability', restPeriod: '60 seconds', muscleGroups: ['abs'] }
          ]
        }
      ]
    )
  },
  
  {
    id: 'strength-2day-intermediate',
    name: '2-Day Heavy Strength (Intermediate)',
    description: 'Maximize strength with only two sessions per week by using higher intensity and key compound lifts. For experienced lifters with limited training days.',
    duration: '8-12 weeks',
    daysPerWeek: 2,
    difficulty: 'intermediate',
    experienceLevel: 'Intermediate',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      'High-intensity focus (~85-90% 1RM)',
      'Core lifts: Squat, Bench, Deadlift, Overhead Press',
      'Sets of 3-6 reps for maximal force',
      'Extended rest periods (2-4 minutes)',
      'Maintain strength on low frequency'
    ],
    rating: 4.6,
    enrolled: 8340,
    tags: ['Intermediate', 'Heavy Lifting', 'Low Frequency', 'Powerlifting'],
    workoutPlan: createWorkoutPlan(
      ['Strength'],
      ['barbell', 'bench', 'squat rack'],
      2,
      [
        {
          day: 'Day 1 - Lower + Push',
          exercises: [
            { name: 'Back Squat', sets: 4, reps: '4-6', notes: 'Heavy (~85% 1RM)', restPeriod: '3-4 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 4, reps: '3-5', notes: 'Heavy pressing', restPeriod: '3-4 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Romanian Deadlift', sets: 3, reps: '5', notes: 'Hip hinge strength', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'glutes'] },
            { name: 'Dips', sets: 2, reps: '6-8', notes: 'Accessory pressing', restPeriod: '90 seconds', muscleGroups: ['triceps', 'chest'] }
          ]
        },
        {
          day: 'Day 2 - Deadlift + Upper',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: '3-5', notes: 'Heavy pulling', restPeriod: '3-4 minutes', muscleGroups: ['back', 'hamstrings', 'glutes'] },
            { name: 'Overhead Press', sets: 4, reps: '3-5', notes: 'Heavy overhead', restPeriod: '3 minutes', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Weighted Pull-Ups', sets: 3, reps: '5-6', notes: 'Back strength', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
            { name: 'Barbell Row', sets: 3, reps: '5-6', notes: 'Back thickness', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] }
          ]
        }
      ]
    )
  },

  // 3 Days/Week Strength Programs
  {
    id: 'strength-3day-beginner-starting-strength',
    name: '3-Day Starting Strength (Beginner)',
    description: 'Based on Mark Rippetoe\'s Starting Strength program. Alternating A/B workouts with core compound lifts. The gold standard for novice strength training.',
    duration: '12 weeks',
    daysPerWeek: 3,
    difficulty: 'beginner',
    experienceLevel: 'Beginner',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      'Classic A/B alternating routine (Mon/Wed/Fri)',
      'Focus on squat, bench, deadlift, overhead press, row',
      'Linear progression - add weight every session',
      '3×5 or 5×5 rep scheme',
      'Proven program used by thousands of novices'
    ],
    rating: 4.9,
    enrolled: 42340,
    tags: ['Beginner', 'Starting Strength', 'Classic', 'Linear Progression'],
    workoutPlan: createWorkoutPlan(
      ['Strength'],
      ['barbell', 'bench', 'squat rack'],
      3,
      [
        {
          day: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 3, reps: '5', notes: 'Add 5-10 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 3, reps: '5', notes: 'Progressive overload', restPeriod: '2-3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Deadlift', sets: 1, reps: '5', notes: 'One heavy set', restPeriod: '3 minutes', muscleGroups: ['back', 'hamstrings'] }
          ]
        },
        {
          day: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 3, reps: '5', notes: 'Add 5-10 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Overhead Press', sets: 3, reps: '5', notes: 'Progressive overload', restPeriod: '2-3 minutes', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Barbell Row', sets: 3, reps: '5', notes: 'Back development', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] }
          ]
        },
        {
          day: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 3, reps: '5', notes: 'Add 5-10 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 3, reps: '5', notes: 'Progressive overload', restPeriod: '2-3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Deadlift', sets: 1, reps: '5', notes: 'One heavy set', restPeriod: '3 minutes', muscleGroups: ['back', 'hamstrings'] }
          ]
        }
      ]
    )
  },

  {
    id: 'strength-3day-beginner-stronglifts',
    name: '3-Day StrongLifts 5x5 (Beginner)',
    description: 'The StrongLifts 5×5 program: simple, effective, and proven. Five sets of five reps on core lifts, training three days per week.',
    duration: '12 weeks',
    daysPerWeek: 3,
    difficulty: 'beginner',
    experienceLevel: 'Beginner',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      '5 sets of 5 reps for major lifts',
      'Squat every workout',
      'Alternates Bench/Overhead Press and Row/Deadlift',
      'Add weight every successful workout',
      'Simple to follow, hard to beat results'
    ],
    rating: 4.9,
    enrolled: 38920,
    tags: ['Beginner', 'StrongLifts', '5x5', 'Linear Progression'],
    workoutPlan: createWorkoutPlan(
      ['Strength'],
      ['barbell', 'bench', 'squat rack'],
      3,
      [
        {
          day: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Barbell Row', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] }
          ]
        },
        {
          day: 'Workout B',
          exercises: [
            { name: 'Squat', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Overhead Press', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Deadlift', sets: 1, reps: '5', notes: 'One heavy set, add 10 lbs', restPeriod: '3 minutes', muscleGroups: ['back', 'hamstrings'] }
          ]
        },
        {
          day: 'Workout A',
          exercises: [
            { name: 'Squat', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2-3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Barbell Row', sets: 5, reps: '5', notes: 'Add 5 lbs each session', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] }
          ]
        }
      ]
    )
  },

  {
    id: 'strength-3day-intermediate-texas',
    name: '3-Day Texas Method (Intermediate)',
    description: 'The Texas Method: Volume Day, Light Day, Intensity Day. A periodized weekly approach for intermediate lifters who have exhausted linear progression.',
    duration: '12-16 weeks',
    daysPerWeek: 3,
    difficulty: 'intermediate',
    experienceLevel: 'Intermediate',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      'Volume Day (5×5), Light Day (2×5), Intensity Day (1×5 heavy)',
      'Weekly periodization pattern',
      'For lifters who can no longer add weight every session',
      'Targets squat, bench, overhead press, deadlift',
      'Evidence-based intermediate progression'
    ],
    rating: 4.7,
    enrolled: 16540,
    tags: ['Intermediate', 'Texas Method', 'Periodization', 'Weekly Progression'],
    workoutPlan: createWorkoutPlan(
      ['Strength'],
      ['barbell', 'bench', 'squat rack'],
      3,
      [
        {
          day: 'Monday - Volume Day',
          exercises: [
            { name: 'Squat', sets: 5, reps: '5', notes: 'Volume (~90% of 5RM)', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 5, reps: '5', notes: 'Volume (~90% of 5RM)', restPeriod: '2-3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Deadlift', sets: 1, reps: '5', notes: 'Heavy single set', restPeriod: '3 minutes', muscleGroups: ['back', 'hamstrings'] }
          ]
        },
        {
          day: 'Wednesday - Light Day',
          exercises: [
            { name: 'Squat', sets: 2, reps: '5', notes: 'Light (80% of Monday)', restPeriod: '2 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Overhead Press', sets: 3, reps: '5', notes: 'Work up in weight', restPeriod: '2 minutes', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Pull-Ups', sets: 3, reps: '8-10', notes: 'Back work', restPeriod: '90 seconds', muscleGroups: ['back', 'biceps'] },
            { name: 'Back Extensions', sets: 3, reps: '10', notes: 'Lower back', restPeriod: '60 seconds', muscleGroups: ['lower back'] }
          ]
        },
        {
          day: 'Friday - Intensity Day',
          exercises: [
            { name: 'Squat', sets: 1, reps: '5', notes: 'New 5RM PR attempt', restPeriod: '3-4 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Bench Press', sets: 1, reps: '5', notes: 'New 5RM PR attempt', restPeriod: '3-4 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Barbell Row', sets: 5, reps: '5', notes: 'Back thickness', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] }
          ]
        }
      ]
    )
  },

  // 4 Days/Week Strength Programs
  {
    id: 'strength-4day-intermediate-upper-lower',
    name: '4-Day Upper/Lower Strength Split (Intermediate)',
    description: 'Classic upper/lower split for strength: two upper body and two lower body sessions per week. Train each muscle group twice weekly with adequate recovery.',
    duration: '12 weeks',
    daysPerWeek: 4,
    difficulty: 'intermediate',
    experienceLevel: 'Intermediate',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      'Mon/Thu Upper Body, Tue/Fri Lower Body',
      'Heavy compound lifts (5-6 reps)',
      'Twice weekly frequency per muscle group',
      'Balance between volume and intensity',
      'Ideal for intermediate strength gains'
    ],
    rating: 4.8,
    enrolled: 24560,
    tags: ['Intermediate', 'Upper/Lower', '4-Day Split', 'Twice Weekly Frequency'],
    workoutPlan: createWorkoutPlan(
      ['Strength'],
      ['barbell', 'dumbbells', 'cable'],
      4,
      [
        {
          day: 'Monday - Upper Heavy',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '4-6', notes: 'Heavy pressing', restPeriod: '3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Bent-Over Row', sets: 4, reps: '5-6', notes: 'Back thickness', restPeriod: '2-3 minutes', muscleGroups: ['back', 'biceps'] },
            { name: 'Overhead Press', sets: 3, reps: '5-6', notes: 'Shoulder strength', restPeriod: '2 minutes', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Weighted Pull-Ups', sets: 3, reps: '5-6', notes: 'Lat width', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
            { name: 'Barbell Curl', sets: 2, reps: '8', notes: 'Bicep work', restPeriod: '90 seconds', muscleGroups: ['biceps'] }
          ]
        },
        {
          day: 'Tuesday - Lower Heavy',
          exercises: [
            { name: 'Squat', sets: 4, reps: '4-6', notes: 'Heavy squatting', restPeriod: '3-4 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Deadlift', sets: 3, reps: '4-6', notes: 'Heavy pulling', restPeriod: '3-4 minutes', muscleGroups: ['back', 'hamstrings'] },
            { name: 'Leg Press', sets: 3, reps: '8', notes: 'Quad accessory', restPeriod: '2 minutes', muscleGroups: ['quads'] },
            { name: 'Leg Curl', sets: 3, reps: '10', notes: 'Hamstring isolation', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] }
          ]
        },
        {
          day: 'Thursday - Upper Volume',
          exercises: [
            { name: 'Incline Bench Press', sets: 4, reps: '6-8', notes: 'Upper chest', restPeriod: '2 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Lat Pulldown', sets: 4, reps: '8-10', notes: 'Back width', restPeriod: '90 seconds', muscleGroups: ['back', 'biceps'] },
            { name: 'Dumbbell Shoulder Press', sets: 3, reps: '8', notes: 'Shoulder volume', restPeriod: '90 seconds', muscleGroups: ['shoulders'] },
            { name: 'Cable Row', sets: 3, reps: '8-10', notes: 'Back thickness', restPeriod: '90 seconds', muscleGroups: ['back'] },
            { name: 'Tricep Dips', sets: 2, reps: '8-10', notes: 'Tricep mass', restPeriod: '90 seconds', muscleGroups: ['triceps'] }
          ]
        },
        {
          day: 'Friday - Lower Volume',
          exercises: [
            { name: 'Front Squat', sets: 3, reps: '6-8', notes: 'Quad focus', restPeriod: '2-3 minutes', muscleGroups: ['quads'] },
            { name: 'Romanian Deadlift', sets: 3, reps: '6-8', notes: 'Hamstring/glute', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'glutes'] },
            { name: 'Bulgarian Split Squat', sets: 3, reps: '8 each', notes: 'Unilateral work', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
            { name: 'Calf Raises', sets: 4, reps: '12', notes: 'Calf development', restPeriod: '60 seconds', muscleGroups: ['calves'] }
          ]
        }
      ]
    )
  },

  {
    id: 'strength-4day-advanced-531',
    name: '4-Day 5/3/1 (Advanced)',
    description: 'Jim Wendler\'s 5/3/1: a 4-week cycle program alternating rep schemes. Train bench, squat, overhead press, and deadlift with progressive percentages.',
    duration: '16 weeks (4 cycles)',
    daysPerWeek: 4,
    difficulty: 'advanced',
    experienceLevel: 'Advanced',
    primaryGoal: 'Strength',
    category: 'strength',
    keyFeatures: [
      '4-week cycles: 5s week, 3s week, 5/3/1 week, deload',
      'Work with 90% training max for calculations',
      'Each day focuses on one main lift',
      'Includes assistance work (BBB, FSL, etc.)',
      'Proven long-term strength progression'
    ],
    rating: 4.9,
    enrolled: 19870,
    tags: ['Advanced', '5/3/1', 'Wendler', 'Periodization', 'Long-term'],
    workoutPlan: createWorkoutPlan(
      ['Strength'],
      ['barbell', 'dumbbells', 'bench'],
      4,
      [
        {
          day: 'Monday - Overhead Press',
          exercises: [
            { name: 'Overhead Press', sets: 3, reps: 'Varies by week (5/3/1+)', notes: 'Main lift - work up to top set AMRAP', restPeriod: '3 minutes', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Overhead Press', sets: 5, reps: '10', notes: 'BBB assistance (50-60% TM)', restPeriod: '90 seconds', muscleGroups: ['shoulders', 'triceps'] },
            { name: 'Lat Pulldown', sets: 5, reps: '10', notes: 'Pulling assistance', restPeriod: '90 seconds', muscleGroups: ['back'] },
            { name: 'Lateral Raises', sets: 5, reps: '15', notes: 'Shoulder accessory', restPeriod: '60 seconds', muscleGroups: ['shoulders'] }
          ]
        },
        {
          day: 'Tuesday - Deadlift',
          exercises: [
            { name: 'Deadlift', sets: 3, reps: 'Varies by week (5/3/1+)', notes: 'Main lift - work up to top set AMRAP', restPeriod: '3-4 minutes', muscleGroups: ['back', 'hamstrings', 'glutes'] },
            { name: 'Deadlift', sets: 5, reps: '10', notes: 'BBB assistance (50-60% TM)', restPeriod: '2 minutes', muscleGroups: ['back', 'hamstrings'] },
            { name: 'Hanging Leg Raise', sets: 5, reps: '10', notes: 'Core work', restPeriod: '60 seconds', muscleGroups: ['abs'] },
            { name: 'Back Extension', sets: 5, reps: '15', notes: 'Lower back', restPeriod: '60 seconds', muscleGroups: ['lower back'] }
          ]
        },
        {
          day: 'Thursday - Bench Press',
          exercises: [
            { name: 'Bench Press', sets: 3, reps: 'Varies by week (5/3/1+)', notes: 'Main lift - work up to top set AMRAP', restPeriod: '3 minutes', muscleGroups: ['chest', 'triceps'] },
            { name: 'Bench Press', sets: 5, reps: '10', notes: 'BBB assistance (50-60% TM)', restPeriod: '90 seconds', muscleGroups: ['chest', 'triceps'] },
            { name: 'Barbell Row', sets: 5, reps: '10', notes: 'Back work', restPeriod: '90 seconds', muscleGroups: ['back'] },
            { name: 'Dips', sets: 5, reps: '15', notes: 'Tricep/chest accessory', restPeriod: '60 seconds', muscleGroups: ['triceps', 'chest'] }
          ]
        },
        {
          day: 'Friday - Squat',
          exercises: [
            { name: 'Squat', sets: 3, reps: 'Varies by week (5/3/1+)', notes: 'Main lift - work up to top set AMRAP', restPeriod: '3-4 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Squat', sets: 5, reps: '10', notes: 'BBB assistance (50-60% TM)', restPeriod: '2 minutes', muscleGroups: ['quads', 'glutes'] },
            { name: 'Leg Curl', sets: 5, reps: '10', notes: 'Hamstring work', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] },
            { name: 'Ab Wheel', sets: 5, reps: '15', notes: 'Core work', restPeriod: '60 seconds', muscleGroups: ['abs'] }
          ]
        }
      ]
    )
  },

  // Additional strength programs (5-6 days) to be added
  // Space reserved for more variations
];

// ====================
// HYPERTROPHY PROGRAMS
// ====================

export const HYPERTROPHY_PROGRAMS: ComprehensiveProgram[] = [
  // (Programs will be added here in next section)
];

// ====================
// ENDURANCE PROGRAMS
// ====================

export const ENDURANCE_PROGRAMS: ComprehensiveProgram[] = [
  // (Programs will be added here in next section)
];

// ====================
// SPORT-SPECIFIC PROGRAMS
// ====================

export const SPORT_SPECIFIC_PROGRAMS: ComprehensiveProgram[] = [
  // (Programs will be added here in next section)
];

// ====================
// ALL PROGRAMS COMBINED
// ====================

export const ALL_COMPREHENSIVE_PROGRAMS: ComprehensiveProgram[] = [
  ...STRENGTH_PROGRAMS,
  ...HYPERTROPHY_PROGRAMS,
  ...ENDURANCE_PROGRAMS,
  ...SPORT_SPECIFIC_PROGRAMS,
];
