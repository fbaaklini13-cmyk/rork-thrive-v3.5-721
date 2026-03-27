import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Award, Zap, Target, Flame } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function MotivationalBanner() {
  const { workoutLogs, achievements } = useUserProfile();

  const banner = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workoutLogs.filter(log => new Date(log.date) >= oneWeekAgo);

    const streak = calculateStreak(workoutLogs);
    const weeklyVolume = recentWorkouts.reduce((total, log) =>
      total + log.sets.reduce((setTotal, set) =>
        setTotal + (set.completed ? set.weight * set.reps : 0), 0
      ), 0
    );

    if (streak >= 7) {
      return {
        icon: Flame,
        color: Colors.warning,
        title: `${streak} Day Streak! 🔥`,
        message: 'You\'re on fire! Keep the momentum going!',
        bgColor: '#FFF3E0',
      };
    }

    if (recentWorkouts.length >= 5) {
      return {
        icon: TrendingUp,
        color: Colors.success,
        title: 'Top 5% This Week! 💪',
        message: `${recentWorkouts.length} workouts completed. You're crushing it!`,
        bgColor: '#E8F5E9',
      };
    }

    if (achievements.length >= 5) {
      return {
        icon: Award,
        color: Colors.primary,
        title: 'Achievement Hunter! 🏆',
        message: `${achievements.length} achievements unlocked. Amazing progress!`,
        bgColor: '#E3F2FD',
      };
    }

    if (weeklyVolume > 50000) {
      return {
        icon: Zap,
        color: Colors.secondary,
        title: 'Volume Beast! ⚡',
        message: `${(weeklyVolume / 1000).toFixed(0)}K kg moved this week!`,
        bgColor: '#FFF8E1',
      };
    }

    if (recentWorkouts.length > 0) {
      return {
        icon: Target,
        color: Colors.primary,
        title: 'Keep Going! 🎯',
        message: `${recentWorkouts.length} workout${recentWorkouts.length > 1 ? 's' : ''} this week. You got this!`,
        bgColor: '#F3E5F5',
      };
    }

    return {
      icon: Zap,
      color: Colors.mediumGrey,
      title: 'Ready to Start? 💪',
      message: 'Begin your fitness journey today!',
      bgColor: Colors.lightGrey,
    };
  }, [workoutLogs, achievements]);

  const Icon = banner.icon;

  return (
    <View style={[styles.container, { backgroundColor: banner.bgColor }]}>
      <Icon color={banner.color} size={32} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{banner.title}</Text>
        <Text style={styles.message}>{banner.message}</Text>
      </View>
    </View>
  );
}

function calculateStreak(workoutLogs: import('@/types/user').WorkoutLog[]): number {
  if (workoutLogs.length === 0) return 0;

  const sortedLogs = [...workoutLogs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
      currentDate = logDate;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
});
