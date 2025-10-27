import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Star, Calendar, TrendingUp, Dumbbell, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  daysPerWeek: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  rating: number;
  enrolled: number;
  tags: string[];
}

const PROGRAMS: Program[] = [
  {
    id: 'ppl',
    name: 'Push Pull Legs',
    description: 'Classic 6-day split focusing on muscle growth. Separate push, pull, and leg days for optimal recovery and volume.',
    duration: '12 weeks',
    daysPerWeek: 6,
    difficulty: 'intermediate',
    goal: 'Muscle Growth',
    rating: 4.8,
    enrolled: 12543,
    tags: ['Hypertrophy', 'Volume', 'Advanced'],
  },
  {
    id: 'fullbody',
    name: 'Full Body Strength',
    description: 'Perfect for beginners. Train your entire body 3x per week with compound movements.',
    duration: '8 weeks',
    daysPerWeek: 3,
    difficulty: 'beginner',
    goal: 'Strength',
    rating: 4.9,
    enrolled: 28340,
    tags: ['Beginner-Friendly', 'Strength', 'Time-Efficient'],
  },
  {
    id: 'upperlower',
    name: 'Upper Lower Split',
    description: 'Balanced 4-day program alternating upper and lower body. Great for intermediate lifters.',
    duration: '10 weeks',
    daysPerWeek: 4,
    difficulty: 'intermediate',
    goal: 'Balanced Development',
    rating: 4.7,
    enrolled: 15892,
    tags: ['Balanced', 'Progressive Overload', 'Intermediate'],
  },
  {
    id: 'powerbuilding',
    name: 'Powerbuilding Program',
    description: 'Combine powerlifting strength work with bodybuilding hypertrophy training.',
    duration: '12 weeks',
    daysPerWeek: 5,
    difficulty: 'advanced',
    goal: 'Strength & Size',
    rating: 4.6,
    enrolled: 8765,
    tags: ['Strength', 'Hypertrophy', 'Advanced'],
  },
  {
    id: 'athlete',
    name: 'Athletic Performance',
    description: 'Build explosive power, speed, and agility with sport-specific training.',
    duration: '8 weeks',
    daysPerWeek: 4,
    difficulty: 'intermediate',
    goal: 'Athletic Performance',
    rating: 4.5,
    enrolled: 6234,
    tags: ['Power', 'Speed', 'Functional'],
  },
  {
    id: 'bodyweight',
    name: 'Bodyweight Master',
    description: 'No equipment needed. Master calisthenics and build impressive strength using only your body.',
    duration: '10 weeks',
    daysPerWeek: 5,
    difficulty: 'beginner',
    goal: 'Bodyweight Mastery',
    rating: 4.7,
    enrolled: 19283,
    tags: ['No Equipment', 'Calisthenics', 'Flexibility'],
  },
];

export default function ProgramsScreen() {
  const router = useRouter();
  const { addWorkoutPlan } = useUserProfile();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return Colors.success;
      case 'intermediate':
        return Colors.warning;
      case 'advanced':
        return Colors.error;
      default:
        return Colors.mediumGrey;
    }
  };

  const handleEnroll = (program: Program) => {
    const mockPlan = {
      id: `program-${program.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      goals: [program.goal],
      equipment: [],
      daysPerWeek: program.daysPerWeek,
      plan: [
        {
          day: 'Day 1',
          exercises: [
            {
              name: 'Barbell Bench Press',
              sets: 4,
              reps: '8-10',
              notes: 'Compound chest movement',
              restPeriod: '90-120 seconds',
              muscleGroups: ['chest', 'triceps'],
            },
            {
              name: 'Incline Dumbbell Press',
              sets: 3,
              reps: '10-12',
              notes: 'Upper chest focus',
              restPeriod: '60-90 seconds',
              muscleGroups: ['chest'],
            },
            {
              name: 'Cable Flyes',
              sets: 3,
              reps: '12-15',
              notes: 'Chest isolation',
              restPeriod: '60 seconds',
              muscleGroups: ['chest'],
            },
          ],
        },
        {
          day: 'Day 2',
          exercises: [
            {
              name: 'Barbell Back Squat',
              sets: 4,
              reps: '8-10',
              notes: 'Compound leg movement',
              restPeriod: '2-3 minutes',
              muscleGroups: ['quads', 'glutes'],
            },
            {
              name: 'Romanian Deadlift',
              sets: 3,
              reps: '10-12',
              notes: 'Hamstring focus',
              restPeriod: '90 seconds',
              muscleGroups: ['hamstrings', 'glutes'],
            },
            {
              name: 'Leg Press',
              sets: 3,
              reps: '12-15',
              notes: 'Quad focus',
              restPeriod: '60-90 seconds',
              muscleGroups: ['quads'],
            },
          ],
        },
        {
          day: 'Day 3',
          exercises: [
            {
              name: 'Pull-Ups',
              sets: 4,
              reps: '8-10',
              notes: 'Compound back movement',
              restPeriod: '90-120 seconds',
              muscleGroups: ['back', 'biceps'],
            },
            {
              name: 'Barbell Rows',
              sets: 4,
              reps: '10-12',
              notes: 'Back thickness',
              restPeriod: '60-90 seconds',
              muscleGroups: ['back'],
            },
            {
              name: 'Face Pulls',
              sets: 3,
              reps: '15-20',
              notes: 'Rear delts and upper back',
              restPeriod: '60 seconds',
              muscleGroups: ['shoulders', 'back'],
            },
          ],
        },
      ],
    };

    addWorkoutPlan(mockPlan);
    
    Alert.alert(
      'Program Enrolled!',
      `You've successfully enrolled in ${program.name}. Check the "My Program" tab to start your workouts.`,
      [
        {
          text: 'Start Training',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {PROGRAMS.map(program => (
        <View key={program.id} style={styles.programCard}>
          <View style={styles.programHeader}>
            <View style={styles.programHeaderTop}>
              <Text style={styles.programName}>{program.name}</Text>
              <View style={styles.ratingContainer}>
                <Star color={Colors.warning} size={16} fill={Colors.warning} />
                <Text style={styles.ratingText}>{program.rating}</Text>
              </View>
            </View>
            
            <View 
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(program.difficulty) + '20' },
              ]}
            >
              <Text 
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(program.difficulty) },
                ]}
              >
                {program.difficulty.charAt(0).toUpperCase() + program.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.programDescription}>{program.description}</Text>

          <View style={styles.programMeta}>
            <View style={styles.metaItem}>
              <Calendar color={Colors.mediumGrey} size={16} />
              <Text style={styles.metaText}>{program.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Dumbbell color={Colors.mediumGrey} size={16} />
              <Text style={styles.metaText}>{program.daysPerWeek}x/week</Text>
            </View>
            <View style={styles.metaItem}>
              <TrendingUp color={Colors.mediumGrey} size={16} />
              <Text style={styles.metaText}>{program.goal}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {program.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.programFooter}>
            <View style={styles.enrolledContainer}>
              <Award color={Colors.mediumGrey} size={16} />
              <Text style={styles.enrolledText}>
                {program.enrolled.toLocaleString()} enrolled
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.enrollButton}
              onPress={() => handleEnroll(program)}
            >
              <Text style={styles.enrollButtonText}>Enroll Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  programCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  programHeader: {
    marginBottom: 12,
  },
  programHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  programName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 15,
    color: Colors.mediumGrey,
    lineHeight: 22,
    marginBottom: 16,
  },
  programMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
  },
  tagText: {
    fontSize: 12,
    color: Colors.darkGrey,
    fontWeight: '500',
  },
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  enrolledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enrolledText: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  enrollButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  enrollButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});
