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
  | 'lats'
  | 'traps'
  | 'middle back'
  | 'lower back'
  | 'adductors'
  | 'abductors';

export const MUSCLE_GROUP_ICONS: Record<string, string> = {
  chest: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/evrqj0duub403l8lwrr6z',
  biceps: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/v3wxv71g1qa720yeat9wq',
  triceps: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/sdrhgqasemu8ylvsepvtx',
  abs: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/b7at9ivu8zdu1nfxqsh5n',
  quads: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/t4su4ul3gx9dmjmnkuzs4',
  hamstrings: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/zjovvo84fg48agou3v2wn',
  back: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/z37m4tmwqd0guf69bdyto',
  shoulders: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/cn8l0zjjmzot272u1wstq',
  forearms: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ez3h9tg39q9q446h6j7kr',
  calves: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/5ramzwuwnuoesf7qram90',
  glutes: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/e2x7m2csustx7zk8zh228',
};

export const MUSCLE_GROUP_COLORS: Record<string, string> = {
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
  lats: '#FFD93D',
  traps: '#95E1D3',
  'middle back': '#F8B195',
  'lower back': '#F67280',
  adductors: '#C06C84',
  abductors: '#6C5B7B',
};

export function getMuscleGroupColor(muscleGroup: string): string {
  return MUSCLE_GROUP_COLORS[muscleGroup.toLowerCase()] || '#95A5A6';
}

export function getMuscleGroupIcon(muscleGroup: string): string | undefined {
  return MUSCLE_GROUP_ICONS[muscleGroup.toLowerCase()];
}
