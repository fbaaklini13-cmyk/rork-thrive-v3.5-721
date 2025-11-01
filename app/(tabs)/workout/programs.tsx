import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Target,
  Calendar,
  TrendingUp,
  Star,
  Users,
  ChevronRight,
  Award,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { PREDEFINED_PROGRAMS, type PredefinedProgram } from '@/mocks/workout-programs';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function ProgramsScreen() {
  const router = useRouter();
  const { addWorkoutPlan } = useUserProfile();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredPrograms = PREDEFINED_PROGRAMS.filter(program => {
    if (selectedFilter === 'all') return true;
    return program.difficulty === selectedFilter;
  });

  const handleEnroll = async (program: PredefinedProgram) => {
    Alert.alert(
      'Enroll in Program',
      `Start "${program.name}"? This will become your active workout plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enroll',
          onPress: async () => {
            const workoutPlan = {
              ...program.workoutPlan,
              id: `program-${program.id}-${Date.now()}`,
              createdAt: new Date().toISOString(),
            };
            await addWorkoutPlan(workoutPlan);
            Alert.alert('Success', `You've enrolled in ${program.name}!`, [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10B981';
      case 'intermediate':
        return '#F59E0B';
      case 'advanced':
        return '#EF4444';
      default:
        return Colors.mediumGrey;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Workout Programs',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextActive,
              ]}
            >
              All Programs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'beginner' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('beginner')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'beginner' && styles.filterChipTextActive,
              ]}
            >
              Beginner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'intermediate' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('intermediate')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'intermediate' && styles.filterChipTextActive,
              ]}
            >
              Intermediate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'advanced' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('advanced')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'advanced' && styles.filterChipTextActive,
              ]}
            >
              Advanced
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>
          Choose from evidence-based programs designed by experts
        </Text>

        {filteredPrograms.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={styles.programCard}
            onPress={() => handleEnroll(program)}
          >
            <View style={styles.programHeader}>
              <View style={styles.programTitleRow}>
                <Text style={styles.programName}>{program.name}</Text>
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
            </View>

            <Text style={styles.programDescription}>{program.description}</Text>

            <View style={styles.programMeta}>
              <View style={styles.metaItem}>
                <Target size={16} color={Colors.mediumGrey} />
                <Text style={styles.metaText}>{program.primaryGoal}</Text>
              </View>

              <View style={styles.metaItem}>
                <Calendar size={16} color={Colors.mediumGrey} />
                <Text style={styles.metaText}>{program.daysPerWeek} days/week</Text>
              </View>

              <View style={styles.metaItem}>
                <TrendingUp size={16} color={Colors.mediumGrey} />
                <Text style={styles.metaText}>{program.duration}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.statText}>{program.rating}</Text>
              </View>

              <View style={styles.statItem}>
                <Users size={16} color={Colors.mediumGrey} />
                <Text style={styles.statText}>{program.enrolled.toLocaleString()} enrolled</Text>
              </View>
            </View>

            <View style={styles.tagsRow}>
              {program.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              {program.keyFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.enrollButton}>
              <Text style={styles.enrollButtonText}>Enroll in Program</Text>
              <ChevronRight size={20} color={Colors.white} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Award size={24} color={Colors.mediumGrey} />
          <Text style={styles.footerText}>
            All programs are based on scientific research and ACSM guidelines
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  filterContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    color: Colors.mediumGrey,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    lineHeight: 22,
  },
  programCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  programHeader: {
    marginBottom: 12,
  },
  programTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  programName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkGrey,
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
    marginBottom: 16,
  },
  programMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.mediumGrey,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.mediumGrey,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  featureBullet: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
    marginRight: 8,
    width: 12,
  },
  featureText: {
    fontSize: 13,
    color: Colors.mediumGrey,
    lineHeight: 18,
    flex: 1,
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  enrollButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: Colors.mediumGrey,
    textAlign: 'center',
    flex: 1,
    lineHeight: 18,
  },
});
