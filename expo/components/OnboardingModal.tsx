import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { UserProfile } from '@/types/user';
import { Colors } from '@/constants/colors';

interface OnboardingModalProps {
  visible: boolean;
  onComplete: (data: Partial<UserProfile>) => void;
}

const STEPS = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'dietary', title: 'Dietary Preferences' },
  { id: 'physical', title: 'Physical Activity' },
];

export default function OnboardingModal({ visible, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const isStepValid = () => {
    switch (STEPS[currentStep].id) {
      case 'personal':
        return formData.name && formData.age && formData.gender && formData.height && formData.weight;
      case 'dietary':
        return formData.dietaryPreferences?.length && formData.allergies?.length && formData.eatingHabits;
      case 'physical':
        const hasWeightGoal = formData.fitnessGoal?.toLowerCase().includes('weight loss') || 
                             formData.fitnessGoal?.toLowerCase().includes('fat loss') ||
                             formData.fitnessGoal?.toLowerCase().includes('muscle gain') ||
                             formData.fitnessGoal?.toLowerCase().includes('bulking');
        const weightGoalValid = !hasWeightGoal || (formData.targetWeight && formData.weeklyWeightGoal);
        return formData.activityLevel && formData.exerciseTypes?.length && formData.weeklyFrequency && formData.fitnessGoal && weightGoalValid;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      Alert.alert('Required Fields', 'Please fill in all required fields marked with *');
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'personal':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={formData.name || ''}
              onChangeText={(text) => updateField('name', text)}
            />

            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your age"
              keyboardType="numeric"
              value={formData.age?.toString() || ''}
              onChangeText={(text) => updateField('age', parseInt(text) || 0)}
            />

            <Text style={styles.label}>Gender *</Text>
            <View style={styles.buttonGroup}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.optionButton,
                    formData.gender === gender && styles.optionButtonActive,
                  ]}
                  onPress={() => updateField('gender', gender as UserProfile['gender'])}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.gender === gender && styles.optionTextActive,
                    ]}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Height (cm) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your height in cm"
              keyboardType="numeric"
              value={formData.height?.toString() || ''}
              onChangeText={(text) => updateField('height', parseInt(text) || 0)}
            />

            <Text style={styles.label}>Weight (kg) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your weight in kg"
              keyboardType="numeric"
              value={formData.weight?.toString() || ''}
              onChangeText={(text) => updateField('weight', parseInt(text) || 0)}
            />
          </View>
        );

      case 'dietary':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Dietary Preferences *</Text>
            <View style={styles.buttonGroup}>
              {[
                'Vegetarian', 'Vegan', 'Keto', 'Mediterranean', 
                'Low-Carb', 'High-Protein', 'Balanced', 'None', 'Other'
              ].map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.optionButton,
                    formData.dietaryPreferences?.includes(pref) && styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    const current = formData.dietaryPreferences || [];
                    const updated = current.includes(pref)
                      ? current.filter((p) => p !== pref)
                      : [...current, pref];
                    updateField('dietaryPreferences', updated);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.dietaryPreferences?.includes(pref) && styles.optionTextActive,
                    ]}
                  >
                    {pref}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {formData.dietaryPreferences?.includes('Other') && (
              <TextInput
                style={styles.input}
                placeholder="Please specify other dietary preferences"
                value={formData.otherDietaryPreferences || ''}
                onChangeText={(text) => updateField('otherDietaryPreferences', text)}
              />
            )}

            <Text style={styles.label}>Food Allergies *</Text>
            <View style={styles.buttonGroup}>
              {[
                'Nuts', 'Dairy/Lactose', 'Gluten/Wheat', 
                'Shellfish', 'Eggs', 'None', 'Other'
              ].map((allergy) => (
                <TouchableOpacity
                  key={allergy}
                  style={[
                    styles.optionButton,
                    formData.allergies?.includes(allergy) && styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    const current = formData.allergies || [];
                    const updated = current.includes(allergy)
                      ? current.filter((a) => a !== allergy)
                      : [...current, allergy];
                    updateField('allergies', updated);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.allergies?.includes(allergy) && styles.optionTextActive,
                    ]}
                  >
                    {allergy}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {formData.allergies?.includes('Other') && (
              <TextInput
                style={styles.input}
                placeholder="Please specify other allergies"
                value={formData.otherAllergies || ''}
                onChangeText={(text) => updateField('otherAllergies', text)}
              />
            )}

            <Text style={styles.label}>Eating Habits *</Text>
            <View style={styles.buttonGroup}>
              {[
                'Regular 3 meals',
                'Small frequent meals',
                'Intermittent fasting',
                'Irregular schedule',
                'Other'
              ].map((habit) => (
                <TouchableOpacity
                  key={habit}
                  style={[
                    styles.optionButton,
                    formData.eatingHabits === habit && styles.optionButtonActive,
                  ]}
                  onPress={() => updateField('eatingHabits', habit)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.eatingHabits === habit && styles.optionTextActive,
                    ]}
                  >
                    {habit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {formData.eatingHabits === 'Other' && (
              <TextInput
                style={styles.input}
                placeholder="Please describe your eating habits"
                value={formData.otherEatingHabits || ''}
                onChangeText={(text) => updateField('otherEatingHabits', text)}
              />
            )}
          </View>
        );

      case 'physical':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Activity Level *</Text>
            <View style={styles.buttonGroup}>
              {[
                { value: 'sedentary', label: 'Sedentary (Little to no exercise)' },
                { value: 'light', label: 'Light (1-3 days/week)' },
                { value: 'moderate', label: 'Moderate (3-5 days/week)' },
                { value: 'active', label: 'Active (6-7 days/week)' },
                { value: 'very-active', label: 'Very Active (2x/day or intense)' },
              ].map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionButton,
                    formData.activityLevel === level.value && styles.optionButtonActive,
                  ]}
                  onPress={() =>
                    updateField('activityLevel', level.value as UserProfile['activityLevel'])
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.activityLevel === level.value && styles.optionTextActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Preferred Exercise Types *</Text>
            <View style={styles.buttonGroup}>
              {[
                'Cardio/Running', 'Weight Training', 'Yoga', 'Swimming', 
                'HIIT', 'Walking/Hiking', 'Bodyweight', 'None', 'Other'
              ].map((exercise) => (
                <TouchableOpacity
                  key={exercise}
                  style={[
                    styles.optionButton,
                    formData.exerciseTypes?.includes(exercise) && styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    const current = formData.exerciseTypes || [];
                    const updated = current.includes(exercise)
                      ? current.filter((e) => e !== exercise)
                      : [...current, exercise];
                    updateField('exerciseTypes', updated);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.exerciseTypes?.includes(exercise) && styles.optionTextActive,
                    ]}
                  >
                    {exercise}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {formData.exerciseTypes?.includes('Other') && (
              <TextInput
                style={styles.input}
                placeholder="Please specify other exercise types"
                value={formData.otherExerciseTypes || ''}
                onChangeText={(text) => updateField('otherExerciseTypes', text)}
              />
            )}

            <Text style={styles.label}>Weekly Exercise Frequency *</Text>
            <View style={styles.buttonGroup}>
              {['1-2 days', '3-4 days', '5-6 days', '7+ days'].map((freq, index) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.optionButton,
                    formData.weeklyFrequency === index + 1 && styles.optionButtonActive,
                  ]}
                  onPress={() => updateField('weeklyFrequency', index + 1)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.weeklyFrequency === index + 1 && styles.optionTextActive,
                    ]}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Primary Fitness Goal *</Text>
            <View style={styles.buttonGroup}>
              {[
                'Weight Loss', 'Muscle Gain/Bulking', 'Maintain Current Weight',
                'General Health & Wellness', 'Build Strength', 'Other'
              ].map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.optionButton,
                    formData.fitnessGoal === goal && styles.optionButtonActive,
                  ]}
                  onPress={() => updateField('fitnessGoal', goal)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.fitnessGoal === goal && styles.optionTextActive,
                    ]}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {formData.fitnessGoal === 'Other' && (
              <TextInput
                style={styles.input}
                placeholder="Please describe your fitness goal"
                value={formData.otherFitnessGoal || ''}
                onChangeText={(text) => updateField('otherFitnessGoal', text)}
              />
            )}

            {(formData.fitnessGoal?.toLowerCase().includes('weight loss') || 
              formData.fitnessGoal?.toLowerCase().includes('muscle gain') ||
              formData.fitnessGoal?.toLowerCase().includes('bulking')) && (
              <>
                <Text style={styles.label}>Target Weight (kg) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your target weight in kg"
                  keyboardType="numeric"
                  value={formData.targetWeight?.toString() || ''}
                  onChangeText={(text) => updateField('targetWeight', parseInt(text) || 0)}
                />

                <Text style={styles.label}>Weekly Weight Goal *</Text>
                <View style={styles.buttonGroup}>
                  {[
                    { value: 0.25, label: '0.25 kg/week (Slow)' },
                    { value: 0.5, label: '0.5 kg/week (Moderate)' },
                    { value: 0.75, label: '0.75 kg/week (Fast)' },
                    { value: 1, label: '1 kg/week (Very Fast)' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        formData.weeklyWeightGoal === option.value && styles.optionButtonActive,
                      ]}
                      onPress={() => updateField('weeklyWeightGoal', option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          formData.weeklyWeightGoal === option.value && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        );



      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.title}>AI Personalization</Text>
            <Text style={styles.subtitle}>Help us understand you better</Text>
          </View>

          <View style={styles.progressContainer}>
            {STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
            {renderStepContent()}
          </ScrollView>

          <View style={styles.footer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ChevronLeft color={Colors.primary} size={20} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}
              </Text>
              <ChevronRight color={Colors.white} size={20} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: Colors.white,
    width: 24,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 20,
  },
  stepContent: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.lightGrey,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.lightGrey,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  optionTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.white,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: Colors.lightGrey,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
});