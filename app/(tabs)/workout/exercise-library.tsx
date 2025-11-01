import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState, useMemo } from 'react';
import { Colors } from '@/constants/colors';
import { Dumbbell, Search } from 'lucide-react-native';
import { ALL_EXERCISES, MUSCLE_GROUPS } from '@/mocks/full-exercise-library';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExerciseLibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    let exercises = ALL_EXERCISES;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      exercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        ex.primaryMuscle.toLowerCase().includes(query) ||
        ex.equipment.toLowerCase().includes(query)
      );
    }

    // Filter by muscle group
    if (selectedMuscle) {
      exercises = exercises.filter(ex => ex.primaryMuscle === selectedMuscle);
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      exercises = exercises.filter(ex => ex.difficulty === selectedDifficulty);
    }

    return exercises;
  }, [searchQuery, selectedMuscle, selectedDifficulty]);

  const getMuscleColor = (muscle: string) => {
    const colors: Record<string, string> = {
      'chest': '#FF6B6B',
      'shoulders': '#4ECDC4',
      'back': '#FFEAA7',
      'biceps': '#96CEB4',
      'triceps': '#45B7D1',
      'legs': '#74B9FF',
      'quadriceps': '#74B9FF',
      'hamstrings': '#A29BFE',
      'glutes': '#FD79A8',
      'calves': '#FDCB6E',
      'abdominals': '#DFE6E9',
      'abs': '#DFE6E9',
      'forearms': '#6C5CE7',
      'traps': '#FFA07A',
      'lats': '#FFD700',
      'middle back': '#FAE3D9',
      'lower back': '#FFB6B9',
    };
    return colors[muscle.toLowerCase()] || '#A0A0A0';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
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

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterPill, !selectedMuscle && !selectedDifficulty && styles.filterPillActive]}
          onPress={() => { setSelectedMuscle(null); setSelectedDifficulty(null); }}
        >
          <Text style={[styles.filterPillText, !selectedMuscle && !selectedDifficulty && styles.filterPillTextActive]}>All</Text>
        </TouchableOpacity>

        {['beginner', 'intermediate', 'advanced', 'expert'].map(diff => (
          <TouchableOpacity
            key={diff}
            style={[
              styles.filterPill,
              selectedDifficulty === diff && styles.filterPillActive,
              selectedDifficulty === diff && { backgroundColor: getDifficultyColor(diff) }
            ]}
            onPress={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
          >
            <Text style={[
              styles.filterPillText,
              selectedDifficulty === diff && styles.filterPillTextActive
            ]}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Muscle Group Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleFilterContainer}>
        {MUSCLE_GROUPS.map(muscle => (
          <TouchableOpacity
            key={muscle}
            style={[
              styles.musclePill,
              selectedMuscle === muscle && styles.musclePillActive,
              selectedMuscle === muscle && { backgroundColor: getMuscleColor(muscle) }
            ]}
            onPress={() => setSelectedMuscle(selectedMuscle === muscle ? null : muscle)}
          >
            <Text style={[
              styles.musclePillText,
              selectedMuscle === muscle && styles.musclePillTextActive
            ]}>{muscle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseCard}
            onPress={() => router.push({
              pathname: '/workout/exercise-detail',
              params: { exerciseId: item.id }
            })}
          >
            <View style={styles.exerciseIconContainer}>
              <Dumbbell size={24} color={Colors.primary} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <View style={styles.exerciseMeta}>
                <View style={[styles.muscleBadge, { backgroundColor: getMuscleColor(item.primaryMuscle) }]}>
                  <Text style={styles.muscleBadgeText}>{item.primaryMuscle}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                  <Text style={styles.difficultyBadgeText}>{item.difficulty}</Text>
                </View>
                <Text style={styles.equipmentText}>{item.equipment}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    maxHeight: 50,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#fff',
  },
  muscleFilterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    maxHeight: 50,
  },
  musclePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  musclePillActive: {
    borderColor: 'transparent',
  },
  musclePillText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  musclePillTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  muscleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  muscleBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  difficultyBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  equipmentText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
