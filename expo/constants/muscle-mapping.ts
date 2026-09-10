// Comprehensive muscle to body region mapping for accurate heat map display

export const MUSCLE_TO_BODY_REGION = {
  // FRONT VIEW MUSCLES
  // Chest
  'chest': { front: true, back: false },
  'pectorals': { front: true, back: false },
  'pecs': { front: true, back: false },
  
  // Shoulders (visible from both sides)
  'shoulders': { front: true, back: true },
  'deltoids': { front: true, back: true },
  'delts': { front: true, back: true },
  
  // Arms - Front
  'biceps': { front: true, back: false },
  'forearms': { front: true, back: true },
  
  // Arms - Back
  'triceps': { front: false, back: true },
  
  // Core - Front
  'abdominals': { front: true, back: false },
  'abs': { front: true, back: false },
  'obliques': { front: true, back: false },
  
  // Core - Back
  'lower back': { front: false, back: true },
  'lats': { front: false, back: true },
  'middle back': { front: false, back: true },
  'traps': { front: false, back: true },
  'upper back': { front: false, back: true },
  
  // Legs - Front
  'quadriceps': { front: true, back: false },
  'quads': { front: true, back: false },
  'hip flexors': { front: true, back: false },
  'adductors': { front: true, back: false },
  'abductors': { front: true, back: false },
  
  // Legs - Back
  'hamstrings': { front: false, back: true },
  'glutes': { front: false, back: true },
  'gluteus': { front: false, back: true },
  
  // Legs - Both (lower leg)
  'calves': { front: true, back: true },
  
  // Neck
  'neck': { front: true, back: true },
};

export function shouldShowOnFront(muscle: string): boolean {
  const muscleLower = muscle.toLowerCase().trim();
  
  // Check direct mapping
  for (const [key, value] of Object.entries(MUSCLE_TO_BODY_REGION)) {
    if (muscleLower.includes(key)) {
      return value.front;
    }
  }
  
  // Default fallback based on common patterns
  if (muscleLower.includes('chest') || 
      muscleLower.includes('pec') ||
      muscleLower.includes('bicep') ||
      muscleLower.includes('abs') ||
      muscleLower.includes('quad') ||
      muscleLower.includes('adduct') ||
      muscleLower.includes('abduct')) {
    return true;
  }
  
  return false;
}

export function shouldShowOnBack(muscle: string): boolean {
  const muscleLower = muscle.toLowerCase().trim();
  
  // Check direct mapping
  for (const [key, value] of Object.entries(MUSCLE_TO_BODY_REGION)) {
    if (muscleLower.includes(key)) {
      return value.back;
    }
  }
  
  // Default fallback based on common patterns
  if (muscleLower.includes('back') ||
      muscleLower.includes('lat') ||
      muscleLower.includes('trap') ||
      muscleLower.includes('tricep') ||
      muscleLower.includes('hamstring') ||
      muscleLower.includes('glute') ||
      muscleLower.includes('posterior')) {
    return true;
  }
  
  return false;
}

// Map muscle names to their corresponding overlay colors
export function getMuscleColor(muscle: string, isPrimary: boolean): string {
  const colors = {
    // Upper body
    'chest': '#FF6B6B',
    'shoulders': '#4ECDC4',
    'biceps': '#45B7D1',
    'triceps': '#96CEB4',
    'forearms': '#FFEAA7',
    
    // Back
    'lats': '#DFE6E9',
    'traps': '#A29BFE',
    'middle back': '#6C5CE7',
    'lower back': '#FD79A8',
    'upper back': '#FDCB6E',
    
    // Core
    'abdominals': '#FF7675',
    'obliques': '#FF7675',
    'abs': '#FF7675',
    
    // Legs
    'quadriceps': '#74B9FF',
    'hamstrings': '#55EFC4',
    'glutes': '#FFEAA7',
    'calves': '#A29BFE',
    'adductors': '#FD79A8',
    'abductors': '#FDCB6E',
  };
  
  const muscleLower = muscle.toLowerCase().trim();
  
  for (const [key, color] of Object.entries(colors)) {
    if (muscleLower.includes(key)) {
      return color;
    }
  }
  
  // Default color
  return isPrimary ? '#FF6B6B' : '#95A5A6';
}
