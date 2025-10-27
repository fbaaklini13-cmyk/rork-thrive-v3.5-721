import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { 
  EXERCISES, 
  MUSCLE_GROUP_COLORS, 
  Equipment, 
  Difficulty, 
  FitnessGoal,
  MuscleGroup,
} from '@/mocks/exercises';

type FilterType = {
  equipment: Equipment[];
  difficulty: Difficulty[];
  goals: FitnessGoal[];
};

export default function ExercisesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const muscleFilter = params.muscle as MuscleGroup | undefined;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    equipment: [],
    difficulty: [],
    goals: [],
  });

  const filteredExercises = useMemo(() => {
    let results = EXERCISES;

    if (muscleFilter) {
      results = results.filter(ex => 
        ex.muscleGroup === muscleFilter || 
        ex.secondaryMuscles?.includes(muscleFilter)
      );
    }

    if (searchQuery) {
      results = results.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.equipment.length > 0) {
      results = results.filter(ex => filters.equipment.includes(ex.equipment));
    }

    if (filters.difficulty.length > 0) {
      results = results.filter(ex => filters.difficulty.includes(ex.difficulty));
    }

    if (filters.goals.length > 0) {
      results = results.filter(ex =>
        ex.goals.some(goal => filters.goals.includes(goal))
      );
    }

    return results;
  }, [muscleFilter, searchQuery, filters]);

  const toggleFilter = <T extends keyof FilterType>(
    category: T,
    value: FilterType[T][number]
  ) => {
    setFilters(prev => {
      const current = prev[category] as FilterType[T][number][];
      const exists = current.includes(value);
      
      return {
        ...prev,
        [category]: exists
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      equipment: [],
      difficulty: [],
      goals: [],
    });
  };

  const hasActiveFilters = 
    filters.equipment.length > 0 || 
    filters.difficulty.length > 0 || 
    filters.goals.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search color={Colors.mediumGrey} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.mediumGrey}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={Colors.mediumGrey} size={20} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter 
            color={hasActiveFilters ? Colors.white : Colors.darkGrey} 
            size={20} 
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.filterCategoryTitle}>Equipment</Text>
          <View style={styles.filterChips}>
            {(['barbell', 'dumbbell', 'machine', 'cable', 'bands', 'bodyweight'] as Equipment[]).map(eq => (
              <TouchableOpacity
                key={eq}
                style={[
                  styles.chip,
                  filters.equipment.includes(eq) && styles.chipActive,
                ]}
                onPress={() => toggleFilter('equipment', eq)}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.equipment.includes(eq) && styles.chipTextActive,
                  ]}
                >
                  {eq.charAt(0).toUpperCase() + eq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterCategoryTitle}>Difficulty</Text>
          <View style={styles.filterChips}>
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(diff => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.chip,
                  filters.difficulty.includes(diff) && styles.chipActive,
                ]}
                onPress={() => toggleFilter('difficulty', diff)}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.difficulty.includes(diff) && styles.chipTextActive,
                  ]}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterCategoryTitle}>Goal</Text>
          <View style={styles.filterChips}>
            {(['strength', 'hypertrophy', 'mobility', 'fat-loss'] as FitnessGoal[]).map(goal => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.chip,
                  filters.goals.includes(goal) && styles.chipActive,
                ]}
                onPress={() => toggleFilter('goals', goal)}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.goals.includes(goal) && styles.chipTextActive,
                  ]}
                >
                  {goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView style={styles.exercisesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
        </Text>

        {filteredExercises.map(exercise => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => router.push(`/workout/exercise-detail?id=${exercise.id}` as any)}
          >
            <View 
              style={[
                styles.muscleIndicator,
                { backgroundColor: MUSCLE_GROUP_COLORS[exercise.muscleGroup] },
              ]}
            />
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription} numberOfLines={2}>
                {exercise.description}
              </Text>
              <View style={styles.exerciseMeta}>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaText}>{exercise.equipment}</Text>
                </View>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaText}>{exercise.difficulty}</Text>
                </View>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaText}>
                    {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkGrey,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  filterCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginTop: 12,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.darkGrey,
  },
  chipTextActive: {
    color: Colors.white,
  },
  exercisesList: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mediumGrey,
    padding: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  muscleIndicator: {
    width: 4,
  },
  exerciseContent: {
    flex: 1,
    padding: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 6,
  },
  exerciseDescription: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
    marginBottom: 10,
  },
  exerciseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.lightGrey,
  },
  metaText: {
    fontSize: 12,
    color: Colors.mediumGrey,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
});
