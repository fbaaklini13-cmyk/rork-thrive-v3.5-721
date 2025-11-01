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
  | 'forearms'
  | 'traps'
  | 'lats'
  | 'adductors'
  | 'abductors'
  | 'neck'
  | 'lower back'
  | 'middle back';

export type Equipment = 
  | 'barbell' 
  | 'dumbbell' 
  | 'machine' 
  | 'cable' 
  | 'bands' 
  | 'bodyweight'
  | 'kettlebells'
  | 'e-z curl bar'
  | 'medicine ball'
  | 'exercise ball'
  | 'foam roll'
  | 'other'
  | 'none';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type FitnessGoal = 'strength' | 'hypertrophy' | 'mobility' | 'fat-loss' | 'endurance';

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

// Helper function to create exercise ID
const createId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Helper to map equipment from data
const mapEquipment = (eq: string): Equipment => {
  const eqLower = eq.toLowerCase();
  if (eqLower.includes('barbell')) return 'barbell';
  if (eqLower.includes('dumbbell')) return 'dumbbell';
  if (eqLower.includes('machine')) return 'machine';
  if (eqLower.includes('cable')) return 'cable';
  if (eqLower.includes('band')) return 'bands';
  if (eqLower.includes('kettlebell')) return 'kettlebells';
  if (eqLower.includes('e-z')) return 'e-z curl bar';
  if (eqLower.includes('medicine ball')) return 'medicine ball';
  if (eqLower.includes('exercise ball') || eqLower.includes('stability ball')) return 'exercise ball';
  if (eqLower.includes('foam roll')) return 'foam roll';
  if (eqLower.includes('body') || eqLower === 'none' || !eq || eq === 'N/A') return 'bodyweight';
  return 'other';
};

// Helper to map muscle groups
const mapMuscleGroup = (muscle: string): MuscleGroup => {
  const muscleLower = muscle.toLowerCase();
  if (muscleLower.includes('chest') || muscleLower.includes('pec')) return 'chest';
  if (muscleLower.includes('shoulder') || muscleLower.includes('delt')) return 'shoulders';
  if (muscleLower.includes('tricep')) return 'triceps';
  if (muscleLower.includes('bicep')) return 'biceps';
  if (muscleLower.includes('lat')) return 'lats';
  if (muscleLower.includes('trap')) return 'traps';
  if (muscleLower.includes('middle back')) return 'middle back';
  if (muscleLower.includes('lower back')) return 'lower back';
  if (muscleLower.includes('back')) return 'back';
  if (muscleLower.includes('ab') || muscleLower.includes('core')) return 'abs';
  if (muscleLower.includes('quad')) return 'quads';
  if (muscleLower.includes('hamstring')) return 'hamstrings';
  if (muscleLower.includes('glute')) return 'glutes';
  if (muscleLower.includes('calves') || muscleLower.includes('calf')) return 'calves';
  if (muscleLower.includes('forearm')) return 'forearms';
  if (muscleLower.includes('adductor')) return 'adductors';
  if (muscleLower.includes('abductor')) return 'abductors';
  if (muscleLower.includes('neck')) return 'neck';
  return 'abs'; // default
};

// Helper to map difficulty
const mapDifficulty = (diff: string): Difficulty => {
  const diffLower = diff.toLowerCase();
  if (diffLower.includes('expert')) return 'expert';
  if (diffLower.includes('advanced')) return 'advanced';
  if (diffLower.includes('intermediate')) return 'intermediate';
  return 'beginner';
};

