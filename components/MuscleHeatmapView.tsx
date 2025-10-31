import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { getMuscleGroupIcon, getMuscleGroupColor } from '@/constants/muscle-groups';

interface MuscleHeatmapViewProps {
  primaryMuscle: string;
  secondaryMuscles?: string[];
}

export function MuscleHeatmapView({ primaryMuscle, secondaryMuscles = [] }: MuscleHeatmapViewProps) {
  const allMuscles = [primaryMuscle, ...secondaryMuscles].filter(Boolean);
  const uniqueMuscles = Array.from(new Set(allMuscles.map(m => m.toLowerCase())));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscles Worked</Text>
      
      <View style={styles.heatmapContainer}>
        <View style={styles.bodyViews}>
          <View style={styles.bodyView}>
            <Text style={styles.bodyViewLabel}>Front</Text>
            <View style={styles.bodyImageContainer}>
              {uniqueMuscles.map((muscle, index) => {
                const icon = getMuscleGroupIcon(muscle);
                const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
                
                if (!icon) return null;
                
                const shouldShowFront = 
                  muscle.includes('chest') ||
                  muscle.includes('bicep') ||
                  muscle.includes('abs') ||
                  muscle.includes('quad') ||
                  muscle.includes('shoulder');
                
                if (!shouldShowFront) return null;
                
                return (
                  <Image
                    key={`${muscle}-${index}`}
                    source={{ uri: icon }}
                    style={[
                      styles.muscleOverlay,
                      { opacity: isPrimary ? 1 : 0.6 },
                    ]}
                    resizeMode="contain"
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.bodyView}>
            <Text style={styles.bodyViewLabel}>Back</Text>
            <View style={styles.bodyImageContainer}>
              {uniqueMuscles.map((muscle, index) => {
                const icon = getMuscleGroupIcon(muscle);
                const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
                
                if (!icon) return null;
                
                const shouldShowBack = 
                  muscle.includes('back') ||
                  muscle.includes('tricep') ||
                  muscle.includes('hamstring') ||
                  muscle.includes('glute') ||
                  muscle.includes('calf');
                
                if (!shouldShowBack) return null;
                
                return (
                  <Image
                    key={`${muscle}-${index}`}
                    source={{ uri: icon }}
                    style={[
                      styles.muscleOverlay,
                      { opacity: isPrimary ? 1 : 0.6 },
                    ]}
                    resizeMode="contain"
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getMuscleGroupColor(primaryMuscle), opacity: 1 }]} />
            <Text style={styles.legendText}>Primary: {primaryMuscle}</Text>
          </View>
        </View>
        
        {secondaryMuscles.length > 0 && (
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.mediumGrey, opacity: 0.6 }]} />
              <Text style={styles.legendText}>
                Secondary: {secondaryMuscles.join(', ')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 16,
  },
  heatmapContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bodyViews: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  bodyView: {
    alignItems: 'center',
  },
  bodyViewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  bodyImageContainer: {
    width: 120,
    height: 280,
    position: 'relative',
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    overflow: 'hidden',
  },
  muscleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: Colors.darkGrey,
    textTransform: 'capitalize',
  },
});
