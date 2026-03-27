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
import { X, Target } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';

interface EditGoalsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EditGoalsModal({ visible, onClose }: EditGoalsModalProps) {
  const { profile, updateProfile } = useUserProfile();
  
  const [fitnessGoal, setFitnessGoal] = useState(profile.fitnessGoal || '');
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight?.toString() || '');
  const [weeklyWeightGoal, setWeeklyWeightGoal] = useState(profile.weeklyWeightGoal?.toString() || '');
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderate');
  const [weeklyFrequency, setWeeklyFrequency] = useState(profile.weeklyFrequency?.toString() || '');

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'active', label: 'Active' },
    { value: 'very-active', label: 'Very Active' },
  ];

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Maintain Weight',
    'Improve Endurance',
    'General Fitness',
  ];

  const handleSave = async () => {
    if (!fitnessGoal) {
      Alert.alert('Error', 'Please select a fitness goal');
      return;
    }

    const updates: any = {
      fitnessGoal,
      activityLevel,
    };

    if (weeklyFrequency) {
      updates.weeklyFrequency = parseInt(weeklyFrequency);
    }

    if (fitnessGoal.toLowerCase().includes('weight loss') || fitnessGoal.toLowerCase().includes('muscle gain')) {
      if (!targetWeight || !weeklyWeightGoal) {
        Alert.alert('Error', 'Please enter target weight and weekly goal');
        return;
      }
      updates.targetWeight = parseFloat(targetWeight);
      updates.weeklyWeightGoal = parseFloat(weeklyWeightGoal);
    }

    await updateProfile(updates);
    Alert.alert('Success', 'Your goals have been updated!');
    onClose();
  };

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
            <Text style={styles.modalTitle}>Edit Your Goals</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fitness Goal</Text>
              {fitnessGoals.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.optionButton,
                    fitnessGoal === goal && styles.optionButtonActive,
                  ]}
                  onPress={() => setFitnessGoal(goal)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      fitnessGoal === goal && styles.optionTextActive,
                    ]}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(fitnessGoal.toLowerCase().includes('weight loss') || 
              fitnessGoal.toLowerCase().includes('muscle gain')) && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Target Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    keyboardType="numeric"
                    placeholder="Enter target weight"
                    placeholderTextColor={Colors.mediumGrey}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Weekly Goal (kg per week)</Text>
                  <Text style={styles.helperText}>
                    Recommended: 0.5-1 kg for healthy weight change
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={weeklyWeightGoal}
                    onChangeText={setWeeklyWeightGoal}
                    keyboardType="decimal-pad"
                    placeholder="e.g., 0.5"
                    placeholderTextColor={Colors.mediumGrey}
                  />
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity Level</Text>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionButton,
                    activityLevel === level.value && styles.optionButtonActive,
                  ]}
                  onPress={() => setActivityLevel(level.value as any)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      activityLevel === level.value && styles.optionTextActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Workout Frequency (days per week)</Text>
              <TextInput
                style={styles.input}
                value={weeklyFrequency}
                onChangeText={setWeeklyFrequency}
                keyboardType="number-pad"
                placeholder="e.g., 4"
                placeholderTextColor={Colors.mediumGrey}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.darkGrey,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.darkGrey,
    textAlign: 'center',
  },
  optionTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.darkGrey,
    textAlign: 'center',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});