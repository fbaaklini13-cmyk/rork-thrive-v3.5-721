export interface FullExerciseData {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  gifUrl?: string;
  instructions?: string[];
  tips?: string[];
}

export type ExerciseEquipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bands'
  | 'bodyweight'
  | 'kettlebells'
  | 'e-z curl bar'
  | 'exercise ball'
  | 'foam roll'
  | 'medicine ball'
  | 'other'
  | 'body only'
  | 'None'
  | 'N/A';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
