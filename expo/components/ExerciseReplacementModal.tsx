import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { X, RefreshCw, Target, Clock, Dumbbell, Plus, Edit3 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { AIService } from '@/services/ai-service';
import { useUserProfile } from '@/hooks/user-profile-store';

interface ExerciseReplacementModalProps {
  visible: boolean;
  onClose: () => void;
  exercise: any;
  planId: string;
  dayIndex: number;
  exerciseIndex: number;
  onReplace: (newExercise: any) => void;
}

export default function ExerciseReplacementModal({
  visible,
  onClose,
  exercise,
  planId,
  dayIndex,
  exerciseIndex,
  onReplace,
}: ExerciseReplacementModalProps) {
  const { profile, workoutPlans } = useUserProfile();
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customSets, setCustomSets] = useState('');
  const [customReps, setCustomReps] = useState('');
  const [customRestPeriod, setCustomRestPeriod] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  const currentPlan = workoutPlans.find(p => p.id === planId);
  const equipment = currentPlan?.equipment || [];

  useEffect(() => {
    if (visible && exercise) {
      generateAlternatives();
    }
  }, [visible, exercise]);

  const generateAlternatives = async () => {
    if (!exercise) return;
    
    // Check if AI is enabled, if not use fallback alternatives
    if (!profile?.aiEnabled) {
      // Provide some default alternatives when AI is disabled
      const defaultAlternatives = [
        {
          name: "Dumbbell Variation",
          sets: exercise.sets || 3,
          reps: exercise.reps || "8-12",
          restPeriod: exercise.restPeriod || "60-90 seconds",
          notes: "Use dumbbells for this variation",
          muscleGroups: exercise.muscleGroups || ['General'],
          difficulty: "Intermediate",
          equipment: "Dumbbells"
        },
        {
          name: "Bodyweight Alternative",
          sets: exercise.sets || 3,
          reps: exercise.reps || "10-15",
          restPeriod: exercise.restPeriod || "45-60 seconds",
          notes: "No equipment needed",
          muscleGroups: exercise.muscleGroups || ['General'],
          difficulty: "Beginner",
          equipment: "None"
        },
        {
          name: "Cable Machine Variation",
          sets: exercise.sets || 3,
          reps: exercise.reps || "10-12",
          restPeriod: exercise.restPeriod || "60 seconds",
          notes: "Use cable machine for constant tension",
          muscleGroups: exercise.muscleGroups || ['General'],
          difficulty: "Intermediate",
          equipment: "Cable Machine"
        }
      ];
      setAlternatives(defaultAlternatives);
      return;
    }

    setIsLoading(true);
    try {
      const muscleGroups = exercise.muscleGroups || ['General'];
      const alternativeExercises = await AIService.generateExerciseAlternatives(
        exercise.name,
        muscleGroups,
        equipment,
        profile
      );
      
      // Ensure we have valid alternatives
      if (alternativeExercises && alternativeExercises.length > 0) {
        setAlternatives(alternativeExercises);
      } else {
        // If no alternatives returned, show a message
        console.log('No alternatives generated, using defaults');
        setAlternatives([]);
      }
    } catch (error) {
      console.error('Error generating alternatives:', error);
      // Don't show alert for network errors, the service already provides fallbacks
      setAlternatives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplaceExercise = (newExercise: any) => {
    const replacementExercise = {
      name: newExercise.name,
      sets: newExercise.sets || exercise.sets,
      reps: newExercise.reps || exercise.reps,
      restPeriod: newExercise.restPeriod || exercise.restPeriod,
      notes: newExercise.notes || exercise.notes,
      muscleGroups: newExercise.muscleGroups || exercise.muscleGroups,
      alternatives: newExercise.alternatives || exercise.alternatives,
    };
    
    onReplace(replacementExercise);
    onClose();
  };

  const generateCustomExerciseDetails = async (exerciseName: string) => {
    if (!profile?.aiEnabled) {
      // Default values when AI is disabled
      return {
        sets: '3',
        reps: '8-12',
        restPeriod: '60-90 seconds'
      };
    }

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a fitness expert. Given an exercise name, provide optimal sets, reps, and rest period. Respond in JSON format with keys: sets (number), reps (string like "8-12" or "10"), restPeriod (string like "60-90 seconds").'
            },
            {
              role: 'user',
              content: `What are the optimal sets, reps, and rest period for: ${exerciseName}?`
            }
          ]
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.completion);
      
      return {
        sets: parsed.sets?.toString() || '3',
        reps: parsed.reps || '8-12',
        restPeriod: parsed.restPeriod || '60-90 seconds'
      };
    } catch (error) {
      console.error('Error generating exercise details:', error);
      return {
        sets: '3',
        reps: '8-12',
        restPeriod: '60-90 seconds'
      };
    }
  };

  const handleCustomExerciseNameChange = async (name: string) => {
    setCustomExerciseName(name);
    
    if (name.trim().length > 2) {
      setIsGeneratingCustom(true);
      const details = await generateCustomExerciseDetails(name.trim());
      setCustomSets(details.sets);
      setCustomReps(details.reps);
      setCustomRestPeriod(details.restPeriod);
      setIsGeneratingCustom(false);
    }
  };

  const handleCustomExercise = () => {
    if (!customExerciseName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    const customExercise = {
      name: customExerciseName.trim(),
      sets: customSets || exercise.sets,
      reps: customReps || exercise.reps,
      restPeriod: customRestPeriod || exercise.restPeriod,
      notes: `Custom exercise: ${customExerciseName.trim()}`,
      muscleGroups: exercise.muscleGroups,
      alternatives: exercise.alternatives,
    };

    handleReplaceExercise(customExercise);
    resetCustomForm();
  };

  const resetCustomForm = () => {
    setCustomExerciseName('');
    setCustomSets('');
    setCustomReps('');
    setCustomRestPeriod('');
    setShowCustomInput(false);
  };

  const resetModal = () => {
    resetCustomForm();
  };

  useEffect(() => {
    if (!visible) {
      resetModal();
    }
  }, [visible]);

  if (!visible || !exercise) return null;

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
            <View style={styles.headerLeft}>
              <RefreshCw color={Colors.primary} size={24} />
              <Text style={styles.modalTitle}>Replace Exercise</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentExercise}>
            <Text style={styles.currentTitle}>Current Exercise</Text>
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                  <Dumbbell color={Colors.mediumGrey} size={16} />
                  <Text style={styles.detailText}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                </View>
                {exercise.restPeriod && (
                  <View style={styles.detailItem}>
                    <Clock color={Colors.mediumGrey} size={16} />
                    <Text style={styles.detailText}>{exercise.restPeriod}</Text>
                  </View>
                )}
                {exercise.muscleGroups && (
                  <View style={styles.detailItem}>
                    <Target color={Colors.mediumGrey} size={16} />
                    <Text style={styles.detailText}>
                      {exercise.muscleGroups.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <ScrollView style={styles.alternativesContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.alternativesHeader}>
              <Text style={styles.alternativesTitle}>Alternative Exercises</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => setShowCustomInput(!showCustomInput)}
                >
                  <Edit3 color={Colors.primary} size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={generateAlternatives}
                  disabled={isLoading}
                >
                  <RefreshCw 
                    color={Colors.primary} 
                    size={20} 
                    style={isLoading ? styles.spinning : undefined}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {showCustomInput && (
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>Create Custom Exercise</Text>
                
                <View style={styles.customInputRow}>
                  <TextInput
                    style={styles.exerciseNameInput}
                    placeholder="Exercise name..."
                    placeholderTextColor={Colors.mediumGrey}
                    value={customExerciseName}
                    onChangeText={handleCustomExerciseNameChange}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {isGeneratingCustom && (
                    <ActivityIndicator 
                      size="small" 
                      color={Colors.primary} 
                      style={styles.generatingIndicator}
                    />
                  )}
                </View>

                <View style={styles.customDetailsRow}>
                  <View style={styles.customDetailInput}>
                    <Text style={styles.detailLabel}>Sets</Text>
                    <TextInput
                      style={styles.smallInput}
                      placeholder="3"
                      placeholderTextColor={Colors.mediumGrey}
                      value={customSets}
                      onChangeText={setCustomSets}
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                  </View>
                  
                  <View style={styles.customDetailInput}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <TextInput
                      style={styles.smallInput}
                      placeholder="8-12"
                      placeholderTextColor={Colors.mediumGrey}
                      value={customReps}
                      onChangeText={setCustomReps}
                      returnKeyType="next"
                    />
                  </View>
                  
                  <View style={styles.customDetailInput}>
                    <Text style={styles.detailLabel}>Rest</Text>
                    <TextInput
                      style={styles.smallInput}
                      placeholder="60s"
                      placeholderTextColor={Colors.mediumGrey}
                      value={customRestPeriod}
                      onChangeText={setCustomRestPeriod}
                      returnKeyType="done"
                      onSubmitEditing={handleCustomExercise}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.addCustomButton,
                    !customExerciseName.trim() && styles.addButtonDisabled
                  ]}
                  onPress={handleCustomExercise}
                  disabled={!customExerciseName.trim()}
                >
                  <Plus 
                    color={customExerciseName.trim() ? Colors.white : Colors.mediumGrey} 
                    size={20} 
                  />
                  <Text style={[
                    styles.addCustomButtonText,
                    !customExerciseName.trim() && styles.addButtonTextDisabled
                  ]}>
                    Add Custom Exercise
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Generating alternatives...</Text>
              </View>
            ) : alternatives.length > 0 ? (
              <View style={styles.alternativesList}>
                {alternatives.map((alt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.alternativeCard}
                    onPress={() => handleReplaceExercise(alt)}
                  >
                    <View style={styles.alternativeHeader}>
                      <Text style={styles.alternativeName}>{alt.name}</Text>
                      {alt.difficulty && (
                        <View style={[
                          styles.difficultyBadge,
                          alt.difficulty === 'Beginner' && styles.beginnerBadge,
                          alt.difficulty === 'Intermediate' && styles.intermediateBadge,
                          alt.difficulty === 'Advanced' && styles.advancedBadge,
                        ]}>
                          <Text style={styles.difficultyText}>{alt.difficulty}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.alternativeDetails}>
                      <View style={styles.detailItem}>
                        <Dumbbell color={Colors.mediumGrey} size={14} />
                        <Text style={styles.smallDetailText}>
                          {alt.sets} sets × {alt.reps} reps
                        </Text>
                      </View>
                      {alt.restPeriod && (
                        <View style={styles.detailItem}>
                          <Clock color={Colors.mediumGrey} size={14} />
                          <Text style={styles.smallDetailText}>{alt.restPeriod}</Text>
                        </View>
                      )}
                    </View>
                    
                    {alt.notes && (
                      <Text style={styles.alternativeNotes}>{alt.notes}</Text>
                    )}
                    
                    {alt.equipment && (
                      <Text style={styles.equipmentText}>Equipment: {alt.equipment}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <RefreshCw color={Colors.mediumGrey} size={48} />
                <Text style={styles.emptyTitle}>No Alternatives Found</Text>
                <Text style={styles.emptyText}>
                  Tap the refresh button to generate exercise alternatives
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
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
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  currentExercise: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  currentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  exerciseDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  smallDetailText: {
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  alternativesContainer: {
    flex: 1,
    padding: 20,
  },
  alternativesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  customButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  alternativesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.mediumGrey,
    marginTop: 12,
  },
  alternativesList: {
    gap: 12,
  },
  alternativeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  beginnerBadge: {
    backgroundColor: '#E8F5E8',
  },
  intermediateBadge: {
    backgroundColor: '#FFF3E0',
  },
  advancedBadge: {
    backgroundColor: '#FFEBEE',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  alternativeDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  alternativeNotes: {
    fontSize: 13,
    color: Colors.mediumGrey,
    fontStyle: 'italic',
    marginTop: 4,
  },
  equipmentText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    lineHeight: 20,
  },
  customInputContainer: {
    backgroundColor: '#F0F8F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  customInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 16,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  exerciseNameInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.darkGrey,
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: 48,
  },
  generatingIndicator: {
    position: 'absolute',
    right: 12,
  },
  customDetailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  customDetailInput: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginBottom: 6,
  },
  smallInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.darkGrey,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    textAlign: 'center',
  },
  addCustomButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addCustomButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: Colors.mediumGrey,
  },
  addButtonDisabled: {
    backgroundColor: Colors.lightGrey,
  },
});