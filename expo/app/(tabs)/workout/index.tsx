import React, { useState, useRef, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import {
  Dumbbell,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Play,
  X,
  Plus,
  BookOpen,
  LibraryBig,
  TrendingUp,
  RefreshCw,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/user-profile-store';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import { AIService } from '@/services/ai-service';
import WorkoutLogger, { type WorkoutCompletionLog } from '@/components/WorkoutLogger';
import ExerciseReplacementModal from '@/components/ExerciseReplacementModal';
import WorkoutCompletionSummary from '@/components/WorkoutCompletionSummary';
import MotivationalBanner from '@/components/MotivationalBanner';
import AchievementBadge from '@/components/AchievementBadge';
import { countSessions, nextDayIndex } from '@/lib/workout-sessions';

/**
 * Workout tab, Option C (decided 24 Sep): one screen that opens on TODAY'S SESSION --
 * the next day of the current plan, with Start front and centre -- and a list
 * underneath (Programs, Exercise library, Progress) in the same row pattern as
 * Home's "More". "Browse Exercises" folds into Exercise library (the same
 * exercises, two entry points). The heatmap, benchmarks and export that used to
 * sit at the bottom of this screen live on Progress, one row away.
 */

function ListRow({ icon: Icon, title, description, onPress, last }: {
  icon: React.ComponentType<any>; title: string; description: string; onPress: () => void; last?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress(); }}
      style={[styles.row, last && styles.rowLast]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.rowIcon}><Icon size={20} color={Palette.accent} /></View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <ChevronRight size={18} color={Palette.inkFaint} />
    </TouchableOpacity>
  );
}

