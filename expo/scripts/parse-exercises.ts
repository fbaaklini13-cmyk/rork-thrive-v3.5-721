/**
 * Script to parse exercise data from text format
 * Run this to generate the full exercise database
 */

export interface RawExercise {
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: string;
}

export function parseExerciseText(text: string): RawExercise[] {
  const exercises: RawExercise[] = [];
  const lines = text.split('\n');
  
  let currentExercise: Partial<RawExercise> = {};
  
  for (const line of lines) {
    if (line.startsWith('Exercise: ')) {
      if (currentExercise.name) {
        exercises.push(currentExercise as RawExercise);
      }
      currentExercise = {
        name: line.replace('Exercise: ', '').trim(),
        secondaryMuscles: [],
      };
    } else if (line.startsWith('Primary Muscle: ')) {
      currentExercise.primaryMuscle = line.replace('Primary Muscle: ', '').trim();
    } else if (line.startsWith('Secondary Muscles: ')) {
      const muscles = line.replace('Secondary Muscles: ', '').trim();
      currentExercise.secondaryMuscles = muscles ? muscles.split(',').map(m => m.trim()).filter(Boolean) : [];
    } else if (line.startsWith('Equipment: ')) {
      currentExercise.equipment = line.replace('Equipment: ', '').trim();
    } else if (line.startsWith('Difficulty: ')) {
      currentExercise.difficulty = line.replace('Difficulty: ', '').trim();
    } else if (line === '---') {
      if (currentExercise.name) {
        exercises.push(currentExercise as RawExercise);
        currentExercise = {};
      }
    }
  }
  
  if (currentExercise.name) {
    exercises.push(currentExercise as RawExercise);
  }
  
  return exercises.filter(ex => ex.name && ex.name !== 'Unknown' && ex.primaryMuscle);
}

export function mapMuscleToGroup(muscle: string): string {
  const lowerMuscle = muscle.toLowerCase();
  
  if (lowerMuscle.includes('chest') || lowerMuscle.includes('pectoralis')) return 'chest';
  if (lowerMuscle.includes('shoulder') || lowerMuscle.includes('deltoid')) return 'shoulders';
  if (lowerMuscle.includes('tricep')) return 'triceps';
  if (lowerMuscle.includes('bicep')) return 'biceps';
  if (lowerMuscle.includes('back') || lowerMuscle.includes('lat') || lowerMuscle.includes('rhomboid') || lowerMuscle.includes('trapezius') || lowerMuscle.includes('traps')) return 'back';
  if (lowerMuscle.includes('abdominal') || lowerMuscle.includes('abs') || lowerMuscle.includes('core')) return 'abs';
  if (lowerMuscle.includes('quadricep') || lowerMuscle.includes('quads')) return 'quads';
  if (lowerMuscle.includes('hamstring')) return 'hamstrings';
  if (lowerMuscle.includes('glute') || lowerMuscle.includes('buttocks')) return 'glutes';
  if (lowerMuscle.includes('calves') || lowerMuscle.includes('calf')) return 'calves';
  if (lowerMuscle.includes('forearm')) return 'forearms';
  if (lowerMuscle.includes('neck')) return 'neck';
  if (lowerMuscle.includes('adductor')) return 'adductors';
  if (lowerMuscle.includes('abductor')) return 'abductors';
  
  return lowerMuscle;
}

export function mapEquipment(equipment: string): string {
  const lowerEquip = equipment.toLowerCase();
  
  if (lowerEquip.includes('barbell') || lowerEquip.includes('e-z curl bar')) return 'barbell';
  if (lowerEquip.includes('dumbbell')) return 'dumbbell';
  if (lowerEquip.includes('machine')) return 'machine';
  if (lowerEquip.includes('cable')) return 'cable';
  if (lowerEquip.includes('band')) return 'bands';
  if (lowerEquip.includes('body only') || lowerEquip.includes('bodyweight') || lowerEquip.includes('body weight') || lowerEquip === 'none') return 'bodyweight';
  if (lowerEquip.includes('kettlebell')) return 'kettlebells';
  if (lowerEquip.includes('exercise ball') || lowerEquip.includes('medicine ball')) return 'other';
  if (lowerEquip === 'n/a' || !lowerEquip) return 'bodyweight';
  
  return 'other';
}

export function generateExerciseId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
