import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/colors';

interface MuscleGroupGridProps {
  selectedMuscle: string | null;
  onSelectMuscle: (muscle: string | null) => void;
}

const MUSCLE_GROUPS = [
  {
    name: 'Triceps',
    key: 'triceps',
    image: 'https://r2-pub.rork.com/generated-images/45e30bb1-7c7c-4046-9181-ccd08b923bfe.png',
  },
  {
    name: 'Chest',
    key: 'chest',
    image: 'https://r2-pub.rork.com/generated-images/d37f3d8a-04c1-4172-9d6b-c949e50e07b9.png',
  },
  {
    name: 'Shoulders',
    key: 'shoulders',
    image: 'https://r2-pub.rork.com/generated-images/7510ae71-9074-4d20-97ec-0368514a4949.png',
  },
  {
    name: 'Biceps',
    key: 'biceps',
    image: 'https://r2-pub.rork.com/generated-images/c56060be-a75e-4188-9c64-4627eac05a53.png',
  },
  {
    name: 'Back',
    key: 'back',
    image: 'https://r2-pub.rork.com/generated-images/748cd2f6-2dbf-4de7-a849-a8c4eb2c811c.png',
  },
  {
    name: 'Abs',
    key: 'abdominals',
    image: 'https://r2-pub.rork.com/generated-images/e61d4def-c5a0-4695-82b7-c5702b2770de.png',
  },
  {
    name: 'Quadriceps',
    key: 'quadriceps',
    image: 'https://r2-pub.rork.com/generated-images/ab6edc43-df94-43c1-aff3-9e0795b7f02f.png',
  },
  {
    name: 'Hamstrings',
    key: 'hamstrings',
    image: 'https://r2-pub.rork.com/generated-images/45cdc2df-c2c4-498d-afc8-1ffa73f32b19.png',
  },
  {
    name: 'Glutes',
    key: 'glutes',
    image: 'https://r2-pub.rork.com/generated-images/51720828-e1a9-460f-a79d-0db439089493.png',
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
                  source={{ uri: group.image }}
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
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
    borderColor: Colors.primary,
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
    color: '#333',
  },
  muscleNameSelected: {
    color: Colors.primary,
  },
});
