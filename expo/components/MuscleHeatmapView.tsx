import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { shouldShowOnFront, shouldShowOnBack, getMuscleColor } from '@/constants/muscle-mapping';

interface MuscleHeatmapViewProps {
  primaryMuscle: string;
  secondaryMuscles?: string[];
}

export function MuscleHeatmapView({ primaryMuscle, secondaryMuscles = [] }: MuscleHeatmapViewProps) {
  const allMuscles = [primaryMuscle, ...secondaryMuscles].filter(Boolean);
  const uniqueMuscles = Array.from(new Set(allMuscles));

  // Helper to render muscle regions
  const renderMuscleRegion = (muscle: string, isPrimary: boolean) => {
    const color = getMuscleColor(muscle, isPrimary);
    const opacity = isPrimary ? 0.8 : 0.4;
    
    return (
      <View
        style={[
          styles.muscleRegion,
          {
            backgroundColor: color,
            opacity: opacity,
          },
        ]}
      />
    );
  };

  // Group muscles by body region
  const frontMuscles = uniqueMuscles.filter(m => shouldShowOnFront(m));
  const backMuscles = uniqueMuscles.filter(m => shouldShowOnBack(m));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscles Worked</Text>
      
      <View style={styles.heatmapContainer}>
        <View style={styles.bodyViews}>
          {/* Front View */}
          <View style={styles.bodyView}>
            <Text style={styles.bodyViewLabel}>Front View</Text>
            <View style={styles.bodyImageContainer}>
              {/* Base body outline */}
              <View style={styles.bodyOutline}>
                {/* Render front muscles */}
                {frontMuscles.map((muscle, index) => {
                  const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
                  return (
                    <View key={`front-${muscle}-${index}`} style={styles.muscleLayer}>
                      {renderMuscleRegion(muscle, isPrimary)}
                    </View>
                  );
                })}
                
                {/* Front body parts labels */}
                <View style={styles.bodyLabels}>
                  {frontMuscles.map((muscle, index) => {
                    const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
                    return (
                      <View key={`label-front-${index}`} style={styles.muscleLabel}>
                        <View style={[styles.muscleDot, { backgroundColor: getMuscleColor(muscle, isPrimary) }]} />
                        <Text style={styles.muscleLabelText}>{muscle}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          {/* Back View */}
          <View style={styles.bodyView}>
            <Text style={styles.bodyViewLabel}>Back View</Text>
            <View style={styles.bodyImageContainer}>
              {/* Base body outline */}
              <View style={styles.bodyOutline}>
                {/* Render back muscles */}
                {backMuscles.map((muscle, index) => {
                  const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
                  return (
                    <View key={`back-${muscle}-${index}`} style={styles.muscleLayer}>
                      {renderMuscleRegion(muscle, isPrimary)}
                    </View>
                  );
                })}
                
                {/* Back body parts labels */}
                <View style={styles.bodyLabels}>
                  {backMuscles.map((muscle, index) => {
                    const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
                    return (
                      <View key={`label-back-${index}`} style={styles.muscleLabel}>
                        <View style={[styles.muscleDot, { backgroundColor: getMuscleColor(muscle, isPrimary) }]} />
                        <Text style={styles.muscleLabelText}>{muscle}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getMuscleColor(primaryMuscle, true), opacity: 0.8 }]} />
            <Text style={styles.legendText}>Primary: {primaryMuscle}</Text>
          </View>
        </View>
        
        {secondaryMuscles.length > 0 && (
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.mediumGrey, opacity: 0.4 }]} />
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
    width: 140,
    height: 300,
    position: 'relative',
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bodyOutline: {
    flex: 1,
    position: 'relative',
  },
  muscleLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  muscleRegion: {
    position: 'absolute',
    borderRadius: 8,
  },
  bodyLabels: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    gap: 4,
  },
  muscleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  muscleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  muscleLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.darkGrey,
    textTransform: 'capitalize',
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
