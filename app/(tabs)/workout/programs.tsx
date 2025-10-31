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
import { PREDEFINED_PROGRAMS } from '@/mocks/workout-programs';

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

  const handleEnroll = async (program: typeof PREDEFINED_PROGRAMS[0]) => {
    const workoutPlan = {
      id: `program-${program.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...program.workoutPlan,
    };

    await addWorkoutPlan(workoutPlan);
    
    Alert.alert(
      'Program Enrolled!',
      `You've successfully enrolled in ${program.name}. Check the workout tab to start your training!`,
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Evidence-Based Programs</Text>
        <Text style={styles.headerSubtitle}>
          Choose from scientifically-backed workout routines designed for different goals and experience levels.
        </Text>
      </View>
      {PREDEFINED_PROGRAMS.map(program => (
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
                {program.experienceLevel}
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
              <Text style={styles.metaText}>{program.primaryGoal}</Text>
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
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
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
