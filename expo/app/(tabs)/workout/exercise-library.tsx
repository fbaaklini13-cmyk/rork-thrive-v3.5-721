import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState, useMemo } from 'react';
import { Palette } from '@/constants/theme';
import { Dumbbell, Search } from 'lucide-react-native';
import { ALL_EXERCISES } from '@/mocks/full-exercise-library';
import { router } from 'expo-router';
import { MuscleGroupGrid } from '@/components/MuscleGroupGrid';

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return Palette.good;
      case 'intermediate': return Palette.warn;
      case 'advanced': return Palette.bad;
      case 'expert': return Palette.bad;
      default: return Palette.inkMuted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Palette.inkMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Palette.inkFaint}
        />
      </View>

      {/* Muscle Group Grid */}
      <MuscleGroupGrid
        selectedMuscle={selectedMuscle}
        onSelectMuscle={setSelectedMuscle}
      />

      {/* Difficulty Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterPill, !selectedDifficulty && styles.filterPillActive]}
          onPress={() => setSelectedDifficulty(null)}
        >
          <Text style={[styles.filterPillText, !selectedDifficulty && styles.filterPillTextActive]}>All Levels</Text>
        </TouchableOpacity>

        {['beginner', 'intermediate', 'expert'].map(diff => (
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
              <Dumbbell size={24} color={Palette.accent} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <View style={styles.exerciseMeta}>
                <View style={styles.muscleBadge}>
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
  container: { flex: 1, backgroundColor: Palette.canvas },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Palette.canvasRaised,
    margin: 16, marginBottom: 8, paddingHorizontal: 16, borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: Palette.ink },
  // flexGrow/flexShrink 0: the FlatList below takes the remaining height, and without
  // these the pill row was squeezed to ~30px and the pills cut in half (seen on web, 24 Sep).
  filterContainer: { paddingHorizontal: 16, paddingBottom: 12, flexGrow: 0, flexShrink: 0 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Palette.canvasRaised,
    marginRight: 8, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  filterPillActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  filterPillText: { fontSize: 14, color: Palette.inkMuted, fontWeight: '500' },
  filterPillTextActive: { color: Palette.canvas },

  resultsHeader: { paddingHorizontal: 16, paddingVertical: 8 },
  resultsText: { fontSize: 14, color: Palette.inkMuted, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  exerciseCard: {
    flexDirection: 'row', backgroundColor: Palette.canvasRaised, borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
  },
  exerciseIconContainer: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: Palette.canvas,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 16, fontWeight: '600', color: Palette.ink, marginBottom: 8 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  // Muscle chips were pastel fills under white text (white on #FFEAA7 is ~1.1:1).
  // One neutral chip now; colour is kept for difficulty, where it carries meaning.
  muscleBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4,
    backgroundColor: Palette.canvas, borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.lineStrong,
  },
  muscleBadgeText: { fontSize: 11, color: Palette.inkMuted, fontWeight: '600', textTransform: 'capitalize' },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 },
  difficultyBadgeText: { fontSize: 11, color: Palette.canvas, fontWeight: '700', textTransform: 'capitalize' },
  equipmentText: { fontSize: 12, color: Palette.inkMuted, fontStyle: 'italic' },
});
