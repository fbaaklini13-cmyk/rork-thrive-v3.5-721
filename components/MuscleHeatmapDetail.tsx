import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { getMuscleGroupColor } from '@/constants/muscle-groups';

interface MuscleHeatmapDetailProps {
  primaryMuscle: string;
  secondaryMuscles: string[];
}

export function MuscleHeatmapDetail({ primaryMuscle, secondaryMuscles }: MuscleHeatmapDetailProps) {
  const allMuscles = [primaryMuscle, ...secondaryMuscles].filter(Boolean);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heatmapContainer}>
        <Text style={styles.title}>Muscles Worked</Text>
        
        <View style={styles.bodyDiagram}>
          <View style={styles.diagramPlaceholder}>
            <Text style={styles.diagramText}>Body Diagram</Text>
            <Text style={styles.diagramSubtext}>Front View</Text>
          </View>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: getMuscleGroupColor(primaryMuscle) }]} />
            <Text style={styles.legendLabel}>Primary Muscle</Text>
          </View>
          {secondaryMuscles.length > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#A0A0A0' }]} />
              <Text style={styles.legendLabel}>Secondary Muscles</Text>
            </View>
          )}
        </View>

        <View style={styles.muscleList}>
          <View style={styles.muscleSection}>
            <Text style={styles.sectionTitle}>Primary Muscle</Text>
            <View style={styles.muscleChip}>
              <View
                style={[
                  styles.muscleIndicator,
                  { backgroundColor: getMuscleGroupColor(primaryMuscle) },
                ]}
              />
              <Text style={styles.muscleText}>{formatMuscleName(primaryMuscle)}</Text>
            </View>
          </View>

          {secondaryMuscles.length > 0 && (
            <View style={styles.muscleSection}>
              <Text style={styles.sectionTitle}>Secondary Muscles</Text>
              <View style={styles.muscleChips}>
                {secondaryMuscles.map((muscle, index) => (
                  <View key={index} style={styles.muscleChip}>
                    <View
                      style={[
                        styles.muscleIndicator,
                        { backgroundColor: getMuscleGroupColor(muscle) },
                      ]}
                    />
                    <Text style={styles.muscleText}>{formatMuscleName(muscle)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function formatMuscleName(muscle: string): string {
  return muscle
    .split(/[\s,]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heatmapContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  bodyDiagram: {
    alignItems: 'center',
    marginBottom: 24,
  },
  diagramPlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  diagramText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  diagramSubtext: {
    fontSize: 14,
    color: '#999',
  },
  legend: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  muscleList: {
    gap: 20,
  },
  muscleSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  muscleIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  muscleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