export default function WorkoutScreen() {
  const router = useRouter();
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
  const [lastWorkoutLog, setLastWorkoutLog] = useState<WorkoutCompletionLog | null>(null);
  const pendingSummaryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pendingSummaryTimer.current) clearTimeout(pendingSummaryTimer.current);
    };
  }, []);

  const latestPlan = workoutPlans[workoutPlans.length - 1];
  // Option C (Freddy, 24 Sep): the tab opens on the session you are about to do.
  const nextIndex = latestPlan ? nextDayIndex(latestPlan, workoutLogs) : 0;
  const nextDay = latestPlan?.plan[nextIndex];
  const sessionsDone = latestPlan ? countSessions(workoutLogs, latestPlan.id) : 0;
  const programLength = latestPlan ? latestPlan.daysPerWeek * 12 : 0;
  const tap = () => Haptics.selectionAsync().catch(() => {});

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

  const handleFinishWorkout = (workoutLog?: WorkoutCompletionLog | unknown) => {
    // Only a real completion log opens the summary. The logger's close button /
    // back gesture call onClose with a press event (or nothing), and that must
    // not pop an empty summary.
    const log =
      workoutLog && typeof workoutLog === 'object' && Array.isArray((workoutLog as WorkoutCompletionLog).exercises)
        ? (workoutLog as WorkoutCompletionLog)
        : null;

    // Close the logger first ...
    setActiveWorkout(null);

    if (!log) return;

    // ... and only present the summary once the logger modal (and, on iOS, the
    // "Workout Complete!" alert) has finished animating out. Mounting a second
    // <Modal> in the same render as the first one is being dismissed makes iOS
    // silently drop the new presentation, which is why the summary never
    // appeared after a workout.
    if (pendingSummaryTimer.current) clearTimeout(pendingSummaryTimer.current);
    pendingSummaryTimer.current = setTimeout(() => {
      pendingSummaryTimer.current = null;
      setLastWorkoutLog(log);
      setShowCompletionSummary(true);
    }, Platform.OS === 'ios' ? 600 : 150);
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
          title: 'Workout',
          headerStyle: { backgroundColor: Palette.canvas },
          headerTintColor: Palette.ink,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's session */}
        <Text style={styles.eyebrow}>Today&apos;s session</Text>
        {latestPlan && nextDay ? (
          <View style={styles.hero}>
            <Text style={styles.title}>{nextDay.day}</Text>
            <Text style={styles.caption}>
              {nextDay.exercises.length} exercise{nextDay.exercises.length === 1 ? '' : 's'}
              {nextDay.focus ? ` · ${nextDay.focus}` : ''}
            </Text>
            <Text style={styles.sessionCount}>
              Session {Math.min(sessionsDone + 1, programLength)} of {programLength} in this program
            </Text>
            <TouchableOpacity
              style={styles.primary}
              activeOpacity={0.85}
              onPress={() => { tap(); handleStartWorkout(latestPlan.id, nextIndex); }}
              accessibilityRole="button"
              accessibilityLabel={`Start ${nextDay.day}`}
            >
              <Play color={Palette.canvas} size={18} fill={Palette.canvas} />
              <Text style={styles.primaryText}>Start workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.hero}>
            <Text style={styles.title}>No plan yet</Text>
            <Text style={styles.caption}>Create a plan and your next session will appear here.</Text>
            <TouchableOpacity
              style={styles.primary}
              activeOpacity={0.85}
              onPress={() => { tap(); setShowAIGenerator(true); }}
              accessibilityRole="button"
            >
              <Plus color={Palette.canvas} size={18} />
              <Text style={styles.primaryText}>Create a plan</Text>
            </TouchableOpacity>
          </View>
        )}

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

        {/* The list */}
        <View style={styles.card}>
          <ListRow icon={BookOpen} title="Programs" description="Structured plans to follow week by week" onPress={() => router.push('/workout/programs')} />
          <ListRow icon={LibraryBig} title="Exercise library" description="Every exercise, with how-to and muscles worked" onPress={() => router.push('/workout/exercise-library')} />
          <ListRow icon={TrendingUp} title="Progress" description="Frequency, volume, heatmap and export" onPress={() => router.push('/workout/progress')} last />
        </View>

        {/* The whole plan */}
        {latestPlan && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.eyebrowMuted}>This plan · {latestPlan.goals[0] || 'General fitness'} · {latestPlan.daysPerWeek} days/week</Text>
            </View>
            {latestPlan.plan.map((day, dayIndex) => (
              <View key={dayIndex} style={[styles.day, dayIndex === latestPlan.plan.length - 1 && styles.rowLast]}>
                <TouchableOpacity
                  style={styles.dayHeader}
                  onPress={() => toggleDayExpansion(dayIndex)}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.day}, ${expandedDays[dayIndex] ? 'collapse' : 'expand'}`}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{day.day}</Text>
                    <Text style={styles.rowDescription}>
                      {day.exercises.length} exercises{dayIndex === nextIndex ? ' · next up' : ''}
                    </Text>
                  </View>
                  {expandedDays[dayIndex] ? (
                    <ChevronUp color={Palette.inkMuted} size={20} />
                  ) : (
                    <ChevronDown color={Palette.inkMuted} size={20} />
                  )}
                </TouchableOpacity>

                {expandedDays[dayIndex] && (
                  <View style={styles.exercisesList}>
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <View key={exerciseIndex} style={styles.exercise}>
                        <View style={styles.rowText}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseMeta}>
                            {exercise.sets} sets × {exercise.reps} · rest {exercise.restPeriod}
                          </Text>
                          {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                            <Text style={styles.exerciseMuscles}>{exercise.muscleGroups.join(', ')}</Text>
                          )}
                          {exercise.notes ? <Text style={styles.exerciseNotes}>{exercise.notes}</Text> : null}
                        </View>
                        <TouchableOpacity
                          style={styles.replaceButton}
                          onPress={() => handleReplaceExercise(latestPlan.id, dayIndex, exerciseIndex)}
                          accessibilityRole="button"
                          accessibilityLabel={`Replace ${exercise.name}`}
                        >
                          <RefreshCw color={Palette.inkMuted} size={16} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => { tap(); handleStartWorkout(latestPlan.id, dayIndex); }}
                      accessibilityRole="button"
                    >
                      <Play color={Palette.ink} size={16} />
                      <Text style={styles.secondaryText}>Start this day instead</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {latestPlan && (
          <TouchableOpacity style={styles.linkButton} onPress={() => setShowAIGenerator(true)} accessibilityRole="button">
            <Plus color={Palette.accent} size={16} />
            <Text style={styles.link}>Create a new plan</Text>
          </TouchableOpacity>
        )}

        {!latestPlan && (
          <View style={styles.emptyState}>
            <Dumbbell color={Palette.inkFaint} size={40} />
          </View>
        )}

        <View style={styles.footerSpace} />
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

      <Modal
        visible={showAIGenerator}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAIGenerator(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Generate a plan</Text>
              <TouchableOpacity
                onPress={() => setShowAIGenerator(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X color={Palette.inkMuted} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Fitness goals</Text>
              <TextInput
                style={styles.textInput}
                value={fitnessGoals}
                onChangeText={setFitnessGoals}
                placeholder="Build muscle, lose fat, strength..."
                placeholderTextColor={Palette.inkFaint}
                multiline
              />

              <Text style={styles.inputLabel}>Available equipment</Text>
              <TextInput
                style={styles.textInput}
                value={availableEquipment}
                onChangeText={setAvailableEquipment}
                placeholder="Dumbbells, resistance bands, none..."
                placeholderTextColor={Palette.inkFaint}
                multiline
              />

              <Text style={styles.inputLabel}>Days per week</Text>
              <TextInput
                style={styles.textInput}
                value={daysPerWeek}
                onChangeText={setDaysPerWeek}
                placeholder="3"
                placeholderTextColor={Palette.inkFaint}
                keyboardType="number-pad"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.secondary, styles.modalButton]} onPress={() => setShowAIGenerator(false)}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primary, styles.modalButton, isGenerating && styles.disabled]}
                onPress={handleGenerateWorkout}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color={Palette.canvas} />
                ) : (
                  <Text style={styles.primaryText}>Generate plan</Text>
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
  container: { flex: 1, backgroundColor: Palette.canvas },
  scroll: { flex: 1 },
  content: { paddingTop: Space.lg },

  eyebrow: { ...Type.eyebrow, color: Palette.accent, marginHorizontal: Space.xl },
  eyebrowMuted: { ...Type.eyebrow, color: Palette.inkMuted, marginBottom: Space.sm },
  title: { ...Type.title, color: Palette.ink, marginTop: Space.xs },
  caption: { ...Type.caption, color: Palette.inkMuted, marginTop: Space.sm },
  sessionCount: { ...Type.caption, color: Palette.inkFaint, marginTop: Space.xs, fontVariant: Type.numeral.fontVariant },

  hero: { marginHorizontal: Space.xl, marginBottom: Space.md },
  primary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: Space.lg, marginTop: Space.xl,
    shadowColor: Palette.accent, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
  },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
  secondary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    borderRadius: Radius.pill, paddingVertical: Space.md, borderWidth: 1, borderColor: Palette.lineStrong, marginTop: Space.md,
  },
  secondaryText: { ...Type.bodyStrong, color: Palette.ink },
  disabled: { opacity: 0.6 },

  achievementsRow: { paddingHorizontal: Space.xl, marginBottom: Space.md },

  card: {
    marginHorizontal: Space.xl, marginTop: Space.lg,
    backgroundColor: Palette.canvasRaised, borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line, padding: Space.lg,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },

  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Space.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.line,
  },
  rowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  rowIcon: {
    width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Palette.canvas,
    alignItems: 'center', justifyContent: 'center', marginRight: Space.md,
  },
  rowText: { flex: 1 },
  rowTitle: { ...Type.bodyStrong, color: Palette.ink },
  rowDescription: { ...Type.caption, color: Palette.inkMuted, marginTop: 2 },

  day: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.line, paddingVertical: Space.md },
  dayHeader: { flexDirection: 'row', alignItems: 'center' },
  exercisesList: { marginTop: Space.md },
  exercise: {
    flexDirection: 'row', alignItems: 'flex-start', paddingVertical: Space.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line,
  },
  exerciseName: { ...Type.bodyStrong, color: Palette.ink },
  exerciseMeta: { ...Type.caption, color: Palette.inkMuted, marginTop: 2, fontVariant: Type.numeral.fontVariant },
  exerciseMuscles: { ...Type.caption, color: Palette.inkFaint, marginTop: 2 },
  exerciseNotes: { ...Type.caption, color: Palette.inkMuted, marginTop: Space.xs, fontStyle: 'italic' },
  replaceButton: { padding: Space.sm, marginLeft: Space.sm },

  linkButton: { flexDirection: 'row', alignItems: 'center', gap: Space.xs, marginHorizontal: Space.xl, marginTop: Space.lg },
  link: { ...Type.caption, color: Palette.accent },

  emptyState: { alignItems: 'center', marginTop: Space.xxl },
  footerSpace: { height: Space.xxxl },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Palette.canvasRaised, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    maxHeight: '85%', borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Space.xl,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.line,
  },
  modalTitle: { ...Type.heading, color: Palette.ink },
  modalBody: { padding: Space.xl },
  inputLabel: { ...Type.caption, color: Palette.inkMuted, marginBottom: Space.sm, marginTop: Space.md },
  textInput: {
    backgroundColor: Palette.canvas, borderRadius: Radius.md, borderWidth: 1, borderColor: Palette.line,
    padding: Space.md, color: Palette.ink, ...Type.body, minHeight: 48,
  },
  modalFooter: {
    flexDirection: 'row', gap: Space.md, padding: Space.xl,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line,
  },
  modalButton: { flex: 1, marginTop: 0 },
});
