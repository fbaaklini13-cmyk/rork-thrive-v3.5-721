import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Dumbbell, Filter } from 'lucide-react-native';
import { EXERCISES } from '@/mocks/exercises';
import { getMuscleGroupColor } from '@/constants/muscle-groups';

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const muscleGroups = useMemo(() => {
    const muscles = new Set<string>();
    EXERCISES.forEach(ex => {
      muscles.add(ex.muscleGroup);
      ex.secondaryMuscles?.forEach(m => muscles.add(m));
    });
    return Array.from(muscles).sort();
  }, []);

  const equipmentTypes = useMemo(() => {
    const equipment = new Set<string>();
    EXERCISES.forEach(ex => equipment.add(ex.equipment));
    return Array.from(equipment).sort();
  }, []);

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = !selectedMuscle || 
        exercise.muscleGroup === selectedMuscle || 
        (exercise.secondaryMuscles && exercise.secondaryMuscles.some(m => m === selectedMuscle));
      const matchesEquipment = !selectedEquipment || exercise.equipment === selectedEquipment;
      const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Exercise Library',
          headerShadowVisible: false,
        }}
      />

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.filterSection}>
          <Filter size={16} color="#666" />
          <Text style={styles.filterLabel}>Filters:</Text>
          
          <View style={styles.filterChips}>
            {selectedMuscle && (
              <TouchableOpacity
                style={[styles.filterChip, styles.activeChip]}
                onPress={() => setSelectedMuscle(null)}
              >
                <Text style={styles.activeChipText}>{selectedMuscle} ×</Text>
              </TouchableOpacity>
            )}
            {selectedEquipment && (
              <TouchableOpacity
                style={[styles.filterChip, styles.activeChip]}
                onPress={() => setSelectedEquipment(null)}
              >
                <Text style={styles.activeChipText}>{selectedEquipment} ×</Text>
              </TouchableOpacity>
            )}
            {selectedDifficulty && (
              <TouchableOpacity
                style={[styles.filterChip, styles.activeChip]}
                onPress={() => setSelectedDifficulty(null)}
              >
                <Text style={styles.activeChipText}>{selectedDifficulty} ×</Text>
              </TouchableOpacity>
            )}
            {(selectedMuscle || selectedEquipment || selectedDifficulty) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedMuscle(null);
                  setSelectedEquipment(null);
                  setSelectedDifficulty(null);
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseCard}
              onPress={() => router.push({
                pathname: '/workout/exercise-detail',
                params: { exerciseId: item.id }
              })}
            >
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseIcon}>
                  <Dumbbell size={24} color="#4A90E2" />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <View style={styles.exerciseMeta}>
                    <View
                      style={[
                        styles.muscleTag,
                        { backgroundColor: getMuscleGroupColor(item.muscleGroup) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.muscleTagText,
                          { color: getMuscleGroupColor(item.muscleGroup) },
                        ]}
                      >
                        {item.muscleGroup}
                      </Text>
                    </View>
                    <View style={styles.difficultyTag}>
                      <Text style={styles.difficultyText}>{item.difficulty}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.equipmentText}>Equipment: {item.equipment}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Dumbbell size={48} color="#ccc" />
              <Text style={styles.emptyText}>No exercises found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  activeChip: {
    backgroundColor: '#4A90E2',
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E74C3C',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  muscleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  equipmentText: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
