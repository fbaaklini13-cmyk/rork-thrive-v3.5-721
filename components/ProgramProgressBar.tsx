import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Target, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import type { WorkoutPlan } from '@/types/user';

interface ProgramProgressBarProps {
  program: WorkoutPlan;
  completedWorkouts: number;
  totalWorkouts?: number;
  onPress?: () => void;
}

export default function ProgramProgressBar({
  program,
  completedWorkouts,
  totalWorkouts,
  onPress,
}: ProgramProgressBarProps) {
  const stats = useMemo(() => {
    const totalDays = totalWorkouts || program.daysPerWeek * 12;
    const progress = Math.min((completedWorkouts / totalDays) * 100, 100);
    const weeksCompleted = Math.floor(completedWorkouts / program.daysPerWeek);
    const totalWeeks = Math.ceil(totalDays / program.daysPerWeek);
    const daysRemaining = Math.max(totalDays - completedWorkouts, 0);

    return {
      progress,
      weeksCompleted,
      totalWeeks,
      daysRemaining,
      totalDays,
    };
  }, [program, completedWorkouts, totalWorkouts]);

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Target color={Colors.primary} size={20} />
          <Text style={styles.title} numberOfLines={1}>
            {program.goals[0] || 'Training Program'}
          </Text>
        </View>
        <View style={styles.weekBadge}>
          <Text style={styles.weekText}>
            Week {stats.weeksCompleted + 1}/{stats.totalWeeks}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${stats.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(stats.progress)}%</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Calendar color={Colors.mediumGrey} size={16} />
          <Text style={styles.statText}>
            Day {completedWorkouts + 1}/{stats.totalDays}
          </Text>
        </View>

        <View style={styles.statItem}>
          <TrendingUp color={Colors.success} size={16} />
          <Text style={styles.statText}>
            {completedWorkouts} completed
          </Text>
        </View>

        {stats.daysRemaining > 0 && (
          <View style={styles.statItem}>
            <Target color={Colors.warning} size={16} />
            <Text style={styles.statText}>
              {stats.daysRemaining} remaining
            </Text>
          </View>
        )}
      </View>

      {stats.progress === 100 && (
        <View style={styles.completeBadge}>
          <Text style={styles.completeText}>🎉 Program Complete!</Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    flex: 1,
  },
  weekBadge: {
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  completeBadge: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
});
