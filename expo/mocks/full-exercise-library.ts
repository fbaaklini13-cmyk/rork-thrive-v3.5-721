import { FullExerciseData } from '@/types/exercise';
import { ALL_879_EXERCISES } from './all-exercises-data';

// All 879 exercises from the comprehensive database
export const ALL_EXERCISES: FullExerciseData[] = ALL_879_EXERCISES;

// Group exercises by muscle group
export const EXERCISES_BY_MUSCLE: Record<string, FullExerciseData[]> = {};

ALL_EXERCISES.forEach(exercise => {
  if (!EXERCISES_BY_MUSCLE[exercise.primaryMuscle]) {
    EXERCISES_BY_MUSCLE[exercise.primaryMuscle] = [];
  }
  EXERCISES_BY_MUSCLE[exercise.primaryMuscle].push(exercise);
});

// Get unique muscle groups
export const MUSCLE_GROUPS = Object.keys(EXERCISES_BY_MUSCLE).sort();

// Get exercises by equipment
export const getExercisesByEquipment = (equipment: string) => {
  return ALL_EXERCISES.filter(ex => ex.equipment.toLowerCase() === equipment.toLowerCase());
};

// Get exercises by difficulty
export const getExercisesByDifficulty = (difficulty: string) => {
  return ALL_EXERCISES.filter(ex => ex.difficulty === difficulty);
};

// Search exercises
export const searchExercises = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return ALL_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.primaryMuscle.toLowerCase().includes(lowerQuery) ||
    ex.equipment.toLowerCase().includes(lowerQuery)
  );
};
