export type MuscleGroup = 
  | 'chest' 
  | 'shoulders' 
  | 'triceps' 
  | 'biceps' 
  | 'back' 
  | 'abs' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes'
  | 'calves'
  | 'forearms';

export type Equipment = 
  | 'barbell' 
  | 'dumbbell' 
  | 'machine' 
  | 'cable' 
  | 'bands' 
  | 'bodyweight';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal = 'strength' | 'hypertrophy' | 'mobility' | 'fat-loss';

export interface ExerciseData {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  goals: FitnessGoal[];
  description: string;
  instructions: string[];
  tips?: string[];
  videoUrl?: string;
}

export const EXERCISES: ExerciseData[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'The king of chest exercises. Builds overall chest mass and pressing strength.',
    instructions: [
      'Lie flat on bench with feet planted on floor',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to mid-chest with control',
      'Press bar back up to starting position',
      'Keep shoulder blades retracted throughout',
    ],
    tips: [
      'Keep elbows at 45-degree angle from body',
      'Touch chest lightly, don\'t bounce',
      'Maintain tight upper back and glutes',
    ],
  },
  {
    id: 'squat',
    name: 'Barbell Back Squat',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'The king of leg exercises. Builds overall lower body mass and strength.',
    instructions: [
      'Position bar on upper traps',
      'Stand with feet shoulder-width apart',
      'Descend by breaking at hips and knees',
      'Go until thighs are parallel to floor',
      'Drive through heels to return to start',
    ],
    tips: [
      'Keep chest up and core braced',
      'Knees track over toes',
      'Maintain neutral spine throughout',
    ],
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    muscleGroup: 'back',
    secondaryMuscles: ['hamstrings', 'glutes'],
    equipment: 'barbell',
    difficulty: 'advanced',
    goals: ['strength', 'hypertrophy'],
    description: 'Full body compound movement. Builds posterior chain and total body strength.',
    instructions: [
      'Stand with feet hip-width, bar over midfoot',
      'Grip bar just outside legs',
      'Hinge at hips, keep back flat',
      'Drive through floor, extend hips',
      'Stand tall, shoulders back',
    ],
    tips: [
      'Keep bar close to body throughout',
      'Lead with chest, not hips',
      'Lock out hips and knees simultaneously',
    ],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'Primary shoulder mass builder. Develops overall pressing strength.',
    instructions: [
      'Stand with bar at shoulder height',
      'Grip slightly wider than shoulders',
      'Press bar overhead in straight line',
      'Lock out arms fully at top',
      'Lower under control',
    ],
    tips: [
      'Keep core tight throughout',
      'Don\'t lean back excessively',
      'Press in front of face, not behind',
    ],
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'Best bodyweight back exercise. Builds width and upper body pulling strength.',
    instructions: [
      'Hang from bar with palms facing away',
      'Grip slightly wider than shoulders',
      'Pull chest to bar',
      'Lower with control',
      'Full extension at bottom',
    ],
    tips: [
      'Lead with chest, not chin',
      'Don\'t swing or kip',
      'Squeeze shoulder blades together at top',
    ],
  },
  {
    id: 'dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'strength'],
    description: 'Unilateral back builder. Great for correcting imbalances.',
    instructions: [
      'Place one knee and hand on bench',
      'Hold dumbbell in opposite hand',
      'Row dumbbell to hip',
      'Lower with control',
      'Keep back flat throughout',
    ],
    tips: [
      'Don\'t rotate torso',
      'Lead with elbow, not hand',
      'Squeeze at top of movement',
    ],
  },
  {
    id: 'pushup',
    name: 'Push-Up',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'mobility'],
    description: 'Classic bodyweight chest exercise. Great for beginners and advanced alike.',
    instructions: [
      'Start in plank position',
      'Lower chest to floor',
      'Keep elbows at 45 degrees',
      'Push back to start',
      'Keep body in straight line',
    ],
    tips: [
      'Don\'t let hips sag',
      'Full range of motion',
      'Controlled tempo throughout',
    ],
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl',
    muscleGroup: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Classic bicep builder. Isolates and develops bicep peak.',
    instructions: [
      'Stand with dumbbells at sides',
      'Keep elbows at sides',
      'Curl weights to shoulders',
      'Squeeze at top',
      'Lower with control',
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Keep wrists neutral',
      'Focus on the squeeze',
    ],
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dips',
    muscleGroup: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'Compound tricep movement. Builds arm mass and pressing strength.',
    instructions: [
      'Support body on parallel bars',
      'Lower until upper arms parallel to floor',
      'Press back up to start',
      'Keep torso upright',
      'Full lockout at top',
    ],
    tips: [
      'Don\'t go too deep if shoulders hurt',
      'Lean forward for more chest',
      'Stay upright for more triceps',
    ],
  },
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['mobility', 'strength'],
    description: 'Core stabilization exercise. Builds overall core strength.',
    instructions: [
      'Start in forearm plank position',
      'Keep body in straight line',
      'Engage core and glutes',
      'Hold position',
      'Breathe normally',
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Keep neck neutral',
      'Start with shorter holds, build up',
    ],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'strength'],
    description: 'Machine-based leg builder. Great for safely loading the legs.',
    instructions: [
      'Sit in leg press machine',
      'Place feet shoulder-width on platform',
      'Lower platform until knees at 90 degrees',
      'Press through heels to return',
      'Don\'t lock out knees',
    ],
    tips: [
      'Keep lower back pressed to pad',
      'Don\'t let knees cave in',
      'Control the negative',
    ],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'strength'],
    description: 'Hamstring and glute builder. Excellent posterior chain development.',
    instructions: [
      'Hold bar at hip level',
      'Hinge at hips, push butt back',
      'Lower bar to mid-shin',
      'Feel stretch in hamstrings',
      'Drive hips forward to return',
    ],
    tips: [
      'Keep slight knee bend',
      'Don\'t round lower back',
      'Bar stays close to legs',
    ],
  },
  {
    id: 'cable-fly',
    name: 'Cable Chest Fly',
    muscleGroup: 'chest',
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Isolation exercise for chest. Great pump and stretch.',
    instructions: [
      'Stand between cable towers',
      'Grab handles at chest height',
      'Step forward, slight lean',
      'Bring hands together in front',
      'Squeeze at peak contraction',
    ],
    tips: [
      'Keep slight elbow bend',
      'Don\'t let shoulders roll forward',
      'Control the eccentric',
    ],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'strength'],
    description: 'Machine-based back builder. Great for developing lat width.',
    instructions: [
      'Sit at pulldown machine',
      'Grip bar wider than shoulders',
      'Pull bar to upper chest',
      'Squeeze shoulder blades together',
      'Control the return',
    ],
    tips: [
      'Lean back slightly',
      'Lead with elbows',
      'Don\'t use momentum',
    ],
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'strength'],
    description: 'Unilateral leg exercise. Builds leg strength and balance.',
    instructions: [
      'Place rear foot on bench',
      'Hold dumbbells at sides',
      'Lower into lunge position',
      'Front thigh parallel to floor',
      'Drive through front heel',
    ],
    tips: [
      'Keep torso upright',
      'Front knee tracks over toes',
      'Don\'t let knee cave inward',
    ],
  },
  {
    id: 'hip-thrust',
    name: 'Barbell Hip Thrust',
    muscleGroup: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'strength'],
    description: 'Best glute builder. Develops powerful hip extension.',
    instructions: [
      'Sit on floor, back against bench',
      'Roll bar over hips',
      'Drive through heels, lift hips',
      'Squeeze glutes at top',
      'Lower with control',
    ],
    tips: [
      'Keep chin tucked',
      'Use pad for comfort',
      'Full hip extension at top',
    ],
  },
  {
    id: 'face-pull',
    name: 'Cable Face Pull',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'mobility'],
    description: 'Rear delt and upper back builder. Great for posture.',
    instructions: [
      'Set cable at face height',
      'Grab rope attachment',
      'Pull rope toward face',
      'Separate hands at face',
      'Squeeze rear delts',
    ],
    tips: [
      'Keep elbows high',
      'Don\'t use too much weight',
      'Focus on rear delts, not arms',
    ],
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    goals: ['strength', 'hypertrophy'],
    description: 'Advanced ab exercise. Builds lower ab strength.',
    instructions: [
      'Hang from pull-up bar',
      'Keep legs straight',
      'Raise legs to 90 degrees',
      'Lower with control',
      'Don\'t swing',
    ],
    tips: [
      'Use straps if grip fails first',
      'Tilt pelvis at top',
      'Bend knees if too difficult',
    ],
  },
  {
    id: 'resistance-band-pull-apart',
    name: 'Band Pull-Apart',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'bands',
    difficulty: 'beginner',
    goals: ['mobility', 'hypertrophy'],
    description: 'Rear delt and upper back activation. Great warm-up exercise.',
    instructions: [
      'Hold band at chest height',
      'Arms straight in front',
      'Pull band apart to sides',
      'Squeeze shoulder blades',
      'Return with control',
    ],
    tips: [
      'Keep arms straight',
      'Don\'t shrug shoulders',
      'Focus on rear delts',
    ],
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise',
    muscleGroup: 'calves',
    equipment: 'machine',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Calf isolation exercise. Builds calf mass and strength.',
    instructions: [
      'Stand on calf raise machine',
      'Rise up on toes',
      'Squeeze calves at top',
      'Lower heels below platform',
      'Full stretch at bottom',
    ],
    tips: [
      'Full range of motion',
      'Pause at top and bottom',
      'Don\'t bounce',
    ],
  },
];

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: '#FF6B6B',
  shoulders: '#4ECDC4',
  triceps: '#45B7D1',
  biceps: '#96CEB4',
  back: '#FFEAA7',
  abs: '#DFE6E9',
  quads: '#74B9FF',
  hamstrings: '#A29BFE',
  glutes: '#FD79A8',
  calves: '#FDCB6E',
  forearms: '#6C5CE7',
};

export const MUSCLE_GROUP_ICONS: Record<MuscleGroup, string> = {
  chest: '💪',
  shoulders: '🦾',
  triceps: '💪',
  biceps: '💪',
  back: '🦵',
  abs: '🎯',
  quads: '🦵',
  hamstrings: '🦵',
  glutes: '🍑',
  calves: '🦵',
  forearms: '✊',
};
