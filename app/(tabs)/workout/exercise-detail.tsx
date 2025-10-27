import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Play, CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { EXERCISES, MUSCLE_GROUP_COLORS } from '@/mocks/exercises';

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams();
  const exercise = EXERCISES.find(ex => ex.id === params.id);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View 
        style={[
          styles.header,
          { backgroundColor: MUSCLE_GROUP_COLORS[exercise.muscleGroup] + '20' },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>{exercise.name}</Text>
          <View style={styles.headerBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.difficulty}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.equipment}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Targeted Muscles</Text>
        <View style={styles.muscleChips}>
          <View 
            style={[
              styles.muscleChip,
              { backgroundColor: MUSCLE_GROUP_COLORS[exercise.muscleGroup] + '30' },
            ]}
          >
            <Text 
              style={[
                styles.muscleChipText,
                { color: MUSCLE_GROUP_COLORS[exercise.muscleGroup] },
              ]}
            >
              {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} (Primary)
            </Text>
          </View>
          {exercise.secondaryMuscles?.map(muscle => (
            <View 
              key={muscle}
              style={[
                styles.muscleChip,
                { backgroundColor: MUSCLE_GROUP_COLORS[muscle] + '20' },
              ]}
            >
              <Text 
                style={[
                  styles.muscleChipText,
                  { color: MUSCLE_GROUP_COLORS[muscle] },
                ]}
              >
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How To Perform</Text>
        {exercise.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>

      {exercise.tips && exercise.tips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pro Tips</Text>
          {exercise.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <CheckCircle color={Colors.success} size={20} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Training Goals</Text>
        <View style={styles.goalsContainer}>
          {exercise.goals.map(goal => (
            <View key={goal} style={styles.goalChip}>
              <Text style={styles.goalText}>
                {goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {exercise.videoUrl && (
        <View style={styles.section}>
          <TouchableOpacity style={styles.videoButton}>
            <Play color={Colors.white} size={24} />
            <Text style={styles.videoButtonText}>Watch Demo Video</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    padding: 24,
  },
  headerContent: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkGrey,
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.mediumGrey,
    lineHeight: 24,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  muscleChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: Colors.darkGrey,
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: Colors.darkGrey,
    lineHeight: 22,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  videoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  errorText: {
    fontSize: 16,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginTop: 40,
  },
});
