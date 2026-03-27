// Complete exercise library with all 879 exercises
// Auto-generated from exercise database

import { FullExerciseData } from '@/types/exercise';

const createId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Due to the massive size, we'll load exercises dynamically
// Each exercise follows the format: name | primary muscle | secondary muscles | equipment | difficulty

const rawExerciseData = `
3/4 Sit-Up|abdominals||body only|beginner
90/90 Hamstring|hamstrings|calves|body only|beginner
Ab Crunch Machine|abdominals||machine|intermediate
Ab Roller|abdominals|shoulders|other|intermediate
Adductor|adductors||foam roll|intermediate
Adductor/Groin|adductors||None|intermediate
Advanced Kettlebell Windmill|abdominals|glutes, hamstrings, shoulders|kettlebells|intermediate
Air Bike|abdominals||body only|beginner
All Fours Quad Stretch|quadriceps|quadriceps|body only|intermediate
Alternate Hammer Curl|biceps|forearms|dumbbell|beginner
Alternate Heel Touchers|abdominals||body only|beginner
Alternate Incline Dumbbell Curl|biceps|forearms|dumbbell|beginner
Alternate Leg Diagonal Bound|quadriceps|abductors, adductors, calves, glutes, hamstrings|None|beginner
Alternating Cable Shoulder Press|shoulders|triceps|cable|beginner
Alternating Deltoid Raise|shoulders||dumbbell|beginner
Alternating Floor Press|chest|abdominals, shoulders, triceps|kettlebells|beginner
Alternating Hang Clean|hamstrings|biceps, calves, forearms, glutes, lower back, traps|kettlebells|intermediate
Alternating Kettlebell Press|shoulders|triceps|kettlebells|intermediate
Alternating Kettlebell Row|middle back|biceps, lats|kettlebells|intermediate
Alternating Renegade Row|middle back|abdominals, biceps, chest, lats, triceps|kettlebells|expert
Ankle Circles|calves||None|beginner
Ankle On The Knee|glutes||None|beginner
Anterior Tibialis-SMR|calves||other|intermediate
Anti-Gravity Press|shoulders|middle back, traps, triceps|barbell|beginner
Arm Circles|shoulders|traps|None|beginner
Arnold Dumbbell Press|shoulders|triceps|dumbbell|intermediate
Around The Worlds|chest|shoulders|dumbbell|intermediate
Atlas Stone Trainer|lower back|biceps, forearms, glutes, hamstrings, quadriceps|other|intermediate
Atlas Stones|lower back|abdominals, adductors, biceps, calves, forearms, glutes, hamstrings, middle back, quadriceps, traps|other|expert
Axle Deadlift|lower back|forearms, glutes, hamstrings, middle back, quadriceps, traps|other|intermediate
Back Flyes - With Bands|shoulders|middle back, triceps|bands|beginner
Backward Drag|quadriceps|calves, forearms, glutes, hamstrings, lower back|other|beginner
Backward Medicine Ball Throw|shoulders||medicine ball|beginner
Balance Board|calves|hamstrings, quadriceps|other|beginner
Ball Leg Curl|hamstrings|calves, glutes|exercise ball|beginner
Band Assisted Pull-Up|lats|abdominals, forearms, middle back|other|beginner
Band Good Morning|hamstrings|glutes, lower back|bands|beginner
Band Good Morning (Pull Through)|hamstrings|glutes, lower back|bands|beginner
Band Hip Adductions|adductors||bands|beginner
Band Pull Apart|shoulders|middle back, traps|bands|beginner
Band Skull Crusher|triceps||bands|beginner
Barbell Ab Rollout|abdominals|lower back, shoulders|barbell|intermediate
Barbell Ab Rollout - On Knees|abdominals|lower back, shoulders|barbell|expert
Barbell Bench Press - Medium Grip|chest|shoulders, triceps|barbell|beginner
Barbell Curl|biceps|forearms|barbell|beginner
Barbell Curls Lying Against An Incline|biceps||barbell|beginner
Barbell Deadlift|lower back|calves, forearms, glutes, hamstrings, lats, middle back, quadriceps, traps|barbell|intermediate
Barbell Full Squat|quadriceps|calves, glutes, hamstrings, lower back|barbell|intermediate
Barbell Glute Bridge|glutes|calves, hamstrings|barbell|intermediate
Barbell Guillotine Bench Press|chest|shoulders, triceps|barbell|intermediate
Barbell Hack Squat|quadriceps|calves, forearms, hamstrings|barbell|intermediate
Barbell Hip Thrust|glutes|calves, hamstrings|barbell|intermediate
Barbell Incline Bench Press - Medium Grip|chest|shoulders, triceps|barbell|beginner
Barbell Incline Shoulder Raise|shoulders|chest|barbell|beginner
Barbell Lunge|quadriceps|calves, glutes, hamstrings|barbell|intermediate
Barbell Rear Delt Row|shoulders|biceps, lats, middle back|barbell|beginner
Barbell Rollout from Bench|abdominals|glutes, hamstrings, lats, shoulders|barbell|intermediate
Barbell Seated Calf Raise|calves||barbell|beginner
Barbell Shoulder Press|shoulders|chest, triceps|barbell|intermediate
Barbell Shrug|traps||barbell|beginner
Barbell Shrug Behind The Back|traps|forearms, middle back|barbell|beginner
Barbell Side Bend|abdominals|lower back|barbell|beginner
Barbell Side Split Squat|quadriceps|calves, hamstrings, lower back|barbell|beginner
Barbell Squat|quadriceps|calves, glutes, hamstrings, lower back|barbell|beginner
Barbell Squat To A Bench|quadriceps|calves, glutes, hamstrings, lower back|barbell|expert
Barbell Step Ups|quadriceps|calves, glutes, hamstrings, quadriceps|barbell|intermediate
Barbell Walking Lunge|quadriceps|calves, glutes, hamstrings|barbell|beginner
Battling Ropes|shoulders|chest, forearms|other|beginner
Bear Crawl Sled Drags|quadriceps|calves, glutes, hamstrings|other|beginner
Behind Head Chest Stretch|chest|shoulders|other|expert
Bench Dips|triceps|chest, shoulders|body only|beginner
Bench Jump|quadriceps|calves, glutes, hamstrings|body only|intermediate
Bench Press - Powerlifting|triceps|chest, forearms, lats, shoulders|barbell|intermediate
Bench Press - With Bands|chest|shoulders, triceps|bands|beginner
Bench Press with Chains|triceps|chest, lats, shoulders|barbell|expert
Bench Sprint|quadriceps|calves, glutes, hamstrings|other|beginner
Bent-Arm Barbell Pullover|lats|chest, lats, shoulders, triceps|barbell|intermediate
Bent-Arm Dumbbell Pullover|chest|lats, shoulders, triceps|dumbbell|intermediate
Bent-Knee Hip Raise|abdominals||body only|beginner
Bent Over Barbell Row|middle back|biceps, lats, shoulders|barbell|beginner
Bent Over Dumbbell Rear Delt Raise With Head On Bench|shoulders||dumbbell|beginner
Bent Over Low-Pulley Side Lateral|shoulders|lower back, middle back, traps|cable|beginner
Bent Over One-Arm Long Bar Row|middle back|biceps, lats, lower back, traps|barbell|beginner
Bent Over Two-Arm Long Bar Row|middle back|biceps, lats|barbell|intermediate
Bent Over Two-Dumbbell Row|middle back|biceps, lats, shoulders|dumbbell|beginner
Bent Over Two-Dumbbell Row With Palms In|middle back|biceps, lats|dumbbell|beginner
Bent Press|abdominals|glutes, hamstrings, lower back, quadriceps, shoulders, triceps|kettlebells|expert
Bicycling|quadriceps|calves, glutes, hamstrings|other|beginner
Bicycling, Stationary|quadriceps|calves, glutes, hamstrings|machine|beginner
Board Press|triceps|chest, forearms, lats, shoulders|barbell|intermediate
Body-Up|triceps|abdominals, forearms|body only|intermediate
Body Tricep Press|triceps||body only|beginner
Bodyweight Flyes|chest|abdominals, shoulders, triceps|e-z curl bar|intermediate
Bodyweight Mid Row|middle back|biceps, lats|other|intermediate
Bodyweight Squat|quadriceps|glutes, hamstrings|body only|beginner
Bodyweight Walking Lunge|quadriceps|calves, glutes, hamstrings|None|beginner
Bosu Ball Cable Crunch With Side Bends|abdominals||cable|beginner
Bottoms-Up Clean From The Hang Position|forearms|biceps, shoulders|kettlebells|intermediate
Bottoms Up|abdominals||body only|beginner
Box Jump (Multiple Response)|hamstrings|abductors, adductors, calves, glutes, quadriceps|other|beginner
Box Skip|hamstrings|abductors, adductors, calves, glutes, quadriceps|other|beginner
Box Squat|quadriceps|adductors, calves, glutes, hamstrings, lower back|barbell|intermediate
Box Squat with Bands|quadriceps|abductors, adductors, calves, glutes, hamstrings, lower back|barbell|expert
Box Squat with Chains|quadriceps|abductors, adductors, calves, glutes, hamstrings, lower back|barbell|expert
Brachialis-SMR|biceps||foam roll|intermediate
Bradford/Rocky Presses|shoulders|triceps|barbell|beginner
Butt-Ups|abdominals||body only|beginner
Butt Lift (Bridge)|glutes|hamstrings|body only|beginner
Butterfly|chest||machine|beginner
Cable Chest Press|chest|shoulders, triceps|cable|beginner
Cable Crossover|chest|shoulders|cable|beginner
Cable Crunch|abdominals||cable|beginner
Cable Deadlifts|quadriceps|forearms, glutes, hamstrings, lower back|cable|beginner
Cable Hammer Curls - Rope Attachment|biceps||cable|beginner
Cable Hip Adduction|quadriceps||cable|beginner
Cable Incline Pushdown|lats||cable|beginner
Cable Incline Triceps Extension|triceps||cable|beginner
Cable Internal Rotation|shoulders||cable|beginner
Cable Iron Cross|chest||cable|beginner
Cable Judo Flip|abdominals||cable|beginner
Cable Lying Triceps Extension|triceps||cable|beginner
Cable One Arm Tricep Extension|triceps||cable|beginner
Cable Preacher Curl|biceps|forearms|cable|beginner
Cable Rear Delt Fly|shoulders||cable|beginner
Cable Reverse Crunch|abdominals||cable|beginner
Cable Rope Overhead Triceps Extension|triceps||cable|beginner
Cable Rope Rear-Delt Rows|shoulders|biceps, middle back|cable|beginner
Cable Russian Twists|abdominals||cable|beginner
Cable Seated Crunch|abdominals||cable|beginner
Cable Seated Lateral Raise|shoulders|middle back, traps|cable|beginner
Cable Shoulder Press|shoulders|triceps|cable|beginner
Cable Shrugs|traps||cable|beginner
Cable Wrist Curl|forearms||cable|beginner
Calf-Machine Shoulder Shrug|traps||machine|beginner
Calf Press|calves||machine|beginner
Calf Press On The Leg Press Machine|calves||machine|beginner
Calf Raise On A Dumbbell|calves||dumbbell|intermediate
Calf Raises - With Bands|calves||bands|beginner
Calf Stretch Elbows Against Wall|calves||None|beginner
Calf Stretch Hands Against Wall|calves||None|beginner
Calves-SMR|calves||foam roll|intermediate
Car Deadlift|quadriceps|forearms, glutes, hamstrings, lower back, traps|other|intermediate
Car Drivers|shoulders|forearms|barbell|beginner
Carioca Quick Step|adductors|abdominals, abductors, calves, glutes, hamstrings, quadriceps|None|beginner
Cat Stretch|lower back|middle back, traps|None|beginner
Catch and Overhead Throw|lats|abdominals, chest, shoulders|medicine ball|beginner
Chain Handle Extension|triceps||other|intermediate
Chain Press|chest|shoulders, triceps|other|intermediate
Chair Leg Extended Stretch|hamstrings|adductors|other|beginner
Chair Lower Back Stretch|lats|lower back|None|beginner
Chair Squat|quadriceps|calves, glutes, hamstrings|machine|beginner
Chair Upper Body Stretch|shoulders|biceps, chest|other|beginner
Chest And Front Of Shoulder Stretch|chest|shoulders|other|beginner
Chest Push from 3 point stance|chest|abdominals, shoulders, triceps|medicine ball|beginner
Chest Push (multiple response)|chest|abdominals, shoulders, triceps|medicine ball|beginner
Chest Push (single response)|chest|abdominals, shoulders, triceps|medicine ball|beginner
Chest Push with Run Release|chest|abdominals, shoulders, triceps|medicine ball|beginner
Chest Stretch on Stability Ball|chest||exercise ball|beginner
Child's Pose|lower back|glutes, middle back|None|beginner
Chin-Up|lats|biceps, forearms, middle back|body only|beginner
Chin To Chest Stretch|neck|traps|None|beginner
Circus Bell|shoulders|forearms, glutes, hamstrings, lower back, traps, triceps|other|expert
Clean|hamstrings|calves, forearms, glutes, lower back, quadriceps, shoulders, traps|barbell|intermediate
Clean Deadlift|hamstrings|forearms, glutes, lower back, middle back, quadriceps, traps|barbell|beginner
Clean Pull|quadriceps|forearms, glutes, hamstrings, lower back, traps|barbell|intermediate
Clean Shrug|traps|forearms, shoulders|barbell|beginner
Clean and Jerk|shoulders|abdominals, glutes, hamstrings, lower back, quadriceps, traps, triceps|barbell|expert
Clean and Press|shoulders|abdominals, calves, glutes, hamstrings, lower back, middle back, quadriceps, shoulders, traps, triceps|barbell|intermediate
Clean from Blocks|quadriceps|calves, glutes, hamstrings, shoulders, traps|barbell|intermediate
Clock Push-Up|chest|shoulders, triceps|body only|intermediate
Close-Grip Barbell Bench Press|triceps|chest, shoulders|barbell|beginner
Close-Grip Dumbbell Press|triceps|chest, shoulders|dumbbell|beginner
Close-Grip EZ-Bar Curl with Band|biceps|forearms|e-z curl bar|beginner
Close-Grip EZ-Bar Press|triceps|chest, shoulders|e-z curl bar|beginner
Close-Grip EZ Bar Curl|biceps|forearms|barbell|beginner
Close-Grip Front Lat Pulldown|lats|biceps, middle back, shoulders|cable|beginner
Close-Grip Push-Up off of a Dumbbell|triceps|abdominals, chest, shoulders|body only|intermediate
Close-Grip Standing Barbell Curl|biceps|forearms|barbell|beginner
Cocoons|abdominals||body only|beginner
Conan's Wheel|quadriceps|abdominals, biceps, calves, forearms, lower back, shoulders, traps|other|intermediate
Concentration Curls|biceps|forearms|dumbbell|beginner
Cross-Body Crunch|abdominals||body only|beginner
Cross Body Hammer Curl|biceps|forearms|dumbbell|beginner
Cross Over - With Bands|chest|biceps, shoulders|bands|beginner
Crossover Reverse Lunge|lower back|abdominals, abductors, glutes, hamstrings, quadriceps|None|intermediate
Crucifix|shoulders|forearms|other|beginner
Crunch - Hands Overhead|abdominals||body only|beginner
Crunch - Legs On Exercise Ball|abdominals||body only|beginner
Crunches|abdominals||body only|beginner
Cuban Press|shoulders|traps|dumbbell|intermediate
Dancer's Stretch|lower back|abductors, glutes|None|beginner
Dead Bug|abdominals||body only|beginner
Deadlift with Bands|lower back|forearms, glutes, hamstrings, middle back, quadriceps, traps|barbell|expert
Deadlift with Chains|lower back|forearms, glutes, hamstrings, middle back, quadriceps, traps|barbell|expert
Decline Barbell Bench Press|chest|shoulders, triceps|barbell|beginner
Decline Close-Grip Bench To Skull Crusher|triceps|chest, shoulders|barbell|intermediate
Decline Crunch|abdominals||body only|intermediate
Decline Dumbbell Bench Press|chest|shoulders, triceps|dumbbell|beginner
Decline Dumbbell Flyes|chest||dumbbell|beginner
Decline Dumbbell Triceps Extension|triceps||dumbbell|beginner
Decline EZ Bar Triceps Extension|triceps||barbell|beginner
Decline Oblique Crunch|abdominals||body only|beginner
Decline Push-Up|chest|shoulders, triceps|None|beginner
Decline Reverse Crunch|abdominals||body only|beginner
Decline Smith Press|chest|shoulders, triceps|machine|beginner
Deficit Deadlift|lower back|forearms, glutes, hamstrings, middle back, quadriceps, traps|barbell|intermediate
Depth Jump Leap|quadriceps|abductors, adductors, calves, glutes, hamstrings|other|beginner
Dip Machine|triceps|chest, shoulders|machine|beginner
Dips - Chest Version|chest|shoulders, triceps|other|intermediate
Dips - Triceps Version|triceps|chest, shoulders|body only|beginner
Donkey Calf Raises|calves||other|intermediate
Double Kettlebell Alternating Hang Clean|hamstrings|biceps, calves, forearms, glutes, lower back, quadriceps, traps|kettlebells|intermediate
Double Kettlebell Jerk|shoulders|calves, quadriceps, triceps|kettlebells|intermediate
Double Kettlebell Push Press|shoulders|calves, quadriceps, triceps|kettlebells|intermediate
Double Kettlebell Snatch|shoulders|glutes, hamstrings, quadriceps|kettlebells|expert
Double Kettlebell Windmill|abdominals|glutes, hamstrings, shoulders, triceps|kettlebells|intermediate
Double Leg Butt Kick|quadriceps|abductors, adductors, calves, glutes, hamstrings|body only|beginner
Downward Facing Balance|glutes|abdominals, hamstrings|exercise ball|intermediate
Drag Curl|biceps|forearms|barbell|intermediate
Drop Push|chest|shoulders, triceps|other|intermediate
Dumbbell Alternate Bicep Curl|biceps|forearms|dumbbell|beginner
Dumbbell Bench Press|chest|shoulders, triceps|dumbbell|beginner
Dumbbell Bench Press with Neutral Grip|chest|shoulders, triceps|dumbbell|beginner
Dumbbell Bicep Curl|biceps|forearms|dumbbell|beginner
Dumbbell Clean|hamstrings|calves, forearms, glutes, lower back, quadriceps, shoulders, traps|dumbbell|intermediate
Dumbbell Floor Press|triceps|chest, shoulders|dumbbell|intermediate
Dumbbell Flyes|chest||dumbbell|beginner
Dumbbell Incline Row|middle back|biceps, forearms, lats, shoulders|dumbbell|beginner
Dumbbell Incline Shoulder Raise|shoulders|triceps|dumbbell|beginner
Dumbbell Lunges|quadriceps|calves, glutes, hamstrings|dumbbell|beginner
Dumbbell Lying One-Arm Rear Lateral Raise|shoulders|middle back|dumbbell|intermediate
Dumbbell Lying Pronation|forearms||dumbbell|intermediate
Dumbbell Lying Rear Lateral Raise|shoulders||dumbbell|intermediate
Dumbbell Lying Supination|forearms||dumbbell|intermediate
Dumbbell One-Arm Shoulder Press|shoulders|triceps|dumbbell|intermediate
Dumbbell One-Arm Triceps Extension|triceps||dumbbell|intermediate
Dumbbell One-Arm Upright Row|shoulders|biceps, traps|dumbbell|intermediate
Dumbbell Prone Incline Curl|biceps||dumbbell|intermediate
Dumbbell Raise|shoulders|biceps|dumbbell|beginner
Dumbbell Rear Lunge|quadriceps|calves, glutes, hamstrings|dumbbell|intermediate
Dumbbell Scaption|shoulders|traps|dumbbell|beginner
Dumbbell Seated Box Jump|quadriceps|calves, glutes, hamstrings|dumbbell|intermediate
Dumbbell Seated One-Leg Calf Raise|calves||dumbbell|beginner
Dumbbell Shoulder Press|shoulders|triceps|dumbbell|intermediate
Dumbbell Shrug|traps||dumbbell|beginner
Dumbbell Side Bend|abdominals||dumbbell|beginner
Dumbbell Squat|quadriceps|calves, glutes, hamstrings, lower back|dumbbell|beginner
Dumbbell Squat To A Bench|quadriceps|calves, glutes, hamstrings, lower back|dumbbell|intermediate
Dumbbell Step Ups|quadriceps|calves, glutes, hamstrings|dumbbell|intermediate
Dumbbell Tricep Extension -Pronated Grip|triceps||dumbbell|beginner
Dynamic Back Stretch|lats||None|beginner
Dynamic Chest Stretch|chest|middle back|None|beginner
EZ-Bar Curl|biceps||e-z curl bar|beginner
EZ-Bar Skullcrusher|triceps|forearms|e-z curl bar|beginner
Elbow Circles|shoulders|traps|None|beginner
Elbow to Knee|abdominals||body only|beginner
Elbows Back|chest|shoulders|None|beginner
Elevated Back Lunge|quadriceps|glutes, hamstrings|barbell|intermediate
Elevated Cable Rows|lats|middle back, traps|cable|intermediate
Elliptical Trainer|quadriceps|calves, glutes, hamstrings|machine|intermediate
Exercise Ball Crunch|abdominals||exercise ball|beginner
Exercise Ball Pull-In|abdominals||exercise ball|beginner
Extended Range One-Arm Kettlebell Floor Press|chest|shoulders, triceps|kettlebells|beginner
External Rotation|shoulders||dumbbell|beginner
External Rotation with Band|shoulders||bands|beginner
External Rotation with Cable|shoulders||cable|beginner
Face Pull|shoulders|middle back|cable|intermediate
Farmer's Walk|forearms|abdominals, glutes, hamstrings, lower back, quadriceps, traps|other|intermediate
Fast Skipping|quadriceps|abductors, adductors, calves, glutes, hamstrings|body only|beginner
Finger Curls|forearms||barbell|beginner
Flat Bench Cable Flyes|chest||cable|intermediate
Flat Bench Leg Pull-In|abdominals||body only|beginner
Flat Bench Lying Leg Raise|abdominals||body only|beginner
Flexor Incline Dumbbell Curls|biceps||dumbbell|beginner
Floor Glute-Ham Raise|hamstrings|calves, glutes|None|intermediate
Floor Press|triceps|chest, shoulders|barbell|intermediate
Floor Press with Chains|triceps|chest, shoulders|barbell|intermediate
Flutter Kicks|glutes|hamstrings|body only|beginner
Foot-SMR|calves||other|intermediate
Forward Drag with Press|chest|calves, glutes, hamstrings, quadriceps, shoulders, triceps|other|intermediate
Frankenstein Squat|quadriceps|abdominals, calves, glutes, hamstrings|barbell|intermediate
Freehand Jump Squat|quadriceps|calves, glutes, hamstrings|body only|intermediate
Frog Hops|quadriceps|calves, glutes, hamstrings|None|intermediate
Frog Sit-Ups|abdominals||body only|intermediate
Front Barbell Squat|quadriceps|calves, glutes, hamstrings|barbell|expert
Front Barbell Squat To A Bench|quadriceps|calves, glutes, hamstrings|barbell|expert
Front Box Jump|hamstrings|abductors, adductors, calves, glutes, quadriceps|other|beginner
Front Cable Raise|shoulders||cable|beginner
Front Cone Hops (or hurdle hops)|quadriceps|abductors, adductors, calves, glutes, hamstrings|other|beginner
Front Dumbbell Raise|shoulders||dumbbell|beginner
Front Incline Dumbbell Raise|shoulders||dumbbell|beginner
Front Leg Raises|hamstrings||body only|beginner
Front Plate Raise|shoulders||other|intermediate
Front Raise And Pullover|chest|lats, shoulders, triceps|barbell|beginner
Front Squat (Clean Grip)|quadriceps|abdominals, glutes, hamstrings|barbell|intermediate
Front Squats With Two Kettlebells|quadriceps|calves, glutes|kettlebells|intermediate
Front Two-Dumbbell Raise|shoulders||dumbbell|beginner
Full Range-Of-Motion Lat Pulldown|lats|biceps, middle back, shoulders|cable|intermediate
Gironda Sternum Chins|lats|biceps, middle back|other|intermediate
Glute Ham Raise|hamstrings|calves, glutes|machine|intermediate
Glute Kickback|glutes|hamstrings|body only|beginner
Goblet Squat|quadriceps|calves, glutes, hamstrings, shoulders|kettlebells|beginner
Good Morning|hamstrings|abdominals, glutes, lower back|barbell|intermediate
Good Morning off Pins|hamstrings|abdominals, glutes, lower back|barbell|intermediate
Gorilla Chin/Crunch|abdominals|biceps, lats|body only|intermediate
Groin and Back Stretch|adductors||None|intermediate
Groiners|adductors||body only|intermediate
Hack Squat|quadriceps|calves, glutes, hamstrings|machine|beginner
Hammer Curls|biceps||dumbbell|beginner
Hammer Grip Incline DB Bench Press|chest|shoulders, triceps|dumbbell|beginner
Hamstring-SMR|hamstrings||foam roll|beginner
Hamstring Stretch|hamstrings||None|beginner
Handstand Push-Ups|shoulders|triceps|body only|expert
Hang Clean|quadriceps|calves, forearms, glutes, hamstrings, lower back, shoulders, traps|barbell|intermediate
Hang Clean - Below the Knees|quadriceps|calves, forearms, glutes, hamstrings, lower back, shoulders, traps|barbell|intermediate
Hang Snatch|hamstrings|abdominals, calves, forearms, glutes, lower back, quadriceps, shoulders, traps|barbell|expert
Hang Snatch - Below Knees|hamstrings|abdominals, calves, forearms, glutes, lower back, quadriceps, shoulders, traps|barbell|expert
Hanging Bar Good Morning|hamstrings|abdominals, glutes, lower back|barbell|intermediate
Hanging Leg Raise|abdominals||body only|expert
Hanging Pike|abdominals||body only|expert
Heaving Snatch Balance|quadriceps|abdominals, forearms, glutes, hamstrings, shoulders, triceps|barbell|intermediate
Heavy Bag Thrust|chest|abdominals, shoulders, triceps|other|beginner
High Cable Curls|biceps||cable|intermediate
Hip Circles (prone)|abductors|adductors|body only|beginner
Hip Extension with Bands|glutes|hamstrings|bands|beginner
Hip Flexion with Band|quadriceps||bands|beginner
Hip Lift with Band|glutes|calves, hamstrings|bands|beginner
Hug A Ball|lower back|calves, glutes|exercise ball|beginner
Hug Knees To Chest|lower back|glutes|None|beginner
Hurdle Hops|hamstrings|abductors, adductors, calves, glutes, hamstrings|other|beginner
Hyperextensions (Back Extensions)|lower back|glutes, hamstrings|other|beginner
Hyperextensions With No Hyperextension Bench|lower back|glutes, hamstrings|body only|intermediate
IT Band and Glute Stretch|abductors||other|intermediate
Iliotibial Tract-SMR|abductors||foam roll|intermediate
Inchworm|hamstrings||body only|beginner
Incline Barbell Triceps Extension|triceps|forearms|barbell|intermediate
Incline Bench Pull|middle back|lats, shoulders|barbell|beginner
Incline Cable Chest Press|chest|shoulders, triceps|cable|beginner
Incline Cable Flye|chest|shoulders|cable|intermediate
Incline Dumbbell Bench With Palms Facing In|chest|shoulders, triceps|dumbbell|beginner
Incline Dumbbell Curl|biceps||dumbbell|beginner
Incline Dumbbell Flyes|chest|shoulders|dumbbell|beginner
Incline Dumbbell Flyes - With A Twist|chest|shoulders|dumbbell|beginner
Incline Dumbbell Press|chest|shoulders, triceps|dumbbell|beginner
Incline Hammer Curls|biceps||dumbbell|beginner
Incline Inner Biceps Curl|biceps||dumbbell|beginner
Incline Push-Up|chest|shoulders, triceps|body only|beginner
Incline Push-Up Close-Grip|triceps|chest, shoulders|body only|beginner
Incline Push-Up Depth Jump|chest|shoulders, triceps|other|beginner
Incline Push-Up Medium|chest|abdominals, shoulders, triceps|body only|beginner
Incline Push-Up Reverse Grip|chest|abdominals, shoulders, triceps|body only|beginner
Incline Push-Up Wide|chest|abdominals, shoulders, triceps|body only|beginner
Intermediate Groin Stretch|hamstrings||other|intermediate
Intermediate Hip Flexor and Quad Stretch|quadriceps||other|intermediate
Internal Rotation with Band|shoulders||bands|beginner
Inverted Row|middle back|lats|None|beginner
Inverted Row with Straps|middle back|biceps, lats|other|beginner
Iron Cross|shoulders|chest, glutes, hamstrings, lower back, quadriceps, traps|dumbbell|intermediate
Iron Crosses (stretch)|quadriceps||None|intermediate
Isometric Chest Squeezes|chest|shoulders, triceps|body only|beginner
Isometric Neck Exercise - Front And Back|neck||body only|beginner
Isometric Neck Exercise - Sides|neck||body only|beginner
Isometric Wipers|chest|abdominals, shoulders, triceps|body only|beginner
JM Press|triceps|chest, shoulders|barbell|beginner
Jackknife Sit-Up|abdominals||body only|beginner
Janda Sit-Up|abdominals||body only|beginner
Jefferson Squats|quadriceps|calves, glutes, hamstrings, lower back, traps|barbell|intermediate
Jerk Balance|shoulders|glutes, hamstrings, quadriceps, triceps|barbell|intermediate
Jerk Dip Squat|quadriceps|abdominals, calves|barbell|intermediate
Jogging, Treadmill|quadriceps|glutes, hamstrings|machine|beginner
Keg Load|lower back|abdominals, biceps, calves, forearms, glutes, hamstrings, middle back, quadriceps, shoulders, traps|other|intermediate
Kettlebell Arnold Press|shoulders|triceps|kettlebells|intermediate
Kettlebell Dead Clean|hamstrings|calves, glutes, lower back, quadriceps, traps|kettlebells|intermediate
Kettlebell Figure 8|abdominals|hamstrings, shoulders|kettlebells|intermediate
Kettlebell Hang Clean|hamstrings|calves, glutes, lower back, shoulders, traps|kettlebells|intermediate
Kettlebell One-Legged Deadlift|hamstrings|glutes, lower back|kettlebells|intermediate
Kettlebell Pass Between The Legs|abdominals|glutes, hamstrings, shoulders|kettlebells|intermediate
Kettlebell Pirate Ships|shoulders|abdominals|kettlebells|beginner
Kettlebell Pistol Squat|quadriceps|calves, glutes, hamstrings, shoulders|kettlebells|expert
Kettlebell Seated Press|shoulders|triceps|kettlebells|intermediate
Kettlebell Seesaw Press|shoulders|triceps|kettlebells|intermediate
Kettlebell Sumo High Pull|traps|adductors, glutes, hamstrings, quadriceps, shoulders|kettlebells|intermediate
Kettlebell Thruster|shoulders|quadriceps, triceps|kettlebells|intermediate
Kettlebell Turkish Get-Up (Lunge style)|shoulders|abdominals, hamstrings, quadriceps, triceps|kettlebells|intermediate
Kettlebell Turkish Get-Up (Squat style)|shoulders|abdominals, calves, hamstrings, quadriceps, triceps|kettlebells|intermediate
Kettlebell Windmill|abdominals|glutes, hamstrings, shoulders, triceps|kettlebells|intermediate
Kipping Muscle Up|lats|abdominals, biceps, forearms, middle back, shoulders, traps, triceps|other|intermediate
Knee Across The Body|glutes|abductors, lower back|None|beginner
Knee Circles|calves|hamstrings, quadriceps|body only|beginner
Knee/Hip Raise On Parallel Bars|abdominals||other|beginner
Knee Tuck Jump|hamstrings|abductors, adductors, calves, glutes, quadriceps|body only|beginner
Kneeling Arm Drill|shoulders|abdominals|None|beginner
Kneeling Cable Crunch With Alternating Oblique Twists|abdominals||cable|beginner
Kneeling Cable Triceps Extension|triceps||cable|intermediate
Kneeling Forearm Stretch|forearms||None|beginner
Kneeling High Pulley Row|lats|biceps, middle back|cable|beginner
Kneeling Hip Flexor|quadriceps|quadriceps|None|beginner
Kneeling Jump Squat|glutes|calves, hamstrings, quadriceps|barbell|expert
Kneeling Single-Arm High Pulley Row|lats|biceps, middle back|cable|beginner
Kneeling Squat|glutes|abdominals, hamstrings, lower back|barbell|intermediate
Landmine 180's|abdominals|glutes, lower back, shoulders|barbell|beginner
Landmine Linear Jammer|shoulders|abdominals, calves, chest, hamstrings, quadriceps, triceps|barbell|intermediate
Lateral Bound|adductors|abductors, calves, glutes, hamstrings, quadriceps|body only|beginner
Lateral Box Jump|adductors|abductors, calves, glutes, hamstrings, quadriceps|other|beginner
Lateral Cone Hops|adductors|abductors, calves, glutes, hamstrings, quadriceps|other|beginner
Lateral Raise - With Bands|shoulders||bands|beginner
Latissimus Dorsi-SMR|lats||foam roll|beginner
Leg-Over Floor Press|chest|shoulders, triceps|kettlebells|intermediate
Leg-Up Hamstring Stretch|hamstrings||None|beginner
Leg Extensions|quadriceps||machine|beginner
Leg Lift|glutes|hamstrings|body only|beginner
Leg Press|quadriceps|calves, glutes, hamstrings|machine|beginner
Leg Pull-In|abdominals||body only|beginner
Leverage Chest Press|chest|shoulders, triceps|machine|beginner
Leverage Deadlift|quadriceps|glutes, hamstrings|machine|beginner
Leverage Decline Chest Press|chest|shoulders, triceps|machine|beginner
Leverage High Row|middle back|lats|machine|beginner
Leverage Incline Chest Press|chest|shoulders, triceps|machine|beginner
Leverage Iso Row|lats|biceps, middle back|machine|beginner
Leverage Shoulder Press|shoulders|triceps|machine|beginner
Leverage Shrug|traps|forearms|machine|beginner
Linear 3-Part Start Technique|hamstrings|calves, quadriceps|None|beginner
Linear Acceleration Wall Drill|hamstrings|calves, glutes, quadriceps|None|beginner
Linear Depth Jump|quadriceps|calves, glutes, hamstrings|other|intermediate
Log Lift|shoulders|abdominals, chest, glutes, hamstrings, lower back, middle back, quadriceps, traps, triceps|other|intermediate
London Bridges|lats|biceps, forearms, middle back|other|intermediate
Looking At Ceiling|quadriceps||None|beginner
Low Cable Crossover|chest|shoulders|cable|beginner
Low Cable Triceps Extension|triceps||cable|beginner
Low Pulley Row To Neck|shoulders|biceps, middle back, traps|cable|beginner
Lower Back-SMR|lower back||foam roll|beginner
Lower Back Curl|abdominals||body only|beginner
Lunge Pass Through|hamstrings|calves, glutes, quadriceps|kettlebells|intermediate
Lunge Sprint|quadriceps|calves, glutes, hamstrings|machine|intermediate
Lying Bent Leg Groin|adductors||other|expert
Lying Cable Curl|biceps||cable|intermediate
Lying Cambered Barbell Row|middle back|biceps, lats, traps|barbell|beginner
Lying Close-Grip Bar Curl On High Pulley|biceps||cable|beginner
Lying Close-Grip Barbell Triceps Extension Behind The Head|triceps||barbell|intermediate
Lying Close-Grip Barbell Triceps Press To Chin|triceps||e-z curl bar|intermediate
Lying Crossover|abductors||body only|expert
Lying Dumbbell Tricep Extension|triceps|chest, shoulders|dumbbell|intermediate
Lying Face Down Plate Neck Resistance|neck||other|intermediate
Lying Face Up Plate Neck Resistance|neck||other|intermediate
Lying Glute|glutes|abductors|body only|expert
Lying Hamstring|hamstrings|calves|other|expert
Lying High Bench Barbell Curl|biceps||barbell|intermediate
Lying Leg Curls|hamstrings||machine|beginner
Lying Machine Squat|quadriceps|calves, glutes, hamstrings|machine|intermediate
Lying One-Arm Lateral Raise|shoulders||dumbbell|intermediate
Lying Prone Quadriceps|quadriceps||body only|expert
Lying Rear Delt Raise|shoulders||dumbbell|intermediate
Lying Supine Dumbbell Curl|biceps||dumbbell|beginner
Lying T-Bar Row|middle back|biceps, lats|machine|intermediate
Lying Triceps Press|triceps||e-z curl bar|intermediate
Machine Bench Press|chest|shoulders, triceps|machine|beginner
Machine Bicep Curl|biceps||machine|beginner
Machine Preacher Curls|biceps||machine|beginner
Machine Shoulder (Military) Press|shoulders|triceps|machine|beginner
Machine Triceps Extension|triceps||machine|beginner
Medicine Ball Chest Pass|chest|shoulders, triceps|medicine ball|beginner
Medicine Ball Full Twist|abdominals|shoulders|medicine ball|beginner
Medicine Ball Scoop Throw|shoulders|abdominals, hamstrings, quadriceps|medicine ball|beginner
Middle Back Shrug|middle back||dumbbell|intermediate
Middle Back Stretch|middle back|abdominals, lats, lower back|None|beginner
Mixed Grip Chin|middle back|biceps, lats|other|expert
Monster Walk|abductors||bands|beginner
Mountain Climbers|quadriceps|chest, hamstrings, shoulders|None|beginner
Moving Claw Series|hamstrings|calves, quadriceps|None|beginner
Muscle Snatch|hamstrings|glutes, lower back, quadriceps, shoulders, triceps|barbell|intermediate
Muscle Up|lats|abdominals, biceps, forearms, middle back, shoulders, traps, triceps|other|intermediate
Narrow Stance Hack Squats|quadriceps|calves, glutes, hamstrings|machine|intermediate
Narrow Stance Leg Press|quadriceps|calves, glutes, hamstrings|machine|intermediate
Narrow Stance Squats|quadriceps|calves, glutes, hamstrings, lower back|barbell|intermediate
Natural Glute Ham Raise|hamstrings|calves, glutes, lower back|body only|intermediate
Neck-SMR|neck||other|intermediate
Neck Press|chest|shoulders, triceps|barbell|intermediate
Oblique Crunches|abdominals||body only|beginner
Oblique Crunches - On The Floor|abdominals||body only|beginner
Olympic Squat|quadriceps|calves, glutes, hamstrings|barbell|intermediate
On-Your-Back Quad Stretch|quadriceps||other|beginner
On Your Side Quad Stretch|quadriceps||None|beginner
One-Arm Dumbbell Row|middle back|biceps, lats, shoulders|dumbbell|beginner
One-Arm Flat Bench Dumbbell Flye|chest||dumbbell|beginner
One-Arm High-Pulley Cable Side Bends|abdominals||cable|beginner
One-Arm Incline Lateral Raise|shoulders||dumbbell|beginner
One-Arm Kettlebell Clean|hamstrings|glutes, lower back, shoulders, traps|kettlebells|intermediate
One-Arm Kettlebell Clean and Jerk|shoulders||kettlebells|intermediate
One-Arm Kettlebell Floor Press|chest|triceps|kettlebells|intermediate
One-Arm Kettlebell Jerk|shoulders|calves, quadriceps, triceps|kettlebells|intermediate
One-Arm Kettlebell Military Press To The Side|shoulders|triceps|kettlebells|intermediate
One-Arm Kettlebell Para Press|shoulders|triceps|kettlebells|intermediate
One-Arm Kettlebell Push Press|shoulders|calves, quadriceps, triceps|kettlebells|intermediate
One-Arm Kettlebell Row|middle back|biceps, lats|kettlebells|intermediate
One-Arm Kettlebell Snatch|shoulders|calves, glutes, hamstrings, lower back, traps, triceps|kettlebells|expert
One-Arm Kettlebell Split Jerk|shoulders|glutes, hamstrings, quadriceps, triceps|kettlebells|intermediate
One-Arm Kettlebell Split Snatch|shoulders|hamstrings, quadriceps|kettlebells|expert
One-Arm Kettlebell Swings|hamstrings|calves, glutes, lower back, shoulders|kettlebells|intermediate
One-Arm Long Bar Row|middle back|biceps, lats|barbell|beginner
One-Arm Medicine Ball Slam|abdominals|lats, shoulders|medicine ball|beginner
One-Arm Open Palm Kettlebell Clean|hamstrings|forearms, glutes, lower back, quadriceps, shoulders|kettlebells|intermediate
One-Arm Overhead Kettlebell Squats|quadriceps|calves, glutes, hamstrings, shoulders|kettlebells|expert
One-Arm Side Deadlift|quadriceps|abdominals, calves, glutes, hamstrings, lower back, traps|barbell|expert
One-Arm Side Laterals|shoulders||dumbbell|beginner
One-Legged Cable Kickback|glutes|hamstrings|cable|intermediate
One Arm Against Wall|lats||None|beginner
One Arm Chin-Up|middle back|biceps, forearms, lats|other|expert
One Arm Dumbbell Bench Press|chest|shoulders, triceps|dumbbell|beginner
One Arm Dumbbell Preacher Curl|biceps||dumbbell|beginner
One Arm Floor Press|triceps|chest, shoulders|barbell|intermediate
One Arm Lat Pulldown|lats|biceps, middle back|cable|beginner
One Arm Pronated Dumbbell Triceps Extension|triceps||dumbbell|beginner
One Arm Supinated Dumbbell Triceps Extension|triceps||dumbbell|beginner
One Half Locust|quadriceps|abdominals, biceps, chest|None|beginner
One Handed Hang|lats|biceps|other|beginner
One Knee To Chest|glutes|hamstrings, lower back|None|beginner
One Leg Barbell Squat|quadriceps|calves, glutes, hamstrings|barbell|expert
Open Palm Kettlebell Clean|hamstrings|glutes, lower back, quadriceps, shoulders|kettlebells|expert
Otis-Up|abdominals|chest, shoulders, triceps|other|beginner
Overhead Cable Curl|biceps||cable|intermediate
Overhead Lat|lats|triceps|other|expert
Overhead Slam|lats||medicine ball|beginner
Overhead Squat|quadriceps|abdominals, calves, glutes, hamstrings, lower back, shoulders, triceps|barbell|expert
Overhead Stretch|abdominals|chest, forearms, lats, triceps|None|beginner
Overhead Triceps|triceps|lats|body only|expert
Pallof Press|abdominals|chest, shoulders, triceps|cable|beginner
Pallof Press With Rotation|abdominals|chest, shoulders, triceps|cable|beginner
Palms-Down Dumbbell Wrist Curl Over A Bench|forearms||dumbbell|beginner
Palms-Down Wrist Curl Over A Bench|forearms||barbell|beginner
Palms-Up Barbell Wrist Curl Over A Bench|forearms||barbell|beginner
Palms-Up Dumbbell Wrist Curl Over A Bench|forearms||dumbbell|beginner
Parallel Bar Dip|triceps|chest, shoulders|other|beginner
Pelvic Tilt Into Bridge|lower back||None|intermediate
Peroneals-SMR|calves||foam roll|intermediate
Peroneals Stretch|calves||other|intermediate
Physioball Hip Bridge|glutes|hamstrings|exercise ball|beginner
Pin Presses|triceps|chest, forearms, lats, middle back, shoulders|barbell|intermediate
Piriformis-SMR|glutes||foam roll|intermediate
Plank|abdominals||body only|beginner
Plate Pinch|forearms||other|intermediate
Plate Twist|abdominals||other|intermediate
Platform Hamstring Slides|hamstrings|glutes|other|beginner
Plie Dumbbell Squat|quadriceps|abdominals, calves, glutes, hamstrings|dumbbell|beginner
Plyo Kettlebell Pushups|chest|shoulders, triceps|kettlebells|expert
Plyo Push-up|chest|shoulders, triceps|body only|beginner
Posterior Tibialis Stretch|calves||other|intermediate
Power Clean|hamstrings|calves, forearms, glutes, lower back, middle back, quadriceps, shoulders, traps, triceps|barbell|intermediate
Power Clean from Blocks|hamstrings|quadriceps|barbell|intermediate
Power Jerk|quadriceps|abdominals, calves, glutes, hamstrings, shoulders, triceps|barbell|expert
Power Partials|shoulders||dumbbell|beginner
Power Snatch|hamstrings|calves, glutes, lower back, quadriceps, shoulders, traps, triceps|barbell|expert
Power Snatch from Blocks|quadriceps|calves, forearms, glutes, hamstrings, lower back, shoulders, traps, triceps|barbell|intermediate
Power Stairs|hamstrings|adductors, calves, glutes, lower back, quadriceps, shoulders, traps|other|intermediate
Preacher Curl|biceps||barbell|beginner
Preacher Hammer Dumbbell Curl|biceps|forearms|dumbbell|beginner
Press Sit-Up|abdominals|chest, shoulders, triceps|barbell|expert
Prone Manual Hamstring|hamstrings||None|beginner
Prowler Sprint|hamstrings|calves, chest, glutes, quadriceps, shoulders|other|beginner
Pull Through|glutes|hamstrings, lower back|cable|beginner
Pullups|lats|biceps, middle back|body only|beginner
Push-Up Wide|chest|abdominals, shoulders, triceps|body only|beginner
Push-Ups - Close Triceps Position|triceps|chest, shoulders|body only|intermediate
Push-Ups With Feet Elevated|chest|shoulders, triceps|body only|beginner
Push-Ups With Feet On An Exercise Ball|chest|shoulders, triceps|exercise ball|intermediate
Push Press|shoulders|quadriceps, triceps|barbell|expert
Push Press - Behind the Neck|shoulders|calves, quadriceps, triceps|barbell|intermediate
Push Up to Side Plank|chest|abdominals, shoulders, triceps|body only|beginner
Pushups|chest|shoulders, triceps|body only|beginner
Pushups (Close and Wide Hand Positions)|chest|shoulders, triceps|body only|beginner
Pyramid|lower back|shoulders|exercise ball|beginner
Quad Stretch|quadriceps||other|intermediate
Quadriceps-SMR|quadriceps||foam roll|intermediate
Quick Leap|quadriceps|calves, hamstrings|other|beginner
Rack Delivery|shoulders|forearms, traps|barbell|intermediate
Rack Pull with Bands|lower back|forearms, glutes, hamstrings, quadriceps, traps|barbell|intermediate
Rack Pulls|lower back|forearms, glutes, hamstrings, traps|barbell|intermediate
Rear Leg Raises|quadriceps||body only|beginner
Recumbent Bike|quadriceps|calves, glutes, hamstrings|machine|beginner
Return Push from Stance|shoulders|chest, triceps|medicine ball|beginner
Reverse Band Bench Press|triceps|chest, forearms, lats, middle back, shoulders|barbell|intermediate
Reverse Band Box Squat|quadriceps|abductors, adductors, calves, forearms, glutes, hamstrings, lower back|barbell|intermediate
Reverse Band Deadlift|lower back|abductors, adductors, calves, glutes, hamstrings, quadriceps|barbell|expert
Reverse Band Power Squat|quadriceps|adductors, calves, glutes, hamstrings, lower back|barbell|expert
Reverse Band Sumo Deadlift|hamstrings|abductors, adductors, calves, forearms, glutes, lower back, quadriceps, traps|barbell|expert
Reverse Barbell Curl|biceps|forearms|barbell|beginner
Reverse Barbell Preacher Curls|biceps|forearms|e-z curl bar|intermediate
Reverse Cable Curl|biceps|forearms|cable|beginner
Reverse Crunch|abdominals||body only|beginner
Reverse Flyes|shoulders||dumbbell|beginner
Reverse Flyes With External Rotation|shoulders||dumbbell|intermediate
Reverse Grip Bent-Over Rows|middle back|biceps, lats, shoulders|barbell|intermediate
Reverse Grip Triceps Pushdown|triceps||cable|beginner
Reverse Hyperextension|hamstrings|calves, glutes|machine|intermediate
Reverse Machine Flyes|shoulders||machine|beginner
Reverse Plate Curls|biceps|forearms|other|beginner
Reverse Triceps Bench Press|triceps|chest, shoulders|barbell|intermediate
Rhomboids-SMR|middle back|traps|foam roll|intermediate
Rickshaw Carry|forearms|abdominals, calves, glutes, hamstrings, lower back, quadriceps, traps|other|intermediate
Rickshaw Deadlift|quadriceps|forearms, glutes, hamstrings, lower back, traps|other|intermediate
Ring Dips|triceps|chest, shoulders|other|intermediate
Rocket Jump|quadriceps|calves, hamstrings|body only|beginner
Rocking Standing Calf Raise|calves||barbell|beginner
Rocky Pull-Ups/Pulldowns|lats|biceps, middle back, shoulders|other|intermediate
Romanian Deadlift|hamstrings|calves, glutes, lower back|barbell|intermediate
Romanian Deadlift from Deficit|hamstrings|forearms, glutes, lower back, traps|barbell|intermediate
Rope Climb|lats|biceps, forearms, middle back, shoulders|other|intermediate
Rope Crunch|abdominals||cable|beginner
Rope Jumping|quadriceps|calves, hamstrings|other|intermediate
Rope Straight-Arm Pulldown|lats||cable|beginner
Round The World Shoulder Stretch|shoulders|biceps, chest|other|beginner
Rowing, Stationary|quadriceps|biceps, calves, glutes, hamstrings, lower back, middle back|machine|intermediate
Runner's Stretch|hamstrings|calves|None|beginner
Running, Treadmill|quadriceps|calves, glutes, hamstrings|machine|beginner
Russian Twist|abdominals|lower back|body only|intermediate
Sandbag Load|quadriceps|abdominals, biceps, calves, forearms, glutes, hamstrings, lower back, middle back, shoulders, traps|other|beginner
Scapular Pull-Up|traps|lats, middle back|None|beginner
Scissor Kick|abdominals||body only|beginner
Scissors Jump|quadriceps|glutes, hamstrings|body only|beginner
Seated Band Hamstring Curl|hamstrings||other|beginner
Seated Barbell Military Press|shoulders|triceps|barbell|intermediate
Seated Barbell Twist|abdominals||barbell|beginner
Seated Bent-Over One-Arm Dumbbell Triceps Extension|triceps||dumbbell|beginner
Seated Bent-Over Rear Delt Raise|shoulders||dumbbell|intermediate
Seated Bent-Over Two-Arm Dumbbell Triceps Extension|triceps||dumbbell|intermediate
Seated Biceps|biceps|chest, shoulders|body only|expert
Seated Cable Rows|middle back|biceps, lats, shoulders|cable|beginner
Seated Cable Shoulder Press|shoulders|triceps|cable|beginner
Seated Calf Raise|calves||machine|beginner
Seated Calf Stretch|calves|hamstrings, lower back|None|beginner
Seated Close-Grip Concentration Barbell Curl|biceps||barbell|intermediate
Seated Dumbbell Curl|biceps||dumbbell|beginner
Seated Dumbbell Inner Biceps Curl|biceps||dumbbell|beginner
Seated Dumbbell Palms-Down Wrist Curl|forearms||dumbbell|beginner
Seated Dumbbell Palms-Up Wrist Curl|forearms||dumbbell|beginner
Seated Dumbbell Press|shoulders|triceps|dumbbell|beginner
Seated Flat Bench Leg Pull-In|abdominals||body only|beginner
Seated Floor Hamstring Stretch|hamstrings|calves|None|beginner
Seated Front Deltoid|shoulders|chest|body only|expert
Seated Glute|glutes|adductors|body only|expert
Seated Good Mornings|lower back|glutes|barbell|intermediate
Seated Hamstring|hamstrings|calves|None|expert
Seated Hamstring and Calf Stretch|hamstrings|calves|other|intermediate
Seated Head Harness Neck Resistance|neck||other|intermediate
Seated Leg Curl|hamstrings||machine|beginner
Seated Leg Tucks|abdominals||body only|beginner
Seated One-Arm Dumbbell Palms-Down Wrist Curl|forearms||dumbbell|intermediate
Seated One-Arm Dumbbell Palms-Up Wrist Curl|forearms||dumbbell|beginner
Seated One-arm Cable Pulley Rows|middle back|biceps, lats, traps|cable|intermediate
Seated Overhead Stretch|abdominals||None|beginner
Seated Palm-Up Barbell Wrist Curl|forearms||barbell|beginner
Seated Palms-Down Barbell Wrist Curl|forearms||barbell|beginner
Seated Side Lateral Raise|shoulders||dumbbell|beginner
Seated Triceps Press|triceps||dumbbell|beginner
Seated Two-Arm Palms-Up Low-Pulley Wrist Curl|forearms||cable|beginner
See-Saw Press (Alternating Side Press)|shoulders|abdominals, triceps|dumbbell|intermediate
Shotgun Row|lats|biceps, middle back|cable|beginner
Shoulder Circles|shoulders|traps|None|beginner
Shoulder Press - With Bands|shoulders|triceps|bands|beginner
Shoulder Raise|shoulders|lats|None|beginner
Shoulder Stretch|shoulders||None|beginner
Side-Lying Floor Stretch|lats||None|beginner
Side Bridge|abdominals|shoulders|body only|beginner
Side Hop-Sprint|quadriceps|abductors, adductors, calves, hamstrings|other|beginner
Side Jackknife|abdominals||body only|beginner
Side Lateral Raise|shoulders||dumbbell|beginner
Side Laterals to Front Raise|shoulders|traps|dumbbell|beginner
Side Leg Raises|adductors||body only|beginner
Side Lying Groin Stretch|adductors|hamstrings|None|beginner
Side Neck Stretch|neck||None|beginner
Side Standing Long Jump|quadriceps|calves, glutes, hamstrings|None|beginner
Side To Side Chins|lats|biceps, forearms, middle back, shoulders|other|intermediate
Side Wrist Pull|shoulders|forearms, lats|None|beginner
Side to Side Box Shuffle|quadriceps|abductors, adductors, calves, hamstrings|other|beginner
Single-Arm Cable Crossover|chest||cable|beginner
Single-Arm Linear Jammer|shoulders|chest, triceps|barbell|intermediate
Single-Arm Push-Up|chest|shoulders, triceps|body only|intermediate
Single-Cone Sprint Drill|quadriceps|calves, glutes, hamstrings|other|beginner
Single-Leg High Box Squat|quadriceps|glutes, hamstrings|other|beginner
Single-Leg Hop Progression|quadriceps|abductors, adductors, calves, hamstrings|other|beginner
Single-Leg Lateral Hop|quadriceps|abductors, adductors, calves, hamstrings|other|beginner
Single-Leg Leg Extension|quadriceps||machine|beginner
Single-Leg Stride Jump|quadriceps|abductors, adductors, calves, hamstrings|other|beginner
Single Dumbbell Raise|shoulders|forearms, traps|dumbbell|beginner
Single Leg Butt Kick|quadriceps|calves, hamstrings|body only|beginner
Single Leg Glute Bridge|glutes|hamstrings|body only|beginner
Single Leg Push-off|quadriceps|calves, hamstrings|other|beginner
Sit-Up|abdominals||body only|beginner
Sit Squats|quadriceps|abductors, glutes, hamstrings|None|beginner
Skating|quadriceps|abductors, adductors, calves, glutes, hamstrings|other|intermediate
Sled Drag - Harness|quadriceps|calves, glutes, hamstrings|other|beginner
Sled Overhead Backward Walk|shoulders|calves, middle back, quadriceps|other|beginner
Sled Overhead Triceps Extension|triceps||other|beginner
Sled Push|quadriceps|calves, chest, glutes, hamstrings, triceps|other|beginner
Sled Reverse Flye|shoulders||other|beginner
Sled Row|middle back|biceps, lats|other|beginner
Sledgehammer Swings|abdominals|calves, forearms, lats, middle back, shoulders|other|beginner
Smith Incline Shoulder Raise|shoulders|chest|barbell|beginner
Smith Machine Behind the Back Shrug|traps|shoulders|machine|beginner
Smith Machine Bench Press|chest|shoulders, triceps|machine|beginner
Smith Machine Bent Over Row|middle back|biceps, lats, shoulders|machine|beginner
Smith Machine Calf Raise|calves||machine|beginner
Smith Machine Close-Grip Bench Press|triceps|chest, shoulders|machine|beginner
Smith Machine Decline Press|chest|shoulders, triceps|machine|beginner
Smith Machine Hang Power Clean|hamstrings|glutes, lower back, quadriceps, shoulders, traps|machine|intermediate
Smith Machine Hip Raise|abdominals||machine|beginner
Smith Machine Incline Bench Press|chest|shoulders, triceps|machine|beginner
Smith Machine Leg Press|quadriceps|calves, glutes, hamstrings|machine|intermediate
Smith Machine One-Arm Upright Row|shoulders|biceps, traps|machine|beginner
Smith Machine Overhead Shoulder Press|shoulders|triceps|machine|beginner
Smith Machine Pistol Squat|quadriceps|calves, glutes, hamstrings|machine|intermediate
Smith Machine Reverse Calf Raises|calves||machine|beginner
Smith Machine Squat|quadriceps|calves, glutes, hamstrings, lower back|machine|beginner
Smith Machine Stiff-Legged Deadlift|hamstrings|glutes, lower back|machine|beginner
Smith Machine Upright Row|traps|biceps, middle back, shoulders|machine|beginner
Smith Single-Leg Split Squat|quadriceps|calves, glutes, hamstrings|machine|beginner
Snatch|quadriceps|biceps, glutes, hamstrings, lower back, shoulders, traps, triceps|barbell|intermediate
Snatch Balance|quadriceps|calves, glutes, hamstrings, shoulders, triceps|barbell|intermediate
Snatch Deadlift|hamstrings|forearms, glutes, hamstrings, lower back, quadriceps, traps|barbell|intermediate
Snatch Pull|hamstrings|calves, glutes, lower back, quadriceps, traps|barbell|intermediate
Snatch Shrug|traps|forearms, shoulders|barbell|intermediate
Snatch from Blocks|quadriceps|calves, forearms, glutes, hamstrings, lower back, shoulders, traps, triceps|barbell|expert
Speed Band Overhead Triceps|triceps||bands|beginner
Speed Box Squat|quadriceps|calves, glutes, hamstrings|barbell|intermediate
Speed Squats|quadriceps|calves, glutes, hamstrings, lower back|barbell|expert
Spell Caster|abdominals|glutes, shoulders|dumbbell|beginner
Spider Crawl|abdominals|chest, shoulders, triceps|body only|beginner
Spider Curl|biceps||e-z curl bar|beginner
Spinal Stretch|middle back|lats, lower back, neck, traps|None|beginner
Split Clean|quadriceps|calves, forearms, glutes, hamstrings, lower back, shoulders, traps|barbell|intermediate
Split Jerk|quadriceps|glutes, hamstrings, shoulders, triceps|barbell|intermediate
Split Jump|quadriceps|calves, glutes, hamstrings|body only|beginner
Split Snatch|hamstrings|calves, forearms, glutes, hamstrings, lower back, quadriceps, shoulders, traps, triceps|barbell|expert
Split Squat with Dumbbells|quadriceps|glutes, hamstrings|dumbbell|beginner
Split Squats|hamstrings|calves, glutes, quadriceps|None|intermediate
Squat Jerk|quadriceps|calves, glutes, hamstrings, shoulders, triceps|barbell|expert
Squat with Bands|quadriceps|adductors, calves, glutes, hamstrings, lower back|barbell|intermediate
Squat with Chains|quadriceps|adductors, calves, glutes, hamstrings, lower back|barbell|intermediate
Squat with Plate Movers|quadriceps|abductors, adductors, calves, glutes, hamstrings|barbell|intermediate
Squats - With Bands|quadriceps|calves, glutes, hamstrings, lower back|bands|beginner
Stairmaster|quadriceps|calves, glutes, hamstrings|machine|intermediate
Standing Alternating Dumbbell Press|shoulders|triceps|dumbbell|beginner
Standing Barbell Calf Raise|calves||barbell|beginner
Standing Barbell Press Behind Neck|shoulders|triceps|barbell|intermediate
Standing Bent-Over One-Arm Dumbbell Triceps Extension|triceps|shoulders|dumbbell|beginner
Standing Bent-Over Two-Arm Dumbbell Triceps Extension|triceps||dumbbell|beginner
Standing Biceps Cable Curl|biceps||cable|beginner
Standing Biceps Stretch|biceps|chest, shoulders|other|beginner
Standing Bradford Press|shoulders|triceps|barbell|beginner
Standing Cable Chest Press|chest|shoulders, triceps|cable|beginner
Standing Cable Lift|abdominals|shoulders|cable|beginner
Standing Cable Wood Chop|abdominals|shoulders|cable|beginner
Standing Calf Raises|calves||machine|beginner
Standing Concentration Curl|biceps|forearms|dumbbell|beginner
Standing Dumbbell Calf Raise|calves||dumbbell|intermediate
Standing Dumbbell Press|shoulders|triceps|dumbbell|beginner
Standing Dumbbell Reverse Curl|biceps|forearms|dumbbell|intermediate
Standing Dumbbell Straight-Arm Front Delt Raise Above Head|shoulders||dumbbell|intermediate
Standing Dumbbell Triceps Extension|triceps||dumbbell|beginner
Standing Dumbbell Upright Row|traps|biceps, shoulders|dumbbell|beginner
Standing Elevated Quad Stretch|quadriceps||other|beginner
Standing Front Barbell Raise Over Head|shoulders||barbell|intermediate
Standing Gastrocnemius Calf Stretch|calves|hamstrings|None|beginner
Standing Hamstring and Calf Stretch|hamstrings||other|beginner
Standing Hip Circles|abductors|adductors|body only|beginner
Standing Hip Flexors|quadriceps||None|beginner
Standing Inner-Biceps Curl|biceps||dumbbell|intermediate
Standing Lateral Stretch|abdominals||None|beginner
Standing Leg Curl|hamstrings||machine|beginner
Standing Long Jump|quadriceps|calves, glutes, hamstrings|body only|beginner
Standing Low-Pulley Deltoid Raise|shoulders|forearms|cable|beginner
Standing Low-Pulley One-Arm Triceps Extension|triceps|chest, shoulders|cable|intermediate
Standing Military Press|shoulders|triceps|barbell|beginner
Standing Olympic Plate Hand Squeeze|forearms|biceps|other|beginner
Standing One-Arm Cable Curl|biceps||cable|intermediate
Standing One-Arm Dumbbell Curl Over Incline Bench|biceps||dumbbell|beginner
Standing One-Arm Dumbbell Triceps Extension|triceps|chest, shoulders|dumbbell|beginner
Standing Overhead Barbell Triceps Extension|triceps|shoulders|barbell|beginner
Standing Palm-In One-Arm Dumbbell Press|shoulders|triceps|dumbbell|beginner
Standing Palms-In Dumbbell Press|shoulders|triceps|dumbbell|intermediate
Standing Palms-Up Barbell Behind The Back Wrist Curl|forearms||barbell|beginner
Standing Pelvic Tilt|lower back|glutes|None|beginner
Standing Rope Crunch|abdominals||cable|beginner
Standing Soleus And Achilles Stretch|calves||None|beginner
Standing Toe Touches|hamstrings|calves|None|beginner
Standing Towel Triceps Extension|triceps||body only|beginner
Standing Two-Arm Overhead Throw|shoulders|chest, lats|medicine ball|beginner
Star Jump|quadriceps|calves, glutes, hamstrings, shoulders|body only|beginner
Step-up with Knee Raise|glutes|hamstrings, quadriceps|body only|beginner
Step Mill|quadriceps|calves, glutes, hamstrings|machine|intermediate
Stiff-Legged Barbell Deadlift|hamstrings|glutes, lower back|barbell|intermediate
Stiff-Legged Dumbbell Deadlift|hamstrings|glutes, lower back|dumbbell|beginner
Stiff Leg Barbell Good Morning|lower back|glutes, hamstrings|barbell|beginner
Stomach Vacuum|abdominals||body only|beginner
Straight-Arm Dumbbell Pullover|chest|lats, shoulders, triceps|dumbbell|intermediate
Straight-Arm Pulldown|lats||cable|beginner
Straight Bar Bench Mid Rows|middle back|biceps, lats|barbell|beginner
Straight Raises on Incline Bench|shoulders|traps|barbell|beginner
Stride Jump Crossover|quadriceps|abductors, adductors, calves, hamstrings|other|beginner
Sumo Deadlift|hamstrings|adductors, forearms, glutes, lower back, middle back, quadriceps, traps|barbell|intermediate
Sumo Deadlift with Bands|hamstrings|adductors, forearms, glutes, lower back, middle back, quadriceps, traps|barbell|intermediate
Sumo Deadlift with Chains|hamstrings|abductors, adductors, forearms, glutes, lower back, middle back, quadriceps, traps|barbell|intermediate
Superman|lower back|glutes, hamstrings|body only|beginner
Supine Chest Throw|triceps|chest, shoulders|medicine ball|beginner
Supine One-Arm Overhead Throw|abdominals|chest, lats, shoulders|medicine ball|beginner
Supine Two-Arm Overhead Throw|abdominals|chest, lats, shoulders|medicine ball|beginner
Suspended Fallout|abdominals|chest, lower back, shoulders|other|intermediate
Suspended Push-Up|chest|shoulders, triceps|other|beginner
Suspended Reverse Crunch|abdominals||other|beginner
Suspended Row|middle back|biceps, lats|other|beginner
Suspended Split Squat|quadriceps|abductors, adductors, calves, glutes, hamstrings|other|intermediate
Svend Press|chest|forearms, shoulders, triceps|other|beginner
T-Bar Row with Handle|middle back|biceps, lats|barbell|beginner
Tate Press|triceps|chest, shoulders|dumbbell|intermediate
The Straddle|hamstrings|adductors, calves|None|beginner
Thigh Abductor|abductors|glutes|machine|beginner
Thigh Adductor|adductors|glutes, hamstrings|machine|beginner
Tire Flip|quadriceps|calves, chest, forearms, glutes, hamstrings, lower back, shoulders, traps, triceps|other|intermediate
Toe Touchers|abdominals||body only|beginner
Torso Rotation|abdominals||exercise ball|beginner
Trail Running/Walking|quadriceps|calves, glutes, hamstrings|None|beginner
Trap Bar Deadlift|quadriceps|glutes, hamstrings|other|beginner
Tricep Dumbbell Kickback|triceps||dumbbell|beginner
Tricep Side Stretch|triceps|shoulders|None|beginner
Triceps Overhead Extension with Rope|triceps||cable|beginner
Triceps Pushdown|triceps||cable|beginner
Triceps Pushdown - Rope Attachment|triceps||cable|beginner
Triceps Pushdown - V-Bar Attachment|triceps||cable|beginner
Triceps Stretch|triceps|lats|None|beginner
Tuck Crunch|abdominals||body only|beginner
Two-Arm Dumbbell Preacher Curl|biceps||dumbbell|beginner
Two-Arm Kettlebell Clean|shoulders|calves, glutes, hamstrings, lower back, traps|kettlebells|intermediate
Two-Arm Kettlebell Jerk|shoulders|calves, quadriceps, triceps|kettlebells|intermediate
Two-Arm Kettlebell Military Press|shoulders|triceps|kettlebells|intermediate
Two-Arm Kettlebell Row|middle back|biceps, lats|kettlebells|intermediate
Underhand Cable Pulldowns|lats|biceps, middle back, shoulders|cable|beginner
Upper Back-Leg Grab|hamstrings|lower back, middle back|None|beginner
Upper Back Stretch|middle back|middle back|None|beginner
Upright Barbell Row|shoulders|traps|barbell|beginner
Upright Cable Row|traps|shoulders|cable|intermediate
Upright Row - With Bands|traps|shoulders|bands|beginner
Upward Stretch|shoulders|chest, lats|None|beginner
V-Bar Pulldown|lats|biceps, middle back, shoulders|cable|intermediate
V-Bar Pullup|lats|biceps, middle back, shoulders|body only|beginner
Vertical Swing|hamstrings|glutes, quadriceps, shoulders|dumbbell|beginner
Walking, Treadmill|quadriceps|calves, glutes, hamstrings|machine|beginner
Weighted Ball Hyperextension|lower back|glutes, hamstrings, middle back|exercise ball|intermediate
Weighted Ball Side Bend|abdominals||exercise ball|intermediate
Weighted Bench Dip|triceps|chest, shoulders|other|intermediate
Weighted Crunches|abdominals||medicine ball|beginner
Weighted Jump Squat|quadriceps|calves, glutes, hamstrings, lower back|barbell|intermediate
Weighted Pull Ups|lats|biceps, middle back|other|intermediate
Weighted Sissy Squat|quadriceps|calves, glutes, hamstrings|barbell|expert
Weighted Sit-Ups - With Bands|abdominals||other|intermediate
Weighted Squat|quadriceps|calves, glutes, hamstrings|other|intermediate
Wide-Grip Barbell Bench Press|chest|shoulders, triceps|barbell|intermediate
Wide-Grip Decline Barbell Bench Press|chest|shoulders, triceps|barbell|intermediate
Wide-Grip Decline Barbell Pullover|chest|shoulders, triceps|barbell|intermediate
Wide-Grip Lat Pulldown|lats|biceps, middle back, shoulders|cable|beginner
Wide-Grip Pulldown Behind The Neck|lats|biceps, middle back, shoulders|cable|intermediate
Wide-Grip Rear Pull-Up|lats|biceps, middle back, shoulders|body only|intermediate
Wide-Grip Standing Barbell Curl|biceps||barbell|beginner
Wide Stance Barbell Squat|quadriceps|calves, glutes, hamstrings, lower back|barbell|intermediate
Wide Stance Stiff Legs|hamstrings|adductors, glutes, lower back|barbell|intermediate
Wind Sprints|abdominals||body only|beginner
Windmills|abductors|glutes, hamstrings, lower back|None|intermediate
World's Greatest Stretch|hamstrings|calves, glutes, quadriceps|None|intermediate
Wrist Circles|forearms||body only|beginner
Wrist Roller|forearms|shoulders|other|beginner
Wrist Rotations with Straight Bar|forearms||barbell|beginner
Yoke Walk|quadriceps|abdominals, abductors, adductors, calves, glutes, hamstrings, lower back|other|intermediate
Zercher Squats|quadriceps|calves, glutes, hamstrings|barbell|expert
Zottman Curl|biceps|forearms|dumbbell|intermediate
Zottman Preacher Curl|biceps|forearms|dumbbell|intermediate
`;

// Parse the raw data into structured exercises
export function parseExerciseData(): FullExerciseData[] {
  const lines = rawExerciseData.trim().split('\n');
  const exercises: FullExerciseData[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = line.split('|');
    if (parts.length !== 5) continue;

    const [name, primaryMuscle, secondaryMuscles, equipment, difficulty] = parts;
    
    if (!name || !primaryMuscle) continue;

    const secondaryArray = secondaryMuscles
      ? secondaryMuscles.split(',').map(m => m.trim()).filter(m => m)
      : [];

    exercises.push({
      id: createId(name),
      name: name.trim(),
      primaryMuscle: primaryMuscle.trim(),
      secondaryMuscles: secondaryArray,
      equipment: equipment.trim() || 'body only',
      difficulty: (difficulty.trim() as any) || 'beginner',
    });
  }

  return exercises;
}

// Export the full library
export const ALL_879_EXERCISES = parseExerciseData();

console.log(`Loaded ${ALL_879_EXERCISES.length} exercises`);
