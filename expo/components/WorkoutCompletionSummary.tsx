import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { X, Award, Flame, Target, TrendingUp, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import type { SetLog } from '@/types/user';

const { width } = Dimensions.get('window');

interface WorkoutCompletionSummaryProps {
  visible: boolean;
  onClose: () => void;
  workoutName: string;
  totalDuration: number;
  exercises: {
    name: string;
    sets: SetLog[];
  }[];
}

type MuscleGroup = string;

export default function WorkoutCompletionSummary({
  visible,
  onClose,
  workoutName,
  totalDuration,
  exercises,
}: WorkoutCompletionSummaryProps) {
  const stats = useMemo(() => {
    const completedSets = exercises.reduce(
      (total, ex) => total + ex.sets.filter(s => s.completed).length,
      0
    );
    
    const totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
    
    const totalVolume = exercises.reduce((total, ex) =>
      total + ex.sets.reduce((setTotal, set) =>
        setTotal + (set.completed ? set.weight * set.reps : 0), 0
      ), 0
    );
    
    const totalReps = exercises.reduce((total, ex) =>
      total + ex.sets.reduce((setTotal, set) =>
        setTotal + (set.completed ? set.reps : 0), 0
      ), 0
    );

    const caloriesBurned = Math.round(totalDuration * 8);

    const musclesWorked = new Set<MuscleGroup>();
    exercises.forEach(ex => {
      const muscles = inferMuscleGroups(ex.name);
      muscles.forEach(m => musclesWorked.add(m));
    });

    const personalRecords = exercises
      .filter(ex => {
        const maxWeight = Math.max(...ex.sets.filter(s => s.completed).map(s => s.weight), 0);
        return maxWeight > 0;
      })
      .slice(0, 3);

    return {
      completedSets,
      totalSets,
      totalVolume,
      totalReps,
      caloriesBurned,
      musclesWorked: Array.from(musclesWorked),
      personalRecords,
    };
  }, [exercises, totalDuration]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatMuscleName = (muscle: string): string => {
    return muscle
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={Colors.darkGrey} size={24} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Award color={Colors.primary} size={48} />
              <Text style={styles.title}>Workout Complete!</Text>
              <Text style={styles.subtitle}>{workoutName}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Flame color={Colors.warning} size={28} />
                <Text style={styles.statValue}>{stats.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>

              <View style={styles.statCard}>
                <Target color={Colors.success} size={28} />
                <Text style={styles.statValue}>{stats.completedSets}/{stats.totalSets}</Text>
                <Text style={styles.statLabel}>Sets</Text>
              </View>

              <View style={styles.statCard}>
                <TrendingUp color={Colors.primary} size={28} />
                <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}K</Text>
                <Text style={styles.statLabel}>Volume (kg)</Text>
              </View>

              <View style={styles.statCard}>
                <Zap color={Colors.secondary} size={28} />
                <Text style={styles.statValue}>{formatDuration(totalDuration)}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Muscles Worked</Text>
              <View style={styles.muscleGrid}>
                {stats.musclesWorked.map((muscle, index) => (
                  <View key={index} style={styles.muscleTag}>
                    <Text style={styles.muscleText}>{formatMuscleName(muscle)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Exercise Breakdown</Text>
              {exercises.map((exercise, index) => {
                const completed = exercise.sets.filter(s => s.completed).length;
                const total = exercise.sets.length;
                const volume = exercise.sets.reduce((sum, set) =>
                  sum + (set.completed ? set.weight * set.reps : 0), 0
                );
                
                return (
                  <View key={index} style={styles.exerciseRow}>
                    <View style={styles.exerciseLeft}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseStats}>
                        {completed}/{total} sets • {(volume / 1000).toFixed(1)}K kg
                      </Text>
                    </View>
                    <View style={styles.completionBadge}>
                      <Text style={styles.completionText}>
                        {Math.round((completed / total) * 100)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {stats.personalRecords.length > 0 && (
              <View style={styles.prSection}>
                <Text style={styles.prTitle}>🎯 Top Lifts This Session</Text>
                {stats.personalRecords.map((exercise, index) => {
                  const maxWeight = Math.max(...exercise.sets.filter(s => s.completed).map(s => s.weight));
                  return (
                    <View key={index} style={styles.prRow}>
                      <Text style={styles.prName}>{exercise.name}</Text>
                      <Text style={styles.prWeight}>{maxWeight} kg</Text>
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function inferMuscleGroups(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase();
  const muscles: string[] = [];

  if (name.includes('chest') || name.includes('bench') || name.includes('press') && name.includes('chest')) {
    muscles.push('chest');
  }
  if (name.includes('shoulder') || name.includes('overhead') || name.includes('military')) {
    muscles.push('shoulders');
  }
  if (name.includes('bicep') || name.includes('curl')) {
    muscles.push('biceps');
  }
  if (name.includes('tricep') || name.includes('dip') || name.includes('pushdown')) {
    muscles.push('triceps');
  }
  if (name.includes('back') || name.includes('row') || name.includes('pull')) {
    if (name.includes('lower')) {
      muscles.push('lower_back');
    } else {
      muscles.push('upper_back', 'lats');
    }
  }
  if (name.includes('lat') || name.includes('pulldown')) {
    muscles.push('lats');
  }
  if (name.includes('ab') || name.includes('crunch') || name.includes('plank')) {
    muscles.push('abs');
  }
  if (name.includes('oblique') || name.includes('side') && name.includes('bend')) {
    muscles.push('obliques');
  }
  if (name.includes('quad') || name.includes('squat') || name.includes('leg press')) {
    muscles.push('quads');
  }
  if (name.includes('hamstring') || name.includes('deadlift') || name.includes('leg curl')) {
    muscles.push('hamstrings');
  }
  if (name.includes('glute') || name.includes('hip thrust')) {
    muscles.push('glutes');
  }
  if (name.includes('calf') || name.includes('raise') && name.includes('calf')) {
    muscles.push('calves');
  }

  return muscles;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 40,
    maxHeight: '90%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGrey,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 80 - 12) / 2,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  muscleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseLeft: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  exerciseStats: {
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  completionBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  prSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  prTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prName: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  prWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
