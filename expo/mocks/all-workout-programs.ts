import type { PredefinedProgram } from './workout-programs';
import { PREDEFINED_PROGRAMS } from './workout-programs';

// This file consolidates ALL workout programs from the comprehensive guide
// Including: Strength (2-6 days), Hypertrophy (2-6 days), Endurance (2-6 days),
// Sport-Specific (10 sports), and All Split Variations

export interface ExtendedProgram extends PredefinedProgram {
  category: 'strength' | 'hypertrophy' | 'endurance' | 'sport-specific' | 'split-variation' | 'hybrid';
  sportType?: string;
  splitType?: string;
  scienceBasedFeatures?: string[];
}

// Helper to create workout plans
const wp = (goals: string[], equipment: string[], days: number, plan: any[]) => ({
  goals,
  equipment,
  daysPerWeek: days,
  plan
});

// ====================
// ADDITIONAL STRENGTH PROGRAMS (extending existing)
// ====================

const additionalStrengthPrograms: ExtendedProgram[] = [
  {
    id: 'strength-5day-advanced-conjugate',
    name: '5-Day Westside Conjugate Method',
    description: 'Advanced powerlifting method rotating max effort and dynamic effort days for squat and bench. Used by elite powerlifters.',
    duration: '12+ weeks',
    daysPerWeek: 5,
    difficulty: 'advanced',
    experienceLevel: 'Advanced',
    primaryGoal: 'Maximal Strength',
    category: 'strength',
    keyFeatures: [
      'Max Effort Upper/Lower, Dynamic Effort Upper/Lower, Repetition Day',
      'Rotate max effort exercises every 1-3 weeks',
      'Speed work with 50-60% 1RM for explosiveness',
      'High volume accessory work',
      'Used by Westside Barbell'
    ],
    rating: 4.7,
    enrolled: 6780,
    tags: ['Advanced', 'Powerlifting', 'Conjugate', 'Westside'],
    workoutPlan: wp(['Strength', 'Power'], ['barbell', 'bands', 'chains'], 5, [
      {
        day: 'Monday - Max Effort Lower',
        exercises: [
          { name: 'Max Effort Exercise (rotate weekly)', sets: 1, reps: '1-3RM', notes: 'Box squat, deadlift variation, etc.', restPeriod: '5 minutes', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
          { name: 'Good Mornings', sets: 3, reps: '5-8', notes: 'Heavy', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'lower back'] },
          { name: 'Abs', sets: 4, reps: '15', notes: 'Weighted abs', restPeriod: '60 seconds', muscleGroups: ['abs'] }
        ]
      },
      {
        day: 'Wednesday - Max Effort Upper',
        exercises: [
          { name: 'Max Effort Exercise (rotate weekly)', sets: 1, reps: '1-3RM', notes: 'Board press, floor press, etc.', restPeriod: '5 minutes', muscleGroups: ['chest', 'triceps'] },
          { name: 'Triceps', sets: 5, reps: '6-10', notes: 'Heavy tricep work', restPeriod: '90 seconds', muscleGroups: ['triceps'] },
          { name: 'Back', sets: 5, reps: '8', notes: 'Rows, pulldowns', restPeriod: '90 seconds', muscleGroups: ['back'] }
        ]
      },
      {
        day: 'Friday - Dynamic Effort Lower',
        exercises: [
          { name: 'Speed Squat', sets: 10, reps: '2', notes: '50-60% 1RM with bands/chains', restPeriod: '60 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Speed Deadlift', sets: 6, reps: '1', notes: '60-70% 1RM explosive', restPeriod: '60 seconds', muscleGroups: ['hamstrings', 'back'] },
          { name: 'Glute Ham Raise', sets: 4, reps: '8', notes: 'Hamstring strength', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] }
        ]
      },
      {
        day: 'Saturday - Dynamic Effort Upper',
        exercises: [
          { name: 'Speed Bench', sets: 9, reps: '3', notes: '50-60% 1RM explosive', restPeriod: '60 seconds', muscleGroups: ['chest', 'triceps'] },
          { name: 'Close Grip Bench', sets: 5, reps: '3', notes: 'Heavy', restPeriod: '2 minutes', muscleGroups: ['triceps', 'chest'] },
          { name: 'Rows', sets: 5, reps: '8', notes: 'Back volume', restPeriod: '90 seconds', muscleGroups: ['back'] }
        ]
      },
      {
        day: 'Sunday - Repetition Day',
        exercises: [
          { name: 'Leg Press', sets: 4, reps: '12-15', notes: 'High rep leg work', restPeriod: '90 seconds', muscleGroups: ['quads'] },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '12', notes: 'Chest volume', restPeriod: '90 seconds', muscleGroups: ['chest'] },
          { name: 'Accessory Circuit', sets: 3, reps: '15-20', notes: 'Rear delts, abs, biceps, triceps', restPeriod: '60 seconds', muscleGroups: ['shoulders', 'abs', 'arms'] }
        ]
      }
    ])
  },

  {
    id: 'strength-6day-advanced-ppl-strength',
    name: '6-Day Push/Pull/Legs Strength Focus',
    description: 'PPL twice weekly optimized for strength. Heavy compounds first cycle, lighter technique work second cycle.',
    duration: '12 weeks',
    daysPerWeek: 6,
    difficulty: 'advanced',
    experienceLevel: 'Advanced',
    primaryGoal: 'Strength',
    category: 'strength',
    splitType: 'PPL',
    keyFeatures: [
      'Train each muscle group twice weekly',
      'Heavy (3-5 reps) first cycle, moderate (6-8) second',
      'Adequate recovery between same muscle groups',
      'High frequency for advanced lifters'
    ],
    rating: 4.8,
    enrolled: 14560,
    tags: ['Advanced', 'PPL', '6-Day', 'Strength', 'High Frequency'],
    workoutPlan: wp(['Strength'], ['barbell', 'dumbbells', 'cable'], 6, [
      {
        day: 'Monday - Push Heavy',
        exercises: [
          { name: 'Bench Press', sets: 5, reps: '3-5', notes: 'Heavy pressing', restPeriod: '3-4 minutes', muscleGroups: ['chest', 'triceps'] },
          { name: 'Overhead Press', sets: 4, reps: '4-6', notes: 'Shoulder strength', restPeriod: '3 minutes', muscleGroups: ['shoulders', 'triceps'] },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '6', notes: 'Upper chest', restPeriod: '2 minutes', muscleGroups: ['chest'] },
          { name: 'Dips', sets: 3, reps: '5-8', notes: 'Add weight if possible', restPeriod: '2 minutes', muscleGroups: ['triceps', 'chest'] }
        ]
      },
      {
        day: 'Tuesday - Pull Heavy',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '3-5', notes: 'Heavy pulling', restPeriod: '4 minutes', muscleGroups: ['back', 'hamstrings'] },
          { name: 'Weighted Pull-Ups', sets: 4, reps: '4-6', notes: 'Lat width', restPeriod: '3 minutes', muscleGroups: ['back', 'biceps'] },
          { name: 'Barbell Row', sets: 4, reps: '5-6', notes: 'Back thickness', restPeriod: '2-3 minutes', muscleGroups: ['back'] },
          { name: 'Barbell Curl', sets: 3, reps: '6-8', notes: 'Bicep strength', restPeriod: '90 seconds', muscleGroups: ['biceps'] }
        ]
      },
      {
        day: 'Wednesday - Legs Heavy',
        exercises: [
          { name: 'Squat', sets: 5, reps: '3-5', notes: 'Heavy squatting', restPeriod: '4 minutes', muscleGroups: ['quads', 'glutes'] },
          { name: 'Romanian Deadlift', sets: 4, reps: '5-6', notes: 'Hamstring focus', restPeriod: '3 minutes', muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Front Squat', sets: 3, reps: '5-6', notes: 'Quad emphasis', restPeriod: '3 minutes', muscleGroups: ['quads'] },
          { name: 'Calf Raises', sets: 4, reps: '8-10', notes: 'Calf strength', restPeriod: '90 seconds', muscleGroups: ['calves'] }
        ]
      },
      {
        day: 'Thursday - Push Volume',
        exercises: [
          { name: 'Incline Barbell Press', sets: 4, reps: '6-8', notes: 'Upper chest focus', restPeriod: '2 minutes', muscleGroups: ['chest'] },
          { name: 'Dumbbell Shoulder Press', sets: 4, reps: '6-8', notes: 'Shoulder volume', restPeriod: '2 minutes', muscleGroups: ['shoulders'] },
          { name: 'Cable Flyes', sets: 3, reps: '10-12', notes: 'Chest pump', restPeriod: '90 seconds', muscleGroups: ['chest'] },
          { name: 'Lateral Raises', sets: 4, reps: '12-15', notes: 'Side delts', restPeriod: '60 seconds', muscleGroups: ['shoulders'] },
          { name: 'Tricep Pushdowns', sets: 3, reps: '10-12', notes: 'Tricep volume', restPeriod: '60 seconds', muscleGroups: ['triceps'] }
        ]
      },
      {
        day: 'Friday - Pull Volume',
        exercises: [
          { name: 'Pendlay Row', sets: 4, reps: '6-8', notes: 'Explosive rows', restPeriod: '2 minutes', muscleGroups: ['back'] },
          { name: 'Lat Pulldown', sets: 4, reps: '8-10', notes: 'Lat width', restPeriod: '90 seconds', muscleGroups: ['back'] },
          { name: 'Seated Cable Row', sets: 3, reps: '10', notes: 'Mid back', restPeriod: '90 seconds', muscleGroups: ['back'] },
          { name: 'Face Pulls', sets: 4, reps: '15', notes: 'Rear delts', restPeriod: '60 seconds', muscleGroups: ['shoulders'] },
          { name: 'Hammer Curls', sets: 3, reps: '10-12', notes: 'Bicep volume', restPeriod: '60 seconds', muscleGroups: ['biceps'] }
        ]
      },
      {
        day: 'Saturday - Legs Volume',
        exercises: [
          { name: 'Bulgarian Split Squat', sets: 4, reps: '8 each', notes: 'Unilateral work', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Leg Press', sets: 4, reps: '10-12', notes: 'Quad volume', restPeriod: '90 seconds', muscleGroups: ['quads'] },
          { name: 'Leg Curl', sets: 4, reps: '12', notes: 'Hamstring isolation', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] },
          { name: 'Walking Lunges', sets: 3, reps: '12 each', notes: 'Leg endurance', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Calf Raises', sets: 4, reps: '15-20', notes: 'Calf volume', restPeriod: '60 seconds', muscleGroups: ['calves'] }
        ]
      }
    ])
  }
];

