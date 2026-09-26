import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Palette } from '@/constants/theme';

interface MuscleGroupGridProps {
  selectedMuscle: string | null;
  onSelectMuscle: (muscle: string | null) => void;
}

const MUSCLE_GROUPS = [
  {
    name: 'Triceps',
    key: 'triceps',
    image: require('../assets/images/muscles/triceps.jpg'),
  },
  {
    name: 'Chest',
    key: 'chest',
    image: require('../assets/images/muscles/chest.jpg'),
  },
  {
    name: 'Shoulders',
    key: 'shoulders',
    image: require('../assets/images/muscles/shoulders.jpg'),
  },
  {
    name: 'Biceps',
    key: 'biceps',
    image: require('../assets/images/muscles/biceps.jpg'),
  },
  {
    name: 'Back',
    key: 'back',
    image: require('../assets/images/muscles/back.jpg'),
  },
  {
    name: 'Abs',
    key: 'abdominals',
    image: require('../assets/images/muscles/abs.jpg'),
  },
  {
    name: 'Quadriceps',
    key: 'quadriceps',
    image: require('../assets/images/muscles/quadriceps.jpg'),
  },
  {
    name: 'Hamstrings',
    key: 'hamstrings',
    image: require('../assets/images/muscles/hamstrings.jpg'),
  },
  {
    name: 'Glutes',
    key: 'glutes',
    image: require('../assets/images/muscles/glutes.jpg'),
  },
];

export function MuscleGroupGrid({ selectedMuscle, onSelectMuscle }: MuscleGroupGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {MUSCLE_GROUPS.map((group) => {
          const isSelected = selectedMuscle === group.key;
          return (
            <TouchableOpacity
              key={group.key}
              style={[styles.gridItem, isSelected && styles.gridItemSelected]}
              onPress={() => onSelectMuscle(isSelected ? null : group.key)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={group.image}
                  style={styles.muscleImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.muscleName, isSelected && styles.muscleNameSelected]}>
                {group.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: Palette.canvasRaised,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 12,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: Palette.canvasRaised,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  gridItemSelected: {
    borderColor: Palette.accent,
    elevation: 3,
    shadowOpacity: 0.15,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  muscleImage: {
    width: '100%',
    height: '65%',
  },
  muscleName: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: Palette.ink,
  },
  muscleNameSelected: {
    color: Palette.accent,
  },
});