// All exercises data from the provided list
export const EXERCISES: ExerciseData[] = [
  // Chest Exercises
  {
    id: createId('Barbell Bench Press - Medium Grip'),
    name: 'Barbell Bench Press - Medium Grip',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['strength', 'hypertrophy'],
    description: 'The king of chest exercises. Builds overall chest mass and pressing strength.',
    instructions: [
      'Lie flat on bench with feet planted on floor',
      'Grip bar with medium width (slightly wider than shoulders)',
      'Lower bar to mid-chest with control',
      'Press bar back up to starting position',
      'Keep shoulder blades retracted throughout',
    ],
    tips: [
      'Keep elbows at 45-degree angle from body',
      'Don\'t bounce the bar off your chest',
      'Maintain tight upper back and glutes',
    ],
  },
  {
    id: createId('Dumbbell Bench Press'),
    name: 'Dumbbell Bench Press',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'strength'],
    description: 'Dumbbell variation of bench press allowing greater range of motion',
    instructions: [
      'Lie on bench holding dumbbells at chest level',
      'Press dumbbells up until arms are extended',
      'Lower with control back to starting position',
      'Keep dumbbells aligned over chest',
    ],
  },
  {
    id: createId('Incline Barbell Bench Press - Medium Grip'),
    name: 'Incline Barbell Bench Press',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'strength'],
    description: 'Targets upper chest fibers',
    instructions: [
      'Set bench to 30-45 degree incline',
      'Grip bar slightly wider than shoulders',
      'Lower to upper chest',
      'Press back up to starting position',
    ],
  },
  {
    id: createId('Incline Dumbbell Press'),
    name: 'Incline Dumbbell Press',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Upper chest development with dumbbells',
    instructions: [
      'Set bench to 30-45 degrees',
      'Hold dumbbells at upper chest',
      'Press up and slightly inward',
      'Lower with control',
    ],
  },
  {
    id: createId('Decline Barbell Bench Press'),
    name: 'Decline Barbell Bench Press',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Targets lower chest',
    instructions: [
      'Set bench to decline position',
      'Secure feet under pad',
      'Lower bar to lower chest',
      'Press back up',
    ],
  },
  {
    id: createId('Dumbbell Flyes'),
    name: 'Dumbbell Flyes',
    muscleGroup: 'chest',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Isolation exercise for chest stretch',
    instructions: [
      'Lie on bench with dumbbells over chest',
      'Lower arms out to sides with slight bend',
      'Feel stretch in chest',
      'Bring arms back together',
    ],
  },
  {
    id: createId('Cable Crossover'),
    name: 'Cable Crossover',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Cable exercise for chest with constant tension',
    instructions: [
      'Stand between cable towers',
      'Grab handles at chest height',
      'Step forward with slight lean',
      'Bring hands together in front',
      'Squeeze at peak contraction',
    ],
  },
  {
    id: createId('Push-Up'),
    name: 'Push-Up',
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'endurance'],
    description: 'Classic bodyweight chest exercise',
    instructions: [
      'Start in plank position',
      'Lower chest to floor',
      'Keep elbows at 45 degrees',
      'Push back to start',
    ],
  },
  {
    id: createId('Dips - Chest Version'),
    name: 'Dips - Chest Version',
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'other',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'Bodyweight chest builder with forward lean',
    instructions: [
      'Grip parallel bars',
      'Lean forward slightly',
      'Lower body with control',
      'Press back up',
    ],
  },

  // Back Exercises
  {
    id: createId('Barbell Deadlift'),
    name: 'Barbell Deadlift',
    muscleGroup: 'back',
    secondaryMuscles: ['glutes', 'hamstrings', 'traps'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'Full body compound movement building posterior chain',
    instructions: [
      'Stand with feet hip-width, bar over midfoot',
      'Grip bar just outside legs',
      'Hinge at hips, keep back flat',
      'Drive through floor, extend hips',
      'Stand tall, shoulders back',
    ],
  },
  {
    id: createId('Pull-Up'),
    name: 'Pull-Up',
    muscleGroup: 'lats',
    secondaryMuscles: ['biceps', 'middle back'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['strength', 'hypertrophy'],
    description: 'Best bodyweight back exercise',
    instructions: [
      'Hang from bar with palms facing away',
      'Pull chest to bar',
      'Lower with control',
      'Full extension at bottom',
    ],
  },
  {
    id: createId('Bent Over Barbell Row'),
    name: 'Bent Over Barbell Row',
    muscleGroup: 'middle back',
    secondaryMuscles: ['biceps', 'lats', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['strength', 'hypertrophy'],
    description: 'Classic back mass builder',
    instructions: [
      'Bend at hips with bar in hands',
      'Pull bar to lower chest',
      'Squeeze shoulder blades',
      'Lower with control',
    ],
  },
  {
    id: createId('Lat Pulldown'),
    name: 'Wide-Grip Lat Pulldown',
    muscleGroup: 'lats',
    secondaryMuscles: ['biceps', 'middle back'],
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Machine back exercise for lat width',
    instructions: [
      'Sit at pulldown machine',
      'Grip bar wider than shoulders',
      'Pull bar to upper chest',
      'Squeeze shoulder blades',
    ],
  },
  {
    id: createId('One-Arm Dumbbell Row'),
    name: 'One-Arm Dumbbell Row',
    muscleGroup: 'middle back',
    secondaryMuscles: ['biceps', 'lats'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Unilateral back builder',
    instructions: [
      'Place one knee on bench',
      'Row dumbbell to hip',
      'Squeeze at top',
      'Keep back flat',
    ],
  },
  {
    id: createId('Seated Cable Rows'),
    name: 'Seated Cable Rows',
    muscleGroup: 'middle back',
    secondaryMuscles: ['biceps', 'lats'],
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Seated row for back thickness',
    instructions: [
      'Sit at cable row station',
      'Pull handle to abdomen',
      'Squeeze shoulder blades',
      'Control the return',
    ],
  },
  {
    id: createId('T-Bar Row with Handle'),
    name: 'T-Bar Row',
    muscleGroup: 'middle back',
    secondaryMuscles: ['biceps', 'lats'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'strength'],
    description: 'Mid-back mass builder',
    instructions: [
      'Straddle T-bar',
      'Bend at hips',
      'Pull bar to chest',
      'Squeeze at top',
    ],
  },

  // Shoulder Exercises
  {
    id: createId('Barbell Shoulder Press'),
    name: 'Barbell Shoulder Press',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['strength', 'hypertrophy'],
    description: 'Primary shoulder mass builder',
    instructions: [
      'Stand with bar at shoulder height',
      'Press bar overhead',
      'Lock out at top',
      'Lower with control',
    ],
  },
  {
    id: createId('Dumbbell Shoulder Press'),
    name: 'Dumbbell Shoulder Press',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy'],
    description: 'Shoulder press with greater range of motion',
    instructions: [
      'Sit with dumbbells at shoulders',
      'Press up overhead',
      'Bring together at top',
      'Lower to shoulders',
    ],
  },
  {
    id: createId('Arnold Dumbbell Press'),
    name: 'Arnold Dumbbell Press',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy'],
    description: 'Arnold Schwarzenegger\'s signature shoulder exercise',
    instructions: [
      'Start with dumbbells in front, palms facing you',
      'Press up while rotating palms outward',
      'Finish with palms forward overhead',
      'Reverse motion on way down',
    ],
  },
  {
    id: createId('Side Lateral Raise'),
    name: 'Side Lateral Raise',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Isolation for side delts',
    instructions: [
      'Hold dumbbells at sides',
      'Raise arms out to sides',
      'Raise to shoulder height',
      'Lower with control',
    ],
  },
  {
    id: createId('Front Dumbbell Raise'),
    name: 'Front Dumbbell Raise',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Front delt isolation',
    instructions: [
      'Hold dumbbells in front of thighs',
      'Raise forward to shoulder height',
      'Control the descent',
    ],
  },
  {
    id: createId('Face Pull'),
    name: 'Cable Face Pull',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['middle back'],
    equipment: 'cable',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'mobility'],
    description: 'Rear delt and upper back builder',
    instructions: [
      'Set cable at face height',
      'Pull rope toward face',
      'Separate hands at face',
      'Squeeze rear delts',
    ],
  },
  {
    id: createId('Reverse Flyes'),
    name: 'Reverse Flyes',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Rear delt isolation',
    instructions: [
      'Bend forward at hips',
      'Raise dumbbells out to sides',
      'Squeeze shoulder blades',
      'Control the return',
    ],
  },
  {
    id: createId('Barbell Shrug'),
    name: 'Barbell Shrug',
    muscleGroup: 'traps',
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Trap mass builder',
    instructions: [
      'Hold bar at arm\'s length',
      'Shrug shoulders straight up',
      'Hold at top',
      'Lower with control',
    ],
  },
  {
    id: createId('Upright Barbell Row'),
    name: 'Upright Barbell Row',
    muscleGroup: 'shoulders',
    secondaryMuscles: ['traps'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Shoulder and trap builder',
    instructions: [
      'Hold bar with narrow grip',
      'Pull bar up along body',
      'Raise elbows high',
      'Lower with control',
    ],
  },

  // Leg Exercises
  {
    id: createId('Barbell Squat'),
    name: 'Barbell Back Squat',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['strength', 'hypertrophy'],
    description: 'The king of leg exercises',
    instructions: [
      'Bar on upper traps',
      'Feet shoulder-width apart',
      'Descend until thighs parallel',
      'Drive through heels',
    ],
  },
  {
    id: createId('Front Barbell Squat'),
    name: 'Front Barbell Squat',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'barbell',
    difficulty: 'expert',
    goals: ['strength', 'hypertrophy'],
    description: 'Front-loaded squat variation',
    instructions: [
      'Bar rests on front delts',
      'Elbows high',
      'Descend keeping torso upright',
      'Drive up through heels',
    ],
  },
  {
    id: createId('Leg Press'),
    name: 'Leg Press',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Machine leg builder',
    instructions: [
      'Sit in leg press',
      'Feet shoulder-width on platform',
      'Lower until 90 degrees',
      'Press through heels',
    ],
  },
  {
    id: createId('Romanian Deadlift'),
    name: 'Romanian Deadlift',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'strength'],
    description: 'Hamstring and glute builder',
    instructions: [
      'Hold bar at hip level',
      'Hinge at hips',
      'Lower to mid-shin',
      'Drive hips forward',
    ],
  },
  {
    id: createId('Lying Leg Curls'),
    name: 'Lying Leg Curls',
    muscleGroup: 'hamstrings',
    equipment: 'machine',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Hamstring isolation',
    instructions: [
      'Lie face down on machine',
      'Curl heels toward glutes',
      'Squeeze at top',
      'Lower with control',
    ],
  },
  {
    id: createId('Leg Extensions'),
    name: 'Leg Extensions',
    muscleGroup: 'quads',
    equipment: 'machine',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Quad isolation',
    instructions: [
      'Sit in leg extension machine',
      'Extend legs until straight',
      'Squeeze quads at top',
      'Lower with control',
    ],
  },
  {
    id: createId('Barbell Lunge'),
    name: 'Barbell Lunge',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'strength'],
    description: 'Unilateral leg builder',
    instructions: [
      'Bar on upper back',
      'Step forward into lunge',
      'Lower back knee toward floor',
      'Push through front heel',
    ],
  },
  {
    id: createId('Bulgarian Split Squat'),
    name: 'Bulgarian Split Squat',
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy'],
    description: 'Single-leg strength builder',
    instructions: [
      'Rear foot on bench',
      'Lower into lunge',
      'Front thigh parallel',
      'Drive through heel',
    ],
  },
  {
    id: createId('Barbell Hip Thrust'),
    name: 'Barbell Hip Thrust',
    muscleGroup: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    goals: ['hypertrophy', 'strength'],
    description: 'Best glute builder',
    instructions: [
      'Back against bench',
      'Bar over hips',
      'Drive through heels',
      'Squeeze glutes at top',
    ],
  },
  {
    id: createId('Standing Calf Raises'),
    name: 'Standing Calf Raise',
    muscleGroup: 'calves',
    equipment: 'machine',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Calf mass builder',
    instructions: [
      'Stand on calf machine',
      'Rise on toes',
      'Squeeze at top',
      'Lower heels below platform',
    ],
  },

  // Arm Exercises
  {
    id: createId('Barbell Curl'),
    name: 'Barbell Curl',
    muscleGroup: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Classic bicep mass builder',
    instructions: [
      'Stand with bar at thigh level',
      'Curl bar to shoulders',
      'Keep elbows at sides',
      'Lower with control',
    ],
  },
  {
    id: createId('Dumbbell Bicep Curl'),
    name: 'Dumbbell Bicep Curl',
    muscleGroup: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Dumbbell bicep builder',
    instructions: [
      'Stand with dumbbells at sides',
      'Curl to shoulders',
      'Squeeze at top',
      'Lower with control',
    ],
  },
  {
    id: createId('Hammer Curls'),
    name: 'Hammer Curls',
    muscleGroup: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Neutral grip bicep exercise',
    instructions: [
      'Hold dumbbells with neutral grip',
      'Curl up keeping palms facing each other',
      'Squeeze at top',
      'Lower with control',
    ],
  },
  {
    id: createId('Preacher Curl'),
    name: 'Preacher Curl',
    muscleGroup: 'biceps',
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Isolation bicep exercise',
    instructions: [
      'Sit at preacher bench',
      'Arms over pad',
      'Curl bar up',
      'Squeeze at top',
    ],
  },
  {
    id: createId('Concentration Curls'),
    name: 'Concentration Curls',
    muscleGroup: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Isolated bicep peak builder',
    instructions: [
      'Sit with elbow against inner thigh',
      'Curl dumbbell up',
      'Focus on the squeeze',
      'Lower slowly',
    ],
  },
  {
    id: createId('Close-Grip Barbell Bench Press'),
    name: 'Close-Grip Bench Press',
    muscleGroup: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'beginner',
    goals: ['strength', 'hypertrophy'],
    description: 'Compound tricep builder',
    instructions: [
      'Lie on bench, grip bar narrow',
      'Lower to chest',
      'Press back up',
      'Keep elbows tucked',
    ],
  },
  {
    id: createId('Triceps Pushdown'),
    name: 'Triceps Pushdown',
    muscleGroup: 'triceps',
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Cable tricep isolation',
    instructions: [
      'Stand at cable machine',
      'Push bar down',
      'Lock out at bottom',
      'Control the return',
    ],
  },
  {
    id: createId('Dips - Triceps Version'),
    name: 'Triceps Dips',
    muscleGroup: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['strength', 'hypertrophy'],
    description: 'Bodyweight tricep builder',
    instructions: [
      'Support body on parallel bars',
      'Lower until upper arms parallel',
      'Stay upright',
      'Press back up',
    ],
  },
  {
    id: createId('EZ-Bar Skullcrusher'),
    name: 'Skull Crushers',
    muscleGroup: 'triceps',
    secondaryMuscles: ['forearms'],
    equipment: 'e-z curl bar',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Lying tricep extension',
    instructions: [
      'Lie on bench with EZ bar',
      'Lower bar to forehead',
      'Keep upper arms still',
      'Extend back up',
    ],
  },
  {
    id: createId('Standing Dumbbell Triceps Extension'),
    name: 'Overhead Dumbbell Extension',
    muscleGroup: 'triceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Overhead tricep stretch exercise',
    instructions: [
      'Hold dumbbell overhead',
      'Lower behind head',
      'Keep elbows pointing up',
      'Extend back overhead',
    ],
  },

  // Core Exercises
  {
    id: createId('Plank'),
    name: 'Plank',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['strength', 'endurance'],
    description: 'Core stabilization hold',
    instructions: [
      'Forearm plank position',
      'Body in straight line',
      'Engage core and glutes',
      'Hold position',
    ],
  },
  {
    id: createId('Crunches'),
    name: 'Crunches',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['hypertrophy', 'endurance'],
    description: 'Basic ab exercise',
    instructions: [
      'Lie on back, knees bent',
      'Hands behind head',
      'Lift shoulders off floor',
      'Squeeze abs at top',
    ],
  },
  {
    id: createId('Hanging Leg Raise'),
    name: 'Hanging Leg Raise',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'expert',
    goals: ['strength'],
    description: 'Advanced lower ab exercise',
    instructions: [
      'Hang from bar',
      'Raise legs to 90 degrees',
      'Lower with control',
      'Don\'t swing',
    ],
  },
  {
    id: createId('Cable Crunch'),
    name: 'Cable Crunch',
    muscleGroup: 'abs',
    equipment: 'cable',
    difficulty: 'beginner',
    goals: ['hypertrophy'],
    description: 'Weighted ab crunch',
    instructions: [
      'Kneel at cable machine',
      'Hold rope behind head',
      'Crunch down',
      'Squeeze abs',
    ],
  },
  {
    id: createId('Russian Twist'),
    name: 'Russian Twist',
    muscleGroup: 'abs',
    secondaryMuscles: ['lower back'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    goals: ['strength', 'endurance'],
    description: 'Oblique rotational exercise',
    instructions: [
      'Sit with feet off ground',
      'Rotate torso side to side',
      'Touch floor on each side',
      'Keep core engaged',
    ],
  },
  {
    id: createId('Ab Roller'),
    name: 'Ab Roller',
    muscleGroup: 'abs',
    secondaryMuscles: ['shoulders'],
    equipment: 'other',
    difficulty: 'intermediate',
    goals: ['strength'],
    description: 'Advanced core extension',
    instructions: [
      'Kneel holding ab wheel',
      'Roll forward',
      'Extend as far as possible',
      'Pull back to start',
    ],
  },
  {
    id: createId('Mountain Climbers'),
    name: 'Mountain Climbers',
    muscleGroup: 'abs',
    secondaryMuscles: ['quads', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['endurance', 'fat-loss'],
    description: 'Dynamic core exercise',
    instructions: [
      'Start in plank position',
      'Alternate bringing knees to chest',
      'Keep hips level',
      'Move quickly',
    ],
  },

  // Additional exercises from your list
  {
    id: createId('3/4 Sit-Up'),
    name: '3/4 Sit-Up',
    muscleGroup: 'abs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['endurance'],
    description: 'Partial range sit-up for continuous tension',
    instructions: ['Lie on back', 'Perform sit-up to 3/4 position', 'Lower partially'],
  },
  {
    id: createId('90/90 Hamstring'),
    name: '90/90 Hamstring Stretch',
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['calves'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    goals: ['mobility'],
    description: 'Hamstring flexibility exercise',
    instructions: ['Lie on back', 'Raise leg to 90 degrees', 'Straighten knee'],
  },
  // Add more exercises following the same pattern...
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
  traps: '#FFA07A',
  lats: '#FFD700',
  adductors: '#98D8C8',
  abductors: '#B19CD9',
  neck: '#C7CEEA',
  'lower back': '#FFB6B9',
  'middle back': '#FAE3D9',
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
  traps: '🔺',
  lats: '🦅',
  adductors: '🦵',
  abductors: '🦵',
  neck: '🧠',
  'lower back': '💪',
  'middle back': '🦵',
};

// Group exercises by muscle group for easy access
export const EXERCISES_BY_MUSCLE_GROUP = EXERCISES.reduce((acc, exercise) => {
  if (!acc[exercise.muscleGroup]) {
    acc[exercise.muscleGroup] = [];
  }
  acc[exercise.muscleGroup].push(exercise);
  return acc;
}, {} as Record<MuscleGroup, ExerciseData[]>);
