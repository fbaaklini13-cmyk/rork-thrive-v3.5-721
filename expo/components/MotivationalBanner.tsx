import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Award, Zap, Target, Flame } from 'lucide-react-native';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import { sessionsSince } from '@/lib/workout-sessions';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function MotivationalBanner() {
  const { workoutLogs, achievements } = useUserProfile();

  const banner = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    // Sessions, not logs: one log is one exercise (lib/workout-sessions.ts).
    const recentWorkouts = sessionsSince(workoutLogs, oneWeekAgo);

    const streak = calculateStreak(workoutLogs);
    const weeklyVolume = recentWorkouts.reduce((total, s) => total + s.volumeKg, 0);

    if (streak >= 7) {
      return {
        icon: Flame,
        color: Palette.warn,
        title: `${streak} Day Streak! 🔥`,
        message: 'You\'re on fire! Keep the momentum going!',
      };
    }

    if (recentWorkouts.length >= 5) {
      return {
        icon: TrendingUp,
        color: Palette.good,
        // Was "Top 5% This Week!": a percentile with no population behind it.
        title: `${recentWorkouts.length} workouts this week 💪`,
        message: `That's a strong week. Keep it going!`,
      };
    }

    if (achievements.length >= 5) {
      return {
        icon: Award,
        color: Palette.accent,
        title: 'Achievement Hunter! 🏆',
        message: `${achievements.length} achievements unlocked. Amazing progress!`,
      };
    }

    if (weeklyVolume > 50000) {
      return {
        icon: Zap,
        color: Palette.accent,
        title: 'Volume Beast! ⚡',
        message: `${(weeklyVolume / 1000).toFixed(0)}K kg moved this week!`,
      };
    }

    if (recentWorkouts.length > 0) {
      return {
        icon: Target,
        color: Palette.accent,
        title: 'Keep Going! 🎯',
        message: `${recentWorkouts.length} workout${recentWorkouts.length > 1 ? 's' : ''} this week. You got this!`,
      };
    }

    return {
      icon: Zap,
      color: Palette.inkMuted,
      title: 'Ready to Start? 💪',
      message: 'Begin your fitness journey today!',
    };
  }, [workoutLogs, achievements]);

  const Icon = banner.icon;

  return (
    <View style={styles.container}>
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
    padding: Space.lg,
    borderRadius: Radius.lg,
    marginHorizontal: Space.xl,
    marginVertical: Space.md,
    gap: Space.md,
    backgroundColor: Palette.canvasRaised,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Type.bodyStrong,
    color: Palette.ink,
    marginBottom: Space.xs,
  },
  message: {
    ...Type.caption,
    color: Palette.inkMuted,
  },
});
