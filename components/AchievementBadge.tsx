import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, Zap, TrendingUp, Target, Flame, Trophy } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import type { Achievement } from '@/types/user';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
}

export default function AchievementBadge({ achievement, size = 'medium' }: AchievementBadgeProps) {
  const iconSize = size === 'small' ? 20 : size === 'medium' ? 28 : 36;
  const containerSize = size === 'small' ? 48 : size === 'medium' ? 64 : 80;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame':
        return Flame;
      case 'zap':
        return Zap;
      case 'trending-up':
        return TrendingUp;
      case 'target':
        return Target;
      case 'trophy':
        return Trophy;
      default:
        return Award;
    }
  };

  const getColor = (category: Achievement['category']) => {
    switch (category) {
      case 'streak':
        return Colors.warning;
      case 'pr':
        return Colors.success;
      case 'milestone':
        return Colors.primary;
      case 'weight':
        return Colors.secondary;
      default:
        return Colors.mediumGrey;
    }
  };

  const Icon = getIcon(achievement.icon);
  const color = getColor(achievement.category);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: containerSize, height: containerSize, backgroundColor: `${color}15` }]}>
        <Icon color={color} size={iconSize} />
      </View>
      <Text style={[styles.title, size === 'small' && styles.titleSmall]}>{achievement.title}</Text>
      {size !== 'small' && (
        <Text style={styles.description}>{achievement.description}</Text>
      )}
      <Text style={styles.date}>
        {new Date(achievement.earnedAt).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    minWidth: 100,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleSmall: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: Colors.mediumGrey,
  },
});
