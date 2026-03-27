import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { X, CheckCircle, Circle, Plus, Minus, Timer, Calculator, Flame } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';
import type { Exercise, SetLog } from '@/types/user';
import RestTimer from './RestTimer';
import PlateCalculator from './PlateCalculator';

interface WorkoutLoggerProps {
  visible: boolean;
  onClose: () => void;
  workoutPlanId: string;
  dayName: string;
  exercises: Exercise[];
}

export default function WorkoutLogger({ 
  visible, 
  onClose, 
  workoutPlanId,
  dayName,
  exercises 
}: WorkoutLoggerProps) {
  const { addWorkoutLog, getWorkoutLogs } = useUserProfile();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLog[]>>({});
  const [restTimerVisible, setRestTimerVisible] = useState(false);
  const [plateCalcVisible, setPlateCalcVisible] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [showWarmups, setShowWarmups] = useState(true);
  
  // Reset state when modal is closed or workout changes
  React.useEffect(() => {
    if (!visible) {
      setCurrentExerciseIndex(0);
      setExerciseLogs({});
    }
  }, [visible]);
  
  // Reset state when workoutPlanId changes
  React.useEffect(() => {
    setCurrentExerciseIndex(0);
    setExerciseLogs({});
  }, [workoutPlanId]);
  
  // Only get existing logs when component is visible and workoutPlanId is available
  const existingLogs = React.useMemo(() => {
    if (!visible || !workoutPlanId) return [];
    return getWorkoutLogs(workoutPlanId);
  }, [visible, workoutPlanId, getWorkoutLogs]);

  const currentExercise = exercises[currentExerciseIndex];
  const currentExerciseLogs = exerciseLogs[currentExercise?.name] || [];

  // Initialize sets for current exercise if not already done
  React.useEffect(() => {
    if (currentExercise && !exerciseLogs[currentExercise.name]) {
      const workingSets: SetLog[] = Array.from({ length: currentExercise.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: parseInt(currentExercise.reps) || 0,
        completed: false,
      }));
      
      let initialSets = workingSets;
      
      // Check if there's a previous log for this exercise
      const previousLog = existingLogs
        .filter(log => log.exerciseName === currentExercise.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (previousLog && previousLog.sets.length > 0) {
        const workingSets = initialSets.filter(s => !s.isWarmup);
        workingSets.forEach((set, i) => {
          const prevSet = previousLog.sets.find(ps => !ps.isWarmup && ps.setNumber === i + 1);
          if (prevSet) {
            set.weight = prevSet.weight;
            set.reps = prevSet.reps;
          }
        });
        
        if (showWarmups && workingSets.length > 0 && workingSets[0].weight > 0) {
          const workingWeight = workingSets[0].weight;
          const warmupSets: SetLog[] = [
            {
              setNumber: -2,
              weight: workingWeight * 0.4,
              reps: 8,
              completed: false,
              isWarmup: true,
            },
            {
              setNumber: -1,
              weight: workingWeight * 0.6,
              reps: 5,
              completed: false,
              isWarmup: true,
            },
          ];
          initialSets = [...warmupSets, ...workingSets];
        }
      }
      
      setExerciseLogs(prev => ({
        ...prev,
        [currentExercise.name]: initialSets,
      }));
    }
  }, [currentExercise, exerciseLogs, existingLogs]);

  const updateSet = (setIndex: number, field: 'weight' | 'reps', value: number) => {
    if (!currentExercise) return;
    
    setExerciseLogs(prev => ({
      ...prev,
      [currentExercise.name]: prev[currentExercise.name]?.map((set, i) => 
        i === setIndex ? { ...set, [field]: value } : set
      ) || [],
    }));
  };

  const toggleSetComplete = (setIndex: number) => {
    if (!currentExercise) return;
    
    setExerciseLogs(prev => ({
      ...prev,
      [currentExercise.name]: prev[currentExercise.name]?.map((set, i) => 
        i === setIndex ? { ...set, completed: !set.completed } : set
      ) || [],
    }));
    
    const set = currentExerciseLogs[setIndex];
    if (set && !set.completed && !set.isWarmup) {
      setRestTimerVisible(true);
    }
  };
  
  const openPlateCalculator = (weight: number) => {
    setSelectedWeight(weight);
    setPlateCalcVisible(true);
  };

  const handleNext = async () => {
    if (!currentExercise || !workoutPlanId) return;
    
    // Save current exercise log
    const log = {
      id: Date.now().toString(),
      workoutPlanId,
      exerciseName: currentExercise.name,
      date: new Date().toISOString(),
      sets: currentExerciseLogs,
    };
    
    try {
      await addWorkoutLog(log);
    } catch (error) {
      console.error('Error saving workout log:', error);
      return;
    }

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      Alert.alert(
        'Workout Complete!', 
        'Great job! Your workout has been logged.',
        [{ text: 'OK', onPress: onClose }]
      );
    }
  };

  const handleSkip = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      onClose();
    }
  };

  // Don't render anything if not visible or no current exercise
  if (!visible || !currentExercise) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{dayName}</Text>
              <Text style={styles.exerciseProgress}>
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{currentExercise.name}</Text>
              <Text style={styles.exerciseTarget}>
                Target: {currentExercise.sets} sets × {currentExercise.reps} reps
              </Text>
              {currentExercise.notes && (
                <Text style={styles.exerciseNotes}>{currentExercise.notes}</Text>
              )}
            </View>

            <View style={styles.toolsContainer}>
              <TouchableOpacity 
                style={styles.toolButton}
                onPress={() => setRestTimerVisible(true)}
              >
                <Timer color={Colors.primary} size={20} />
                <Text style={styles.toolText}>Rest Timer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.toolButton}
                onPress={() => setShowWarmups(!showWarmups)}
              >
                <Flame color={showWarmups ? Colors.warning : Colors.mediumGrey} size={20} />
                <Text style={styles.toolText}>{showWarmups ? 'Hide' : 'Show'} Warmups</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.setsContainer}>
              {currentExerciseLogs.map((set, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.setRow,
                    set.isWarmup && styles.warmupRow,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.checkButton}
                    onPress={() => toggleSetComplete(index)}
                  >
                    {set.completed ? (
                      <CheckCircle color={Colors.primary} size={24} />
                    ) : (
                      <Circle color={Colors.mediumGrey} size={24} />
                    )}
                  </TouchableOpacity>

                  <Text style={styles.setNumber}>
                    {set.isWarmup ? 'W' : 'Set'} {set.isWarmup ? Math.abs(set.setNumber) : set.setNumber}
                  </Text>

                  <View style={styles.inputGroup}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => updateSet(index, 'weight', Math.max(0, set.weight - 2.5))}
                    >
                      <Minus color={Colors.mediumGrey} size={16} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.numberInput}
                      value={set.weight.toString()}
                      onChangeText={(text) => updateSet(index, 'weight', parseFloat(text) || 0)}
                      keyboardType="decimal-pad"
                    />
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => updateSet(index, 'weight', set.weight + 2.5)}
                    >
                      <Plus color={Colors.mediumGrey} size={16} />
                    </TouchableOpacity>
                    <Text style={styles.unitLabel}>kg</Text>
                    <TouchableOpacity
                      style={styles.calcButton}
                      onPress={() => openPlateCalculator(set.weight)}
                    >
                      <Calculator color={Colors.primary} size={16} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => updateSet(index, 'reps', Math.max(0, set.reps - 1))}
                    >
                      <Minus color={Colors.mediumGrey} size={16} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.numberInput}
                      value={set.reps.toString()}
                      onChangeText={(text) => updateSet(index, 'reps', parseInt(text) || 0)}
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => updateSet(index, 'reps', set.reps + 1)}
                    >
                      <Plus color={Colors.mediumGrey} size={16} />
                    </TouchableOpacity>
                    <Text style={styles.unitLabel}>reps</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Show previous performance */}
            {existingLogs.length > 0 && (
              <View style={styles.previousSection}>
                <Text style={styles.previousTitle}>Previous Performance</Text>
                {existingLogs
                  .filter(log => log.exerciseName === currentExercise.name)
                  .slice(0, 1)
                  .map(log => (
                    <View key={log.id}>
                      <Text style={styles.previousDate}>
                        {new Date(log.date).toLocaleDateString()}
                      </Text>
                      {log.sets.map((set, i) => (
                        <Text key={i} style={styles.previousSet}>
                          Set {set.setNumber}: {set.weight}kg × {set.reps} reps
                        </Text>
                      ))}
                    </View>
                  ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.nextButton,
                currentExerciseLogs.some(s => s.completed) && styles.nextButtonActive
              ]} 
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentExerciseIndex < exercises.length - 1 ? 'Next Exercise' : 'Finish Workout'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <RestTimer
        visible={restTimerVisible}
        onClose={() => setRestTimerVisible(false)}
        initialSeconds={90}
      />
      
      <PlateCalculator
        visible={plateCalcVisible}
        onClose={() => setPlateCalcVisible(false)}
        targetWeight={selectedWeight}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  exerciseProgress: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  exerciseHeader: {
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  exerciseTarget: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  exerciseNotes: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 8,
    fontStyle: 'italic',
  },
  setsContainer: {
    gap: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
  },
  warmupRow: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  toolsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toolButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  toolText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGrey,
  },
  calcButton: {
    padding: 6,
    marginLeft: 4,
  },
  checkButton: {
    padding: 4,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    width: 50,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  adjustButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  numberInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 6,
  },
  unitLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginLeft: 4,
  },
  previousSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
  },
  previousTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  previousDate: {
    fontSize: 12,
    color: Colors.mediumGrey,
    marginBottom: 4,
  },
  previousSet: {
    fontSize: 14,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  skipButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.darkGrey,
    textAlign: 'center',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  nextButtonActive: {
    backgroundColor: Colors.primary,
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});