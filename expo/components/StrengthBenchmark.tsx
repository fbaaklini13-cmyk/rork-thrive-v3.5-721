import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';
import type { WorkoutLog } from '@/types/user';

interface ExerciseBenchmark {
  exercise: string;
  userMax: number;
  userMaxReps: number;
  strengthLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  percentile: number;
  comparison: string;
}

const EXERCISE_STANDARDS: Record<string, {
  beginner: number;
  intermediate: number;
  advanced: number;
  elite: number;
}> = {
  'bench press': { beginner: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.5 },
  'squat': { beginner: 0.75, intermediate: 1.0, advanced: 1.5, elite: 2.0 },
  'deadlift': { beginner: 0.75, intermediate: 1.25, advanced: 1.75, elite: 2.5 },
  'overhead press': { beginner: 0.35, intermediate: 0.5, advanced: 0.75, elite: 1.0 },
  'barbell row': { beginner: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.5 },
};

export default function StrengthBenchmark() {
  const { profile, workoutLogs } = useUserProfile();

  const benchmarks = useMemo(() => {
    if (!profile.weight) return [];

    const exercisesMap = new Map<string, WorkoutLog[]>();
    
    workoutLogs.forEach(log => {
      const exerciseName = log.exerciseName.toLowerCase();
      if (!exercisesMap.has(exerciseName)) {
        exercisesMap.set(exerciseName, []);
      }
      exercisesMap.get(exerciseName)!.push(log);
    });

    const results: ExerciseBenchmark[] = [];

    Object.keys(EXERCISE_STANDARDS).forEach(exercise => {
      const logs = exercisesMap.get(exercise);
      if (!logs || logs.length === 0) return;

      let maxWeight = 0;
      let maxReps = 0;

      logs.forEach(log => {
        log.sets.forEach(set => {
          if (set.completed && set.weight > maxWeight) {
            maxWeight = set.weight;
            maxReps = set.reps;
          }
        });
      });

      if (maxWeight === 0) return;

      const ratio = maxWeight / profile.weight!;
      const standards = EXERCISE_STANDARDS[exercise];

      let strengthLevel: ExerciseBenchmark['strengthLevel'] = 'beginner';
      let percentile = 0;

      if (ratio >= standards.elite) {
        strengthLevel = 'elite';
        percentile = 95;
      } else if (ratio >= standards.advanced) {
        strengthLevel = 'advanced';
        percentile = 80;
      } else if (ratio >= standards.intermediate) {
        strengthLevel = 'intermediate';
        percentile = 50;
      } else {
        strengthLevel = 'beginner';
        percentile = 25;
      }

      const nextLevel = 
        strengthLevel === 'beginner' ? 'intermediate' :
        strengthLevel === 'intermediate' ? 'advanced' :
        strengthLevel === 'advanced' ? 'elite' : 'elite';

      const nextWeight = standards[nextLevel] * profile.weight!;
      const diff = nextWeight - maxWeight;

      const comparison = strengthLevel === 'elite'
        ? 'Elite level! 🏆'
        : `${diff.toFixed(1)}kg to ${nextLevel}`;

      results.push({
        exercise,
        userMax: maxWeight,
        userMaxReps: maxReps,
        strengthLevel,
        percentile,
        comparison,
      });
    });

    return results;
  }, [workoutLogs, profile.weight]);

  const getLevelColor = (level: ExerciseBenchmark['strengthLevel']) => {
    switch (level) {
      case 'elite':
        return '#D32F2F';
      case 'advanced':
        return '#F57C00';
      case 'intermediate':
        return '#FBC02D';
      case 'beginner':
        return Colors.mediumGrey;
    }
  };

  const getLevelIcon = (level: ExerciseBenchmark['strengthLevel']) => {
    if (level === 'elite' || level === 'advanced') {
      return TrendingUp;
    } else if (level === 'beginner') {
      return TrendingDown;
    }
    return Minus;
  };

  const formatExerciseName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!profile.weight) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Add your weight in profile settings to see strength benchmarks
        </Text>
      </View>
    );
  }

  if (benchmarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Complete workouts with tracked lifts to see your strength benchmarks
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Strength Benchmarks</Text>
        <Text style={styles.subtitle}>Based on {profile.weight}kg bodyweight</Text>
      </View>

      {benchmarks.map((benchmark, index) => {
        const LevelIcon = getLevelIcon(benchmark.strengthLevel);
        const levelColor = getLevelColor(benchmark.strengthLevel);

        return (
          <View key={index} style={styles.benchmarkCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.exerciseName}>
                {formatExerciseName(benchmark.exercise)}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: `${levelColor}15` }]}>
                <LevelIcon color={levelColor} size={16} />
                <Text style={[styles.levelText, { color: levelColor }]}>
                  {benchmark.strengthLevel.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Your Max</Text>
                <Text style={styles.statValue}>
                  {benchmark.userMax}kg × {benchmark.userMaxReps}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Percentile</Text>
                <Text style={styles.statValue}>{benchmark.percentile}th</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Bodyweight Ratio</Text>
                <Text style={styles.statValue}>
                  {(benchmark.userMax / profile.weight!).toFixed(2)}x
                </Text>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonText}>{benchmark.comparison}</Text>
            </View>
          </View>
        );
      })}

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Strength Levels</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.mediumGrey }]} />
          <Text style={styles.legendText}>Beginner: Just starting out</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FBC02D' }]} />
          <Text style={styles.legendText}>Intermediate: Regular training</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F57C00' }]} />
          <Text style={styles.legendText}>Advanced: Years of experience</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#D32F2F' }]} />
          <Text style={styles.legendText}>Elite: Competitive level</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  benchmarkCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.mediumGrey,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.lightGrey,
  },
  comparisonRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  comparisonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  legendCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
  },
});
