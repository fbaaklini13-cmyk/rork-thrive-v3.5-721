import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { 
  Target, 
  Dumbbell, 
  Calendar, 
  ChevronDown,
  ChevronUp,
  Play,
  X,
  Plus,
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useUserProfile } from '@/hooks/user-profile-store';
import { Colors } from '@/constants/colors';
import { AIService } from '@/services/ai-service';
import WorkoutLogger from '@/components/WorkoutLogger';
import ExerciseReplacementModal from '@/components/ExerciseReplacementModal';
import WorkoutCompletionSummary from '@/components/WorkoutCompletionSummary';
import MuscleHeatmap from '@/components/MuscleHeatmap';
import MotivationalBanner from '@/components/MotivationalBanner';
import AchievementBadge from '@/components/AchievementBadge';
import StrengthBenchmark from '@/components/StrengthBenchmark';
import DataExportModal from '@/components/DataExportModal';
import ProgramProgressBar from '@/components/ProgramProgressBar';



export default function WorkoutScreen() {
  const { workoutPlans, workoutLogs, profile, addWorkoutPlan, replaceExerciseInPlan, achievements } = useUserProfile();
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [availableEquipment, setAvailableEquipment] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [activeWorkout, setActiveWorkout] = useState<{ planId: string; dayIndex: number } | null>(null);
  const [showExerciseReplacement, setShowExerciseReplacement] = useState<{ planId: string; dayIndex: number; exerciseIndex: number } | null>(null);
  const [showCompletionSummary, setShowCompletionSummary] = useState(false);
  const [lastWorkoutLog, setLastWorkoutLog] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const latestPlan = workoutPlans[workoutPlans.length - 1];

  const toggleDayExpansion = (dayIndex: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const handleGenerateWorkout = async () => {
    if (!fitnessGoals.trim()) {
      Alert.alert('Enter Goals', 'Please enter your fitness goals');
      return;
    }

    setIsGenerating(true);
    try {
      const goalsArray = fitnessGoals.split(',').map(g => g.trim()).filter(g => g);
      const equipmentArray = availableEquipment.split(',').map(e => e.trim()).filter(e => e);
      const days = parseInt(daysPerWeek) || 3;
      
      const plan = await AIService.generateWorkoutPlan(
        goalsArray,
        equipmentArray.length > 0 ? equipmentArray : ['bodyweight'],
        days,
        profile
      );
      await addWorkoutPlan(plan);
      setShowAIGenerator(false);
      setFitnessGoals('');
      setAvailableEquipment('');
      setDaysPerWeek('3');
      setExpandedDays({});
      Alert.alert('Success', 'Your workout plan has been generated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartWorkout = (planId: string, dayIndex: number) => {
    setActiveWorkout({ planId, dayIndex });
  };

  const handleFinishWorkout = (workoutLog?: any) => {
    if (workoutLog) {
      setLastWorkoutLog(workoutLog);
      setShowCompletionSummary(true);
    }
    setActiveWorkout(null);
  };

  const handleReplaceExercise = (planId: string, dayIndex: number, exerciseIndex: number) => {
    setShowExerciseReplacement({ planId, dayIndex, exerciseIndex });
  };

  const handleExerciseSelected = async (newExercise: any) => {
    if (!showExerciseReplacement) return;
    
    await replaceExerciseInPlan(
      showExerciseReplacement.planId,
      showExerciseReplacement.dayIndex,
      showExerciseReplacement.exerciseIndex,
      newExercise
    );
    setShowExerciseReplacement(null);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Workout Planner',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MotivationalBanner />
        
        {achievements.length > 0 && (
          <View style={styles.achievementsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {achievements.slice(-3).map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </ScrollView>
          </View>
        )}

        {latestPlan && (
          <View style={{ marginHorizontal: 20, marginBottom: 12 }}>
            <ProgramProgressBar
              program={latestPlan}
              completedWorkouts={workoutLogs.filter(log => log.workoutPlanId === latestPlan.id).length}
              totalWorkouts={latestPlan.daysPerWeek * 12}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowAIGenerator(true)}
        >
          <Plus color={Colors.white} size={20} />
          <Text style={styles.createButtonText}>Create New Plan</Text>
        </TouchableOpacity>
        {!latestPlan ? (
          <View style={styles.emptyState}>
            <Dumbbell color={Colors.mediumGrey} size={64} />
            <Text style={styles.emptyTitle}>No Workout Plans</Text>
            <Text style={styles.emptyText}>
              Create your first AI-generated workout plan
            </Text>
          </View>
        ) : (
          <View style={styles.programContent}>
            <Text style={styles.sectionTitle}>Current Workout Plan</Text>

            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <Target color={Colors.primary} size={20} />
                <Text style={styles.planGoal}>{latestPlan.goals[0] || 'General Fitness'}</Text>
              </View>
              <View style={styles.planMeta}>
                <Calendar color={Colors.mediumGrey} size={14} />
                <Text style={styles.planMetaText}>{latestPlan.daysPerWeek} days/week</Text>
              </View>
            </View>

            {latestPlan.plan.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.dayContainer}>
                <TouchableOpacity
                  style={styles.dayHeader}
                  onPress={() => toggleDayExpansion(dayIndex)}
                >
                  <Text style={styles.dayTitle}>{day.day}</Text>
                  {expandedDays[dayIndex] ? (
                    <ChevronUp color={Colors.mediumGrey} size={24} />
                  ) : (
                    <ChevronDown color={Colors.mediumGrey} size={24} />
                  )}
                </TouchableOpacity>

                {expandedDays[dayIndex] && (
                  <View style={styles.exercisesList}>
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <View key={exerciseIndex} style={styles.exerciseCard}>
                        <View style={styles.exerciseHeader}>
                          <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.exerciseSets}>
                              {exercise.sets} sets × {exercise.reps}
                            </Text>
                            <Text style={styles.exerciseRest}>Rest: {exercise.restPeriod}</Text>
                            {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                              <Text style={styles.exerciseMuscles}>
                                {exercise.muscleGroups.join(', ')}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity
                            style={styles.replaceButton}
                            onPress={() => handleReplaceExercise(latestPlan.id, dayIndex, exerciseIndex)}
                          >
                            <Text style={styles.replaceIcon}>🔄</Text>
                          </TouchableOpacity>
                        </View>
                        {exercise.notes && (
                          <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                        )}
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.startWorkoutButton}
                      onPress={() => handleStartWorkout(latestPlan.id, dayIndex)}
                    >
                      <Play color={Colors.white} size={18} fill={Colors.white} />
                      <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress & Stats</Text>
          
          <MuscleHeatmap timeRange="30d" />
          
          <StrengthBenchmark />
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => setShowExportModal(true)}
          >
            <Text style={styles.exportButtonText}>Export Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>



      {activeWorkout && (
        <WorkoutLogger
          visible={true}
          onClose={handleFinishWorkout}
          workoutPlanId={activeWorkout.planId}
          dayName={workoutPlans.find(p => p.id === activeWorkout.planId)?.plan[activeWorkout.dayIndex]?.day || ''}
          exercises={workoutPlans.find(p => p.id === activeWorkout.planId)?.plan[activeWorkout.dayIndex]?.exercises || []}
        />
      )}

      {showExerciseReplacement && (
        <ExerciseReplacementModal
          visible={true}
          onClose={() => setShowExerciseReplacement(null)}
          exercise={workoutPlans.find(p => p.id === showExerciseReplacement.planId)?.plan[showExerciseReplacement.dayIndex]?.exercises[showExerciseReplacement.exerciseIndex]}
          planId={showExerciseReplacement.planId}
          dayIndex={showExerciseReplacement.dayIndex}
          exerciseIndex={showExerciseReplacement.exerciseIndex}
          onReplace={handleExerciseSelected}
        />
      )}

      {showCompletionSummary && lastWorkoutLog && (
        <WorkoutCompletionSummary
          visible={true}
          onClose={() => {
            setShowCompletionSummary(false);
            setLastWorkoutLog(null);
          }}
          workoutName={lastWorkoutLog.dayName || 'Workout'}
          totalDuration={lastWorkoutLog.duration || 60}
          exercises={lastWorkoutLog.exercises || []}
        />
      )}

      {showExportModal && (
        <DataExportModal
          visible={true}
          onClose={() => setShowExportModal(false)}
        />
      )}


      <Modal
        visible={showAIGenerator}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAIGenerator(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Generate Workout Plan</Text>
              <TouchableOpacity onPress={() => setShowAIGenerator(false)}>
                <X color={Colors.darkGrey} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Fitness Goals</Text>
              <TextInput
                style={styles.textInput}
                value={fitnessGoals}
                onChangeText={setFitnessGoals}
                placeholder="Build muscle, lose fat, strength..."
                placeholderTextColor={Colors.mediumGrey}
                multiline
              />

              <Text style={styles.inputLabel}>Available Equipment</Text>
              <TextInput
                style={styles.textInput}
                value={availableEquipment}
                onChangeText={setAvailableEquipment}
                placeholder="Dumbbells, resistance bands, none..."
                placeholderTextColor={Colors.mediumGrey}
                multiline
              />

              <Text style={styles.inputLabel}>Days Per Week</Text>
              <TextInput
                style={styles.textInput}
                value={daysPerWeek}
                onChangeText={setDaysPerWeek}
                placeholder="3"
                placeholderTextColor={Colors.mediumGrey}
                keyboardType="number-pad"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAIGenerator(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  isGenerating && styles.generateButtonDisabled,
                ]}
                onPress={handleGenerateWorkout}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.generateButtonText}>Generate Plan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  achievementsRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planGoal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planMetaText: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  dayContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exercisesList: {
    padding: 16,
    paddingTop: 0,
  },
  exerciseCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  exerciseSets: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  exerciseRest: {
    fontSize: 12,
    color: Colors.mediumGrey,
    marginBottom: 4,
  },
  exerciseMuscles: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  replaceButton: {
    padding: 4,
  },
  replaceIcon: {
    fontSize: 20,
  },
  exerciseNotes: {
    fontSize: 13,
    color: Colors.mediumGrey,
    fontStyle: 'italic',
    marginTop: 8,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  startWorkoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  progressSection: {
    padding: 20,
  },
  exportButton: {
    backgroundColor: Colors.lightGrey,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: 4,
    minHeight: 48,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.darkGrey,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGrey,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  scrollContent: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.mediumGrey,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  aiGenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  aiGenerateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  browseProgramsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  browseProgramsButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  programHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
  },
  aiButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  programContent: {
    paddingBottom: 20,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  programCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  programGoals: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  programGoalsText: {
    fontSize: 16,
    color: Colors.darkGrey,
    fontWeight: '500',
    flex: 1,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  programMetaText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dayIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  dayExercises: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  exploreHeader: {
    marginBottom: 20,
  },
  exploreTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  exploreSubtitle: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  muscleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  muscleEmoji: {
    fontSize: 28,
  },
  muscleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  exploreSection: {
    gap: 12,
  },
  allExercisesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  allExercisesContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  allExercisesText: {
    flex: 1,
  },
  allExercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  allExercisesDescription: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  detailedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.mediumGrey,
    textAlign: 'center',
  },
  progressPrompt: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressPromptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  progressPromptText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
    marginBottom: 16,
  },
  viewDetailsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
    marginTop: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
  },
  optionChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  optionChipTextSelected: {
    color: Colors.white,
  },
  daysSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  dayButtonTextSelected: {
    color: Colors.white,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
