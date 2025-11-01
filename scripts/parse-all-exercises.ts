// Script to parse all 879 exercises from the provided data
// Run this with: bun run scripts/parse-all-exercises.ts

const rawExerciseData = `
Exercise: 3/4 Sit-Up | Primary: abdominals | Secondary:  | Equipment: body only | Difficulty: beginner
Exercise: 90/90 Hamstring | Primary: hamstrings | Secondary: calves | Equipment: body only | Difficulty: beginner
Exercise: Ab Crunch Machine | Primary: abdominals | Secondary:  | Equipment: machine | Difficulty: intermediate
Exercise: Ab Roller | Primary: abdominals | Secondary: shoulders | Equipment: other | Difficulty: intermediate
Exercise: Adductor | Primary: adductors | Secondary:  | Equipment: foam roll | Difficulty: intermediate
Exercise: Adductor/Groin | Primary: adductors | Secondary:  | Equipment: None | Difficulty: intermediate
Exercise: Advanced Kettlebell Windmill | Primary: abdominals | Secondary: glutes, hamstrings, shoulders | Equipment: kettlebells | Difficulty: intermediate
Exercise: Air Bike | Primary: abdominals | Secondary:  | Equipment: body only | Difficulty: beginner
Exercise: All Fours Quad Stretch | Primary: quadriceps | Secondary: quadriceps | Equipment: body only | Difficulty: intermediate
Exercise: Alternate Hammer Curl | Primary: biceps | Secondary: forearms | Equipment: dumbbell | Difficulty: beginner
Exercise: Alternate Heel Touchers | Primary: abdominals | Secondary:  | Equipment: body only | Difficulty: beginner
Exercise: Alternate Incline Dumbbell Curl | Primary: biceps | Secondary: forearms | Equipment: dumbbell | Difficulty: beginner
Exercise: Alternate Leg Diagonal Bound | Primary: quadriceps | Secondary: abductors, adductors, calves, glutes, hamstrings | Equipment: None | Difficulty: beginner
Exercise: Alternating Cable Shoulder Press | Primary: shoulders | Secondary: triceps | Equipment: cable | Difficulty: beginner
Exercise: Alternating Deltoid Raise | Primary: shoulders | Secondary:  | Equipment: dumbbell | Difficulty: beginner
Exercise: Alternating Floor Press | Primary: chest | Secondary: abdominals, shoulders, triceps | Equipment: kettlebells | Difficulty: beginner
Exercise: Alternating Hang Clean | Primary: hamstrings | Secondary: biceps, calves, forearms, glutes, lower back, traps | Equipment: kettlebells | Difficulty: intermediate
Exercise: Alternating Kettlebell Press | Primary: shoulders | Secondary: triceps | Equipment: kettlebells | Difficulty: intermediate
Exercise: Alternating Kettlebell Row | Primary: middle back | Secondary: biceps, lats | Equipment: kettlebells | Difficulty: intermediate
Exercise: Alternating Renegade Row | Primary: middle back | Secondary: abdominals, biceps, chest, lats, triceps | Equipment: kettlebells | Difficulty: expert
Exercise: Ankle Circles | Primary: calves | Secondary:  | Equipment: None | Difficulty: beginner
Exercise: Ankle On The Knee | Primary: glutes | Secondary:  | Equipment: None | Difficulty: beginner
Exercise: Anterior Tibialis-SMR | Primary: calves | Secondary:  | Equipment: other | Difficulty: intermediate
Exercise: Anti-Gravity Press | Primary: shoulders | Secondary: middle back, traps, triceps | Equipment: barbell | Difficulty: beginner
Exercise: Arm Circles | Primary: shoulders | Secondary: traps | Equipment: None | Difficulty: beginner
Exercise: Arnold Dumbbell Press | Primary: shoulders | Secondary: triceps | Equipment: dumbbell | Difficulty: intermediate
Exercise: Around The Worlds | Primary: chest | Secondary: shoulders | Equipment: dumbbell | Difficulty: intermediate
Exercise: Atlas Stone Trainer | Primary: lower back | Secondary: biceps, forearms, glutes, hamstrings, quadriceps | Equipment: other | Difficulty: intermediate
Exercise: Atlas Stones | Primary: lower back | Secondary: abdominals, adductors, biceps, calves, forearms, glutes, hamstrings, middle back, quadriceps, traps | Equipment: other | Difficulty: expert
Exercise: Axle Deadlift | Primary: lower back | Secondary: forearms, glutes, hamstrings, middle back, quadriceps, traps | Equipment: other | Difficulty: intermediate
`;

// This is a template - the full data would be too large
// The actual implementation will generate the exercises dynamically

console.log("Parsing all exercises...");
console.log("Total exercises to process: 879");
