export interface UserProfile {
  // Personal Info
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  
  // Dietary
  dietaryPreferences?: string[];
  allergies?: string[];
  eatingHabits?: string;
  
  // Physical
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  exerciseTypes?: string[];
  weeklyFrequency?: number;
  fitnessGoal?: string;
  targetWeight?: number; // in kg - for weight loss/gain goals
  weeklyWeightGoal?: number; // kg per week (0.5, 1, etc.)
  
  // Additional fields for "Other" options
  otherDietaryPreferences?: string;
  otherAllergies?: string;
  otherEatingHabits?: string;
  otherExerciseTypes?: string;
  otherFitnessGoal?: string;
  
  // AI Settings
  aiEnabled: boolean;
  onboardingCompleted: boolean;
  
  // Premium Subscription
  isPremium: boolean;
  premiumExpiresAt?: string;
}

export interface NutritionEntry {
  id: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  photoUri?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  aiAnalysis?: {
    insights: string;
    healthierAlternatives: string[];
  };
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  goals: string[];
  equipment: string[];
  daysPerWeek: number;
  plan: WorkoutDay[];
}

export interface WorkoutDay {
  day: string;
  focus?: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  restPeriod?: string;
  muscleGroups?: string[];
  alternatives?: string[];
}

export interface WorkoutLog {
  id: string;
  workoutPlanId: string;
  exerciseName: string;
  date: string;
  sets: SetLog[];
}

export interface SetLog {
  setNumber: number;
  weight: number; // in kg
  reps: number;
  completed: boolean;
  isWarmup?: boolean;
}

export interface WeeklyCheckIn {
  id: string;
  date: string;
  weight: number; // in kg
  mood: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
  energy: number; // 1-10 scale
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BodyScan {
  id: string;
  date: string;
  imageUri: string;
  analysis: {
    bodyFatPercentage?: number;
    muscleMass?: number;
    measurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      arms?: number;
      thighs?: number;
    };
    insights: string;
  };
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: number;
  cookTime: number;
  servings: number;
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  benefits: string;
  warnings?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  neck?: number;
  chest?: number;
  leftBicep?: number;
  rightBicep?: number;
  waist?: number;
  hips?: number;
  leftThigh?: number;
  rightThigh?: number;
  leftCalf?: number;
  rightCalf?: number;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  frontUri: string;
  sideUri?: string;
  backUri?: string;
  weight?: number;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'workout' | 'streak' | 'weight' | 'pr' | 'milestone';
}