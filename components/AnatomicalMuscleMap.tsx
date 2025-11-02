import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '@/constants/colors';

interface AnatomicalMuscleMapProps {
  primaryMuscle: string;
  secondaryMuscles?: string[];
}

export function AnatomicalMuscleMap({ primaryMuscle, secondaryMuscles = [] }: AnatomicalMuscleMapProps) {
  const allMuscles = [primaryMuscle, ...secondaryMuscles]
    .filter(Boolean)
    .map(m => m.toLowerCase().trim());
  
  const isActive = (muscleKeywords: string[]) => {
    return allMuscles.some(m => 
      muscleKeywords.some(keyword => m.includes(keyword))
    );
  };

  const isPrimary = (muscleKeywords: string[]) => {
    const pm = primaryMuscle.toLowerCase().trim();
    return muscleKeywords.some(keyword => pm.includes(keyword));
  };

  const getMuscleStyle = (muscleKeywords: string[]) => {
    if (!isActive(muscleKeywords)) return { fill: '#E8E8E8', opacity: 1 };
    return {
      fill: '#FF4444',
      opacity: isPrimary(muscleKeywords) ? 1 : 0.6
    };
  };

  const frontMuscles = allMuscles.filter(m => 
    m.includes('chest') || m.includes('pec') ||
    m.includes('bicep') || m.includes('ab') ||
    m.includes('quad') || m.includes('adduct') ||
    m.includes('shoulder') || m.includes('delt') ||
    m.includes('forearm') || m.includes('calf')
  );

  const backMuscles = allMuscles.filter(m => 
    m.includes('back') || m.includes('lat') ||
    m.includes('trap') || m.includes('tricep') ||
    m.includes('hamstring') || m.includes('glute') ||
    m.includes('shoulder') || m.includes('delt') ||
    m.includes('forearm') || m.includes('calf')
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscles Worked</Text>
      
      <View style={styles.bodyViews}>
        {/* Front View */}
        {frontMuscles.length > 0 && (
          <View style={styles.bodyView}>
            <Text style={styles.viewLabel}>Front View</Text>
            <View style={styles.svgContainer}>
              <Svg width="140" height="280" viewBox="0 0 140 280">
                {/* Body outline */}
                <Path
                  d="M 70 20 Q 60 25 60 35 L 60 50 Q 50 55 40 70 L 30 90 Q 28 100 28 115 L 28 140 Q 28 155 30 165 L 35 180 L 40 200 Q 42 210 42 220 L 42 240 Q 42 255 45 265 L 50 275 Q 52 278 55 278 L 60 275 L 60 240 L 60 220 Q 60 210 62 200 L 65 180 L 68 165 Q 70 155 70 140 L 70 115 Q 70 100 72 90 L 75 70 Q 78 55 82 50 L 82 35 Q 82 25 80 20 Q 75 15 70 15 Z"
                  fill="none"
                  stroke="#333"
                  strokeWidth="1.5"
                />
                
                {/* Mirror right side */}
                <Path
                  d="M 70 20 Q 80 25 80 35 L 80 50 Q 90 55 100 70 L 110 90 Q 112 100 112 115 L 112 140 Q 112 155 110 165 L 105 180 L 100 200 Q 98 210 98 220 L 98 240 Q 98 255 95 265 L 90 275 Q 88 278 85 278 L 80 275 L 80 240 L 80 220 Q 80 210 78 200 L 75 180 L 72 165 Q 70 155 70 140 L 70 115 Q 70 100 68 90 L 65 70 Q 62 55 58 50 L 58 35 Q 58 25 60 20 Q 65 15 70 15 Z"
                  fill="none"
                  stroke="#333"
                  strokeWidth="1.5"
                />

                {/* Chest/Pectorals */}
                <G {...getMuscleStyle(['chest', 'pec'])}>
                  <Path d="M 52 60 Q 48 65 48 75 L 48 88 Q 48 95 52 98 L 68 98 Q 70 98 70 95 L 70 75 Q 70 65 68 60 L 60 58 L 52 60 Z" />
                  <Path d="M 88 60 Q 92 65 92 75 L 92 88 Q 92 95 88 98 L 72 98 Q 70 98 70 95 L 70 75 Q 70 65 72 60 L 80 58 L 88 60 Z" />
                </G>

                {/* Shoulders/Deltoids */}
                <G {...getMuscleStyle(['shoulder', 'delt'])}>
                  <Path d="M 35 55 Q 30 60 30 70 L 30 85 Q 30 92 35 95 L 45 95 Q 48 95 48 90 L 48 70 Q 48 62 45 58 L 40 55 L 35 55 Z" />
                  <Path d="M 105 55 Q 110 60 110 70 L 110 85 Q 110 92 105 95 L 95 95 Q 92 95 92 90 L 92 70 Q 92 62 95 58 L 100 55 L 105 55 Z" />
                </G>

                {/* Biceps */}
                <G {...getMuscleStyle(['bicep'])}>
                  <Path d="M 35 95 Q 32 100 32 108 L 32 125 Q 32 132 35 135 L 42 135 Q 45 135 45 130 L 45 108 Q 45 100 42 97 L 38 95 L 35 95 Z" />
                  <Path d="M 105 95 Q 108 100 108 108 L 108 125 Q 108 132 105 135 L 98 135 Q 95 135 95 130 L 95 108 Q 95 100 98 97 L 102 95 L 105 95 Z" />
                </G>

                {/* Forearms */}
                <G {...getMuscleStyle(['forearm'])}>
                  <Path d="M 35 135 Q 32 138 32 145 L 32 165 Q 32 172 35 175 L 40 175 Q 43 175 43 170 L 43 145 Q 43 138 40 136 L 37 135 L 35 135 Z" />
                  <Path d="M 105 135 Q 108 138 108 145 L 108 165 Q 108 172 105 175 L 100 175 Q 97 175 97 170 L 97 145 Q 97 138 100 136 L 103 135 L 105 135 Z" />
                </G>

                {/* Abdominals */}
                <G {...getMuscleStyle(['ab', 'oblique'])}>
                  <Path d="M 52 100 Q 48 105 48 115 L 48 145 Q 48 155 52 158 L 88 158 Q 92 155 92 145 L 92 115 Q 92 105 88 100 L 70 100 L 52 100 Z" />
                </G>

                {/* Quadriceps */}
                <G {...getMuscleStyle(['quad'])}>
                  <Path d="M 48 165 Q 45 170 45 180 L 45 220 Q 45 230 48 235 L 65 235 Q 68 235 68 225 L 68 180 Q 68 170 65 167 L 56 165 L 48 165 Z" />
                  <Path d="M 92 165 Q 95 170 95 180 L 95 220 Q 95 230 92 235 L 75 235 Q 72 235 72 225 L 72 180 Q 72 170 75 167 L 84 165 L 92 165 Z" />
                </G>

                {/* Adductors */}
                <G {...getMuscleStyle(['adduct'])}>
                  <Path d="M 62 175 Q 60 180 60 190 L 60 215 Q 60 222 62 225 L 78 225 Q 80 222 80 215 L 80 190 Q 80 180 78 175 L 70 175 L 62 175 Z" />
                </G>

                {/* Calves */}
                <G {...getMuscleStyle(['calf', 'calves'])}>
                  <Path d="M 48 240 Q 46 245 46 252 L 46 268 Q 46 273 48 275 L 62 275 Q 65 275 65 270 L 65 252 Q 65 245 62 242 L 55 240 L 48 240 Z" />
                  <Path d="M 92 240 Q 94 245 94 252 L 94 268 Q 94 273 92 275 L 78 275 Q 75 275 75 270 L 75 252 Q 75 245 78 242 L 85 240 L 92 240 Z" />
                </G>

                {/* Muscle separators */}
                <Path d="M 48 75 L 92 75 M 48 88 L 92 88 M 48 115 L 92 115 M 48 130 L 92 130 M 48 145 L 92 145" 
                  stroke="#333" 
                  strokeWidth="0.5" 
                  opacity="0.3" 
                />
              </Svg>
            </View>
          </View>
        )}

        {/* Back View */}
        {backMuscles.length > 0 && (
          <View style={styles.bodyView}>
            <Text style={styles.viewLabel}>Back View</Text>
            <View style={styles.svgContainer}>
              <Svg width="140" height="280" viewBox="0 0 140 280">
                {/* Body outline - same as front */}
                <Path
                  d="M 70 20 Q 60 25 60 35 L 60 50 Q 50 55 40 70 L 30 90 Q 28 100 28 115 L 28 140 Q 28 155 30 165 L 35 180 L 40 200 Q 42 210 42 220 L 42 240 Q 42 255 45 265 L 50 275 Q 52 278 55 278 L 60 275 L 60 240 L 60 220 Q 60 210 62 200 L 65 180 L 68 165 Q 70 155 70 140 L 70 115 Q 70 100 72 90 L 75 70 Q 78 55 82 50 L 82 35 Q 82 25 80 20 Q 75 15 70 15 Z"
                  fill="none"
                  stroke="#333"
                  strokeWidth="1.5"
                />
                <Path
                  d="M 70 20 Q 80 25 80 35 L 80 50 Q 90 55 100 70 L 110 90 Q 112 100 112 115 L 112 140 Q 112 155 110 165 L 105 180 L 100 200 Q 98 210 98 220 L 98 240 Q 98 255 95 265 L 90 275 Q 88 278 85 278 L 80 275 L 80 240 L 80 220 Q 80 210 78 200 L 75 180 L 72 165 Q 70 155 70 140 L 70 115 Q 70 100 68 90 L 65 70 Q 62 55 58 50 L 58 35 Q 58 25 60 20 Q 65 15 70 15 Z"
                  fill="none"
                  stroke="#333"
                  strokeWidth="1.5"
                />

                {/* Traps */}
                <G {...getMuscleStyle(['trap'])}>
                  <Path d="M 52 50 Q 48 55 48 65 L 48 80 Q 48 88 52 90 L 88 90 Q 92 88 92 80 L 92 65 Q 92 55 88 50 L 70 48 L 52 50 Z" />
                </G>

                {/* Shoulders - Back */}
                <G {...getMuscleStyle(['shoulder', 'delt'])}>
                  <Path d="M 35 55 Q 30 60 30 70 L 30 85 Q 30 92 35 95 L 45 95 Q 48 95 48 90 L 48 70 Q 48 62 45 58 L 40 55 L 35 55 Z" />
                  <Path d="M 105 55 Q 110 60 110 70 L 110 85 Q 110 92 105 95 L 95 95 Q 92 95 92 90 L 92 70 Q 92 62 95 58 L 100 55 L 105 55 Z" />
                </G>

                {/* Lats / Middle Back */}
                <G {...getMuscleStyle(['lat', 'middle back', 'back'])}>
                  <Path d="M 42 92 Q 38 98 38 110 L 38 145 Q 38 155 42 160 L 98 160 Q 102 155 102 145 L 102 110 Q 102 98 98 92 L 70 90 L 42 92 Z" />
                </G>

                {/* Lower Back */}
                <G {...getMuscleStyle(['lower back'])}>
                  <Path d="M 48 160 Q 45 165 45 172 L 45 185 Q 45 192 48 195 L 92 195 Q 95 192 95 185 L 95 172 Q 95 165 92 160 L 70 160 L 48 160 Z" />
                </G>

                {/* Triceps */}
                <G {...getMuscleStyle(['tricep'])}>
                  <Path d="M 35 95 Q 32 100 32 108 L 32 125 Q 32 132 35 135 L 42 135 Q 45 135 45 130 L 45 108 Q 45 100 42 97 L 38 95 L 35 95 Z" />
                  <Path d="M 105 95 Q 108 100 108 108 L 108 125 Q 108 132 105 135 L 98 135 Q 95 135 95 130 L 95 108 Q 95 100 98 97 L 102 95 L 105 95 Z" />
                </G>

                {/* Forearms */}
                <G {...getMuscleStyle(['forearm'])}>
                  <Path d="M 35 135 Q 32 138 32 145 L 32 165 Q 32 172 35 175 L 40 175 Q 43 175 43 170 L 43 145 Q 43 138 40 136 L 37 135 L 35 135 Z" />
                  <Path d="M 105 135 Q 108 138 108 145 L 108 165 Q 108 172 105 175 L 100 175 Q 97 175 97 170 L 97 145 Q 97 138 100 136 L 103 135 L 105 135 Z" />
                </G>

                {/* Glutes */}
                <G {...getMuscleStyle(['glute'])}>
                  <Path d="M 48 195 Q 45 200 45 210 L 45 225 Q 45 232 48 235 L 92 235 Q 95 232 95 225 L 95 210 Q 95 200 92 195 L 70 195 L 48 195 Z" />
                </G>

                {/* Hamstrings */}
                <G {...getMuscleStyle(['hamstring'])}>
                  <Path d="M 48 235 Q 46 240 46 248 L 46 268 Q 46 275 48 278 L 65 278 Q 68 275 68 268 L 68 248 Q 68 240 65 237 L 56 235 L 48 235 Z" />
                  <Path d="M 92 235 Q 94 240 94 248 L 94 268 Q 94 275 92 278 L 75 278 Q 72 275 72 268 L 72 248 Q 72 240 75 237 L 84 235 L 92 235 Z" />
                </G>

                {/* Calves - Back */}
                <G {...getMuscleStyle(['calf', 'calves'])}>
                  <Path d="M 48 240 Q 46 245 46 252 L 46 268 Q 46 273 48 275 L 62 275 Q 65 275 65 270 L 65 252 Q 65 245 62 242 L 55 240 L 48 240 Z" />
                  <Path d="M 92 240 Q 94 245 94 252 L 94 268 Q 94 273 92 275 L 78 275 Q 75 275 75 270 L 75 252 Q 75 245 78 242 L 85 240 L 92 240 Z" />
                </G>

                {/* Muscle separators */}
                <Path d="M 48 65 L 92 65 M 48 80 L 92 80 M 48 110 L 92 110 M 48 145 L 92 145 M 48 172 L 92 172 M 48 210 L 92 210" 
                  stroke="#333" 
                  strokeWidth="0.5" 
                  opacity="0.3" 
                />
              </Svg>
            </View>
          </View>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF4444' }]} />
          <Text style={styles.legendLabel}>Primary</Text>
          <Text style={styles.legendText}>{primaryMuscle}</Text>
        </View>
        
        {secondaryMuscles.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF4444', opacity: 0.6 }]} />
            <Text style={styles.legendLabel}>Secondary</Text>
            <Text style={styles.legendText}>{secondaryMuscles.join(', ')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkGrey,
    marginBottom: 24,
  },
  bodyViews: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  bodyView: {
    alignItems: 'center',
  },
  viewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  svgContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  legend: {
    gap: 12,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.darkGrey,
    minWidth: 75,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.mediumGrey,
    textTransform: 'capitalize',
  },
});