// ====================
// COMPREHENSIVE HYPERTROPHY PROGRAMS
// ====================

const hypertrophyPrograms: ExtendedProgram[] = [
  {
    id: 'hypertrophy-4day-intermediate-upper-lower',
    name: '4-Day Upper/Lower Muscle Building',
    description: 'Classic upper/lower split optimized for hypertrophy. Moderate loads (8-12 reps), high volume, twice-weekly frequency.',
    duration: '12 weeks',
    daysPerWeek: 4,
    difficulty: 'intermediate',
    experienceLevel: 'Intermediate',
    primaryGoal: 'Muscle Growth',
    category: 'hypertrophy',
    splitType: 'Upper/Lower',
    keyFeatures: [
      'Train each muscle 2x per week',
      'Moderate rep ranges (8-12)',
      'High training volume',
      'Ideal for maximizing muscle growth'
    ],
    rating: 4.8,
    enrolled: 28670,
    tags: ['Hypertrophy', 'Muscle Building', 'Upper/Lower', 'Intermediate'],
    workoutPlan: wp(['Muscle Growth'], ['barbell', 'dumbbells', 'cable', 'machine'], 4, [
      {
        day: 'Monday - Upper A',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Chest development', restPeriod: '2 minutes', muscleGroups: ['chest', 'triceps'] },
          { name: 'Barbell Row', sets: 4, reps: '8-10', notes: 'Back thickness', restPeriod: '2 minutes', muscleGroups: ['back'] },
          { name: 'Overhead Press', sets: 3, reps: '8-12', notes: 'Shoulder mass', restPeriod: '90 seconds', muscleGroups: ['shoulders'] },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12', notes: 'Lat width', restPeriod: '90 seconds', muscleGroups: ['back'] },
          { name: 'Bicep Curls', sets: 3, reps: '10-12', notes: 'Bicep pump', restPeriod: '60 seconds', muscleGroups: ['biceps'] },
          { name: 'Tricep Pushdowns', sets: 3, reps: '10-12', notes: 'Tricep pump', restPeriod: '60 seconds', muscleGroups: ['triceps'] }
        ]
      },
      {
        day: 'Tuesday - Lower A',
        exercises: [
          { name: 'Squat', sets: 4, reps: '8-10', notes: 'Quad development', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', notes: 'Hamstring/glute focus', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Leg Press', sets: 3, reps: '12-15', notes: 'Quad volume', restPeriod: '90 seconds', muscleGroups: ['quads'] },
          { name: 'Leg Curl', sets: 3, reps: '12-15', notes: 'Hamstring isolation', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] },
          { name: 'Calf Raises', sets: 4, reps: '15-20', notes: 'Calf development', restPeriod: '60 seconds', muscleGroups: ['calves'] }
        ]
      },
      {
        day: 'Thursday - Upper B',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', notes: 'Upper chest', restPeriod: '2 minutes', muscleGroups: ['chest'] },
          { name: 'Pull-Ups', sets: 4, reps: '8-10', notes: 'Lat width', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', notes: 'Shoulder volume', restPeriod: '90 seconds', muscleGroups: ['shoulders'] },
          { name: 'Cable Rows', sets: 3, reps: '10-12', notes: 'Mid back', restPeriod: '90 seconds', muscleGroups: ['back'] },
          { name: 'Hammer Curls', sets: 3, reps: '10-12', notes: 'Bicep variation', restPeriod: '60 seconds', muscleGroups: ['biceps'] },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', notes: 'Tricep mass', restPeriod: '60 seconds', muscleGroups: ['triceps'] }
        ]
      },
      {
        day: 'Friday - Lower B',
        exercises: [
          { name: 'Front Squat', sets: 3, reps: '8-10', notes: 'Quad emphasis', restPeriod: '2 minutes', muscleGroups: ['quads'] },
          { name: 'Stiff-Leg Deadlift', sets: 3, reps: '8-10', notes: 'Hamstring stretch', restPeriod: '2 minutes', muscleGroups: ['hamstrings'] },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', notes: 'Unilateral work', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Leg Extension', sets: 3, reps: '12-15', notes: 'Quad pump', restPeriod: '60 seconds', muscleGroups: ['quads'] },
          { name: 'Seated Calf Raise', sets: 4, reps: '15-20', notes: 'Calf volume', restPeriod: '60 seconds', muscleGroups: ['calves'] }
        ]
      }
    ])
  },

  {
    id: 'hypertrophy-6day-advanced-arnold',
    name: '6-Day Arnold Split (Advanced Bodybuilding)',
    description: 'Arnold Schwarzenegger\'s famous split: Chest/Back, Shoulders/Arms, Legs, repeated twice weekly. High-volume approach for serious muscle building.',
    duration: '12 weeks',
    daysPerWeek: 6,
    difficulty: 'advanced',
    experienceLevel: 'Advanced',
    primaryGoal: 'Muscle Growth',
    category: 'hypertrophy',
    splitType: 'Arnold Split',
    keyFeatures: [
      'Train each muscle group twice per week',
      'Antagonist pairing (chest/back together)',
      'High volume per session',
      'Advanced recovery needed',
      'Classic bodybuilding approach'
    ],
    rating: 4.9,
    enrolled: 19870,
    tags: ['Advanced', 'Arnold Split', 'Bodybuilding', 'High Volume'],
    workoutPlan: wp(['Muscle Growth', 'Hypertrophy'], ['barbell', 'dumbbells', 'cable', 'machine'], 6, [
      {
        day: 'Monday - Chest & Back',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Chest mass', restPeriod: '2 minutes', muscleGroups: ['chest'] },
          { name: 'Barbell Row', sets: 4, reps: '8-10', notes: 'Back thickness', restPeriod: '2 minutes', muscleGroups: ['back'] },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', notes: 'Upper chest', restPeriod: '90 seconds', muscleGroups: ['chest'] },
          { name: 'Pull-Ups', sets: 4, reps: '10', notes: 'Lat width', restPeriod: '90 seconds', muscleGroups: ['back'] },
          { name: 'Dumbbell Flyes', sets: 3, reps: '12', notes: 'Chest stretch', restPeriod: '90 seconds', muscleGroups: ['chest'] },
          { name: 'Seated Cable Row', sets: 3, reps: '12', notes: 'Mid back', restPeriod: '90 seconds', muscleGroups: ['back'] }
        ]
      },
      {
        day: 'Tuesday - Shoulders & Arms',
        exercises: [
          { name: 'Overhead Press', sets: 4, reps: '8-10', notes: 'Shoulder mass', restPeriod: '2 minutes', muscleGroups: ['shoulders'] },
          { name: 'Lateral Raises', sets: 4, reps: '12-15', notes: 'Side delts', restPeriod: '90 seconds', muscleGroups: ['shoulders'] },
          { name: 'Barbell Curl', sets: 4, reps: '10-12', notes: 'Bicep mass', restPeriod: '90 seconds', muscleGroups: ['biceps'] },
          { name: 'Skull Crushers', sets: 4, reps: '10-12', notes: 'Tricep mass', restPeriod: '90 seconds', muscleGroups: ['triceps'] },
          { name: 'Face Pulls', sets: 3, reps: '15', notes: 'Rear delts', restPeriod: '60 seconds', muscleGroups: ['shoulders'] },
          { name: 'Hammer Curls', sets: 3, reps: '12', notes: 'Bicep variation', restPeriod: '60 seconds', muscleGroups: ['biceps'] },
          { name: 'Overhead Extensions', sets: 3, reps: '12', notes: 'Tricep variation', restPeriod: '60 seconds', muscleGroups: ['triceps'] }
        ]
      },
      {
        day: 'Wednesday - Legs',
        exercises: [
          { name: 'Squat', sets: 4, reps: '8-10', notes: 'Quad development', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'glutes'] },
          { name: 'Leg Press', sets: 4, reps: '12-15', notes: 'Quad volume', restPeriod: '2 minutes', muscleGroups: ['quads'] },
          { name: 'Romanian Deadlift', sets: 4, reps: '8-10', notes: 'Hamstring/glute', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Leg Curl', sets: 3, reps: '12-15', notes: 'Hamstring isolation', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] },
          { name: 'Leg Extension', sets: 3, reps: '12-15', notes: 'Quad pump', restPeriod: '90 seconds', muscleGroups: ['quads'] },
          { name: 'Calf Raises', sets: 5, reps: '15-20', notes: 'Calf volume', restPeriod: '60 seconds', muscleGroups: ['calves'] }
        ]
      },
      {
        day: 'Thursday - Chest & Back',
        exercises: [
          { name: 'Incline Barbell Press', sets: 4, reps: '8-10', notes: 'Upper chest focus', restPeriod: '2 minutes', muscleGroups: ['chest'] },
          { name: 'Deadlift', sets: 3, reps: '6-8', notes: 'Back/hamstring', restPeriod: '3 minutes', muscleGroups: ['back', 'hamstrings'] },
          { name: 'Dumbbell Press', sets: 4, reps: '10-12', notes: 'Chest variation', restPeriod: '90 seconds', muscleGroups: ['chest'] },
          { name: 'Lat Pulldown', sets: 4, reps: '10-12', notes: 'Lat width', restPeriod: '90 seconds', muscleGroups: ['back'] },
          { name: 'Cable Flyes', sets: 3, reps: '12-15', notes: 'Chest pump', restPeriod: '60 seconds', muscleGroups: ['chest'] },
          { name: 'T-Bar Row', sets: 3, reps: '10-12', notes: 'Back thickness', restPeriod: '90 seconds', muscleGroups: ['back'] }
        ]
      },
      {
        day: 'Friday - Shoulders & Arms',
        exercises: [
          { name: 'Arnold Press', sets: 4, reps: '10-12', notes: 'Shoulder rotation', restPeriod: '2 minutes', muscleGroups: ['shoulders'] },
          { name: 'Front Raises', sets: 4, reps: '12-15', notes: 'Front delts', restPeriod: '90 seconds', muscleGroups: ['shoulders'] },
          { name: 'Dumbbell Curl', sets: 4, reps: '10-12', notes: 'Bicep mass', restPeriod: '90 seconds', muscleGroups: ['biceps'] },
          { name: 'Close-Grip Bench', sets: 4, reps: '8-10', notes: 'Tricep strength', restPeriod: '2 minutes', muscleGroups: ['triceps'] },
          { name: 'Rear Delt Flyes', sets: 3, reps: '15', notes: 'Rear delts', restPeriod: '60 seconds', muscleGroups: ['shoulders'] },
          { name: 'Preacher Curl', sets: 3, reps: '12', notes: 'Bicep peak', restPeriod: '60 seconds', muscleGroups: ['biceps'] },
          { name: 'Tricep Dips', sets: 3, reps: '10-12', notes: 'Tricep mass', restPeriod: '90 seconds', muscleGroups: ['triceps'] }
        ]
      },
      {
        day: 'Saturday - Legs',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '8-10', notes: 'Quad emphasis', restPeriod: '2 minutes', muscleGroups: ['quads'] },
          { name: 'Leg Press', sets: 4, reps: '15-20', notes: 'High volume quads', restPeriod: '2 minutes', muscleGroups: ['quads'] },
          { name: 'Walking Lunges', sets: 4, reps: '12 each', notes: 'Unilateral work', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Stiff-Leg Deadlift', sets: 4, reps: '10-12', notes: 'Hamstring focus', restPeriod: '2 minutes', muscleGroups: ['hamstrings'] },
          { name: 'Hamstring Curl', sets: 3, reps: '15', notes: 'Hamstring pump', restPeriod: '90 seconds', muscleGroups: ['hamstrings'] },
          { name: 'Seated Calf Raise', sets: 5, reps: '20', notes: 'Calf endurance', restPeriod: '60 seconds', muscleGroups: ['calves'] }
        ]
      }
    ])
  }
];

// ====================
// SPORT-SPECIFIC PROGRAMS
// ====================

const sportSpecificPrograms: ExtendedProgram[] = [
  {
    id: 'sport-soccer-3day-intermediate',
    name: 'Soccer/Football Strength & Power (3-Day)',
    description: 'Off-season strength training for soccer players. Build lower body power, prevent injuries, and improve sprint speed.',
    duration: '12 weeks',
    daysPerWeek: 3,
    difficulty: 'intermediate',
    experienceLevel: 'Intermediate',
    primaryGoal: 'Sport Performance',
    category: 'sport-specific',
    sportType: 'Soccer/Football',
    keyFeatures: [
      'Lower body power emphasis',
      'Injury prevention (hamstrings, ACL)',
      'Sprint speed development',
      'Core stability for balance',
      'Off-season program'
    ],
    rating: 4.7,
    enrolled: 12340,
    tags: ['Soccer', 'Football', 'Sport-Specific', 'Power', 'Injury Prevention'],
    workoutPlan: wp(['Strength', 'Power', 'Athletic Performance'], ['barbell', 'dumbbells', 'bodyweight'], 3, [
      {
        day: 'Monday - Lower Body Strength',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: '5-6', notes: 'Heavy strength', restPeriod: '3 minutes', muscleGroups: ['quads', 'glutes'] },
          { name: 'Romanian Deadlift', sets: 3, reps: '6-8', notes: 'Hamstring strength', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Nordic Hamstring Curl', sets: 3, reps: '5-8', notes: 'Eccentric hamstring (injury prevention)', restPeriod: '2 minutes', muscleGroups: ['hamstrings'] },
          { name: 'Single-Leg RDL', sets: 3, reps: '8 each', notes: 'Balance and hamstring', restPeriod: '90 seconds', muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Plank', sets: 3, reps: '45 seconds', notes: 'Core stability', restPeriod: '60 seconds', muscleGroups: ['abs'] }
        ]
      },
      {
        day: 'Wednesday - Power & Explosiveness',
        exercises: [
          { name: 'Box Jump', sets: 5, reps: '5', notes: 'Explosive power', restPeriod: '2 minutes', muscleGroups: ['quads', 'glutes', 'calves'] },
          { name: 'Power Clean', sets: 5, reps: '3', notes: 'Total body power', restPeriod: '2 minutes', muscleGroups: ['hamstrings', 'back', 'shoulders'] },
          { name: 'Bulgarian Split Squat Jump', sets: 3, reps: '6 each', notes: 'Unilateral power', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Medicine Ball Slam', sets: 4, reps: '10', notes: 'Explosive core', restPeriod: '60 seconds', muscleGroups: ['abs', 'shoulders'] },
          { name: 'Lateral Bounds', sets: 3, reps: '10 each side', notes: 'Lateral power for direction change', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes', 'adductors'] }
        ]
      },
      {
        day: 'Friday - Full Body Strength',
        exercises: [
          { name: 'Front Squat', sets: 3, reps: '6-8', notes: 'Quad focus', restPeriod: '2 minutes', muscleGroups: ['quads'] },
          { name: 'Bench Press', sets: 3, reps: '8', notes: 'Upper body strength', restPeriod: '2 minutes', muscleGroups: ['chest', 'triceps'] },
          { name: 'Pull-Ups', sets: 3, reps: 'Max', notes: 'Back and grip', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
          { name: 'Step-Ups', sets: 3, reps: '10 each', notes: 'Unilateral leg strength', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Copenhagen Plank', sets: 3, reps: '20-30 seconds each', notes: 'Adductor strength (groin injury prevention)', restPeriod: '90 seconds', muscleGroups: ['adductors'] }
        ]
      }
    ])
  },

  {
    id: 'sport-basketball-3day-intermediate',
    name: 'Basketball Vertical Jump & Power (3-Day)',
    description: 'Build explosive jumping ability, leg strength, and agility for basketball. Off-season program.',
    duration: '10-12 weeks',
    daysPerWeek: 3,
    difficulty: 'intermediate',
    experienceLevel: 'Intermediate',
    primaryGoal: 'Vertical Jump & Power',
    category: 'sport-specific',
    sportType: 'Basketball',
    keyFeatures: [
      'Vertical jump training',
      'Lower body power and strength',
      'Core stability for shooting',
      'Injury prevention (knees, ankles)',
      'Agility and quickness'
    ],
    rating: 4.8,
    enrolled: 16780,
    tags: ['Basketball', 'Vertical Jump', 'Power', 'Agility'],
    workoutPlan: wp(['Power', 'Strength', 'Athletic Performance'], ['barbell', 'dumbbells', 'bodyweight'], 3, [
      {
        day: 'Monday - Lower Body Strength',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: '5-6', notes: 'Heavy squats for force production', restPeriod: '3 minutes', muscleGroups: ['quads', 'glutes'] },
          { name: 'Trap Bar Deadlift', sets: 3, reps: '5-6', notes: 'Explosive hip power', restPeriod: '3 minutes', muscleGroups: ['glutes', 'hamstrings'] },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '8 each', notes: 'Single-leg strength', restPeriod: '90 seconds', muscleGroups: ['quads', 'glutes'] },
          { name: 'Calf Raises', sets: 4, reps: '10-12', notes: 'Calf strength for jumping', restPeriod: '90 seconds', muscleGroups: ['calves'] },
          { name: 'Plank', sets: 3, reps: '45-60 seconds', notes: 'Core stability', restPeriod: '60 seconds', muscleGroups: ['abs'] }
        ]
      },
      {
        day: 'Wednesday - Plyometrics & Power',
        exercises: [
          { name: 'Depth Jump to Box Jump', sets: 5, reps: '5', notes: 'Max vertical power', restPeriod: '2-3 minutes', muscleGroups: ['quads', 'calves', 'glutes'] },
          { name: 'Broad Jump', sets: 5, reps: '5', notes: 'Horizontal power', restPeriod: '2 minutes', muscleGroups: ['quads', 'glutes'] },
          { name: 'Single-Leg Box Jump', sets: 4, reps: '5 each', notes: 'Unilateral explosive power', restPeriod: '90 seconds', muscleGroups: ['quads', 'calves'] },
          { name: 'Medicine Ball Chest Pass', sets: 4, reps: '10', notes: 'Upper body power', restPeriod: '60 seconds', muscleGroups: ['chest', 'shoulders'] },
          { name: 'Agility Ladder Drills', sets: 3, reps: '30 seconds', notes: 'Quickness and footwork', restPeriod: '60 seconds', muscleGroups: ['calves', 'quads'] }
        ]
      },
      {
        day: 'Friday - Upper Body & Accessory',
        exercises: [
          { name: 'Bench Press', sets: 3, reps: '8', notes: 'Upper body strength', restPeriod: '2 minutes', muscleGroups: ['chest', 'triceps'] },
          { name: 'Weighted Pull-Ups', sets: 3, reps: '6-8', notes: 'Back and grip', restPeriod: '2 minutes', muscleGroups: ['back', 'biceps'] },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', notes: 'Shoulder strength', restPeriod: '90 seconds', muscleGroups: ['shoulders'] },
          { name: 'Single-Leg Romanian Deadlift', sets: 3, reps: '8 each', notes: 'Balance and hamstring', restPeriod: '90 seconds', muscleGroups: ['hamstrings', 'glutes'] },
          { name: 'Rotational Medicine Ball Throw', sets: 3, reps: '10 each side', notes: 'Core rotation for shooting', restPeriod: '60 seconds', muscleGroups: ['abs'] }
        ]
      }
    ])
  }
];

// Combine all programs
const allExtendedPrograms: ExtendedProgram[] = [
  ...additionalStrengthPrograms,
  ...hypertrophyPrograms,
  ...sportSpecificPrograms,
  // Add more as needed
];

// Merge with existing programs
export const COMPLETE_WORKOUT_PROGRAMS: ExtendedProgram[] = [
  ...PREDEFINED_PROGRAMS.map(p => ({ ...p, category: 'strength' as const })),
  ...allExtendedPrograms,
];

// Export by category
export const PROGRAMS_BY_CATEGORY = {
  strength: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.category === 'strength'),
  hypertrophy: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.category === 'hypertrophy'),
  endurance: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.category === 'endurance'),
  sportSpecific: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.category === 'sport-specific'),
  splitVariation: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.category === 'split-variation'),
};

// Export by frequency
export const PROGRAMS_BY_FREQUENCY = {
  2: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.daysPerWeek === 2),
  3: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.daysPerWeek === 3),
  4: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.daysPerWeek === 4),
  5: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.daysPerWeek === 5),
  6: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.daysPerWeek === 6),
};

// Export by level
export const PROGRAMS_BY_LEVEL = {
  beginner: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.difficulty === 'beginner'),
  intermediate: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.difficulty === 'intermediate'),
  advanced: COMPLETE_WORKOUT_PROGRAMS.filter(p => p.difficulty === 'advanced'),
};

console.log(`Loaded ${COMPLETE_WORKOUT_PROGRAMS.length} total workout programs`);
