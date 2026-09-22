/**
 * First-run questionnaire, on the dark system.
 *
 * This is the screen a new account sees the moment the intro and sign-up are
 * done, and until now it was a green-gradient light form — the biggest single
 * break in the redesign. Same three steps, same fields, same `onComplete`
 * payload shape, same "everything is required" rule. What changed:
 *
 *   - full-bleed canvas, a three-segment progress bar instead of dots, and the
 *     step title as the headline rather than a fixed "AI Personalization";
 *   - every choice is a pill (single- or multi-select) with a haptic, and the
 *     "Other" free-text fields appear inline under the pill that opened them;
 *   - age / height / weight are numerals with their unit beside them, like the
 *     check-in sheet, and the name field is the one ordinary text input;
 *   - the two `any` casts are gone: `updateField` is generic over UserProfile.
 *
 * One data fix, deliberate: "Weekly exercise frequency" used to store 1, 2, 3
 * or 4 for the four ranges — so "5-6 days" was saved as `weeklyFrequency: 3`,
 * and the Edit-goals sheet and the calorie estimate then read that 3 as three
 * days. It now stores a representative day count (2, 4, 6, 7). Existing
 * profiles are untouched; only new onboardings write the corrected value.
 */
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
import * as Haptics from 'expo-haptics';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Enter from '@/components/Enter';
import { FITNESS_GOALS, hasWeightGoal } from '@/constants/goals';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import type { UserProfile } from '@/types/user';

interface OnboardingModalProps {
  visible: boolean;
  onComplete: (data: Partial<UserProfile>) => void;
}

const STEPS = [
  { id: 'personal', eyebrow: 'Step 1 of 3', title: 'About you' },
  { id: 'dietary', eyebrow: 'Step 2 of 3', title: 'How you eat' },
  { id: 'physical', eyebrow: 'Step 3 of 3', title: 'How you train' },
] as const;

const GENDERS: { value: NonNullable<UserProfile['gender']>; label: string }[] = [
  { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
];
const DIETS = ['Vegetarian', 'Vegan', 'Keto', 'Mediterranean', 'Low-Carb', 'High-Protein', 'Balanced', 'None', 'Other'];
const ALLERGIES = ['Nuts', 'Dairy/Lactose', 'Gluten/Wheat', 'Shellfish', 'Eggs', 'None', 'Other'];
const HABITS = ['Regular 3 meals', 'Small frequent meals', 'Intermittent fasting', 'Irregular schedule', 'Other'];
const ACTIVITY: { value: NonNullable<UserProfile['activityLevel']>; label: string; hint: string }[] = [
  { value: 'sedentary', label: 'Sedentary', hint: 'little or no exercise' },
  { value: 'light', label: 'Light', hint: '1–3 days a week' },
  { value: 'moderate', label: 'Moderate', hint: '3–5 days a week' },
  { value: 'active', label: 'Active', hint: '6–7 days a week' },
  { value: 'very-active', label: 'Very active', hint: 'twice a day, or intense' },
];
const EXERCISE = ['Cardio/Running', 'Weight Training', 'Yoga', 'Swimming', 'HIIT', 'Walking/Hiking', 'Bodyweight', 'None', 'Other'];
const FREQUENCY: { days: number; label: string }[] = [
  { days: 2, label: '1–2 days' }, { days: 4, label: '3–4 days' }, { days: 6, label: '5–6 days' }, { days: 7, label: '7 days' },
];
// One vocabulary shared with EditGoalsModal (constants/goals.ts); 'Other' opens a free-text line.
const GOALS = [...FITNESS_GOALS, 'Other'];
const PACE: { value: number; label: string }[] = [
  { value: 0.25, label: '0.25 kg · slow' }, { value: 0.5, label: '0.5 kg · steady' },
  { value: 0.75, label: '0.75 kg · fast' }, { value: 1, label: '1 kg · very fast' },
];

const tap = () => Haptics.selectionAsync().catch(() => {});

function Pills<V extends string | number>({ options, selected, onPick }: {
  options: { value: V; label: string }[];
  selected: (v: V) => boolean;
  onPick: (v: V) => void;
}) {
  return (
    <View style={styles.pills}>
      {options.map((o) => {
        const on = selected(o.value);
        return (
          <TouchableOpacity
            key={String(o.value)}
            style={[styles.pill, on && styles.pillOn]}
            onPress={() => { tap(); onPick(o.value); }}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Text style={[styles.pillText, on && styles.pillTextOn]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const asOptions = (xs: readonly string[]) => xs.map((x) => ({ value: x, label: x }));

export default function OnboardingModal({ visible, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const step = STEPS[currentStep];

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const toggleIn = (field: 'dietaryPreferences' | 'allergies' | 'exerciseTypes', value: string) => {
    const current = formData[field] ?? [];
    updateField(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };
  const numeric = (field: 'age' | 'height' | 'weight' | 'targetWeight') => (text: string) =>
    updateField(field, parseInt(text, 10) || 0);

  const isStepValid = (): boolean => {
    switch (step.id) {
      case 'personal':
        return Boolean(formData.name && formData.age && formData.gender && formData.height && formData.weight);
      case 'dietary':
        return Boolean(formData.dietaryPreferences?.length && formData.allergies?.length && formData.eatingHabits);
      case 'physical': {
        const weightOk = !hasWeightGoal(formData.fitnessGoal) || Boolean(formData.targetWeight && formData.weeklyWeightGoal);
        return Boolean(formData.activityLevel && formData.exerciseTypes?.length && formData.weeklyFrequency && formData.fitnessGoal && weightOk);
      }
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      Alert.alert('A few more answers', 'Every question on this step is needed to set your targets.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    else onComplete(formData);
  };

  const handleBack = () => { if (currentStep > 0) { tap(); setCurrentStep(currentStep - 1); } };

  const numeralField = (label: string, unit: string, field: 'age' | 'height' | 'weight' | 'targetWeight', placeholder: string) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.numeralRow}>
        <TextInput
          style={styles.numeralInput}
          keyboardType="number-pad"
          value={formData[field] ? String(formData[field]) : ''}
          onChangeText={numeric(field)}
          placeholder={placeholder}
          placeholderTextColor={Palette.inkFaint}
          maxLength={3}
          accessibilityLabel={label}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );

  const otherInput = (field: 'otherDietaryPreferences' | 'otherAllergies' | 'otherEatingHabits' | 'otherExerciseTypes' | 'otherFitnessGoal', placeholder: string) => (
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor={Palette.inkFaint}
      value={formData[field] ?? ''}
      onChangeText={(t) => updateField(field, t)}
    />
  );

  const renderStep = () => {
    switch (step.id) {
      case 'personal':
        return (
          <>
            <Enter order={1}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What should we call you?"
                placeholderTextColor={Palette.inkFaint}
                value={formData.name ?? ''}
                onChangeText={(t) => updateField('name', t)}
                autoCapitalize="words"
                accessibilityLabel="Name"
              />
            </Enter>
            <Enter order={2}>
              <Text style={styles.label}>Gender</Text>
              <Pills options={GENDERS} selected={(v) => formData.gender === v} onPick={(v) => updateField('gender', v)} />
            </Enter>
            <Enter order={3} style={styles.numeralGrid}>
              {numeralField('Age', 'years', 'age', '0')}
              {numeralField('Height', 'cm', 'height', '0')}
              {numeralField('Weight', 'kg', 'weight', '0')}
            </Enter>
          </>
        );
      case 'dietary':
        return (
          <>
            <Enter order={1}>
              <Text style={styles.label}>Diet — pick all that apply</Text>
              <Pills options={asOptions(DIETS)} selected={(v) => Boolean(formData.dietaryPreferences?.includes(v))} onPick={(v) => toggleIn('dietaryPreferences', v)} />
              {formData.dietaryPreferences?.includes('Other') && otherInput('otherDietaryPreferences', 'Tell us about your diet')}
            </Enter>
            <Enter order={2}>
              <Text style={styles.label}>Allergies — pick all that apply</Text>
              <Pills options={asOptions(ALLERGIES)} selected={(v) => Boolean(formData.allergies?.includes(v))} onPick={(v) => toggleIn('allergies', v)} />
              {formData.allergies?.includes('Other') && otherInput('otherAllergies', 'Which allergies?')}
            </Enter>
            <Enter order={3}>
              <Text style={styles.label}>Eating pattern</Text>
              <Pills options={asOptions(HABITS)} selected={(v) => formData.eatingHabits === v} onPick={(v) => updateField('eatingHabits', v)} />
              {formData.eatingHabits === 'Other' && otherInput('otherEatingHabits', 'Describe how you usually eat')}
            </Enter>
          </>
        );
      case 'physical':
        return (
          <>
            <Enter order={1}>
              <Text style={styles.label}>Activity outside training</Text>
              <View style={styles.list}>
                {ACTIVITY.map((a) => {
                  const on = formData.activityLevel === a.value;
                  return (
                    <TouchableOpacity
                      key={a.value}
                      style={[styles.row, on && styles.rowOn]}
                      onPress={() => { tap(); updateField('activityLevel', a.value); }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Text style={[styles.rowLabel, on && styles.rowLabelOn]}>{a.label}</Text>
                      <Text style={[styles.rowHint, on && styles.rowHintOn]}>{a.hint}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Enter>
            <Enter order={2}>
              <Text style={styles.label}>What you like doing — pick all that apply</Text>
              <Pills options={asOptions(EXERCISE)} selected={(v) => Boolean(formData.exerciseTypes?.includes(v))} onPick={(v) => toggleIn('exerciseTypes', v)} />
              {formData.exerciseTypes?.includes('Other') && otherInput('otherExerciseTypes', 'Which kind of training?')}
            </Enter>
            <Enter order={3}>
              <Text style={styles.label}>Sessions a week</Text>
              <Pills options={FREQUENCY.map((f) => ({ value: f.days, label: f.label }))} selected={(v) => formData.weeklyFrequency === v} onPick={(v) => updateField('weeklyFrequency', v)} />
            </Enter>
            <Enter order={4}>
              <Text style={styles.label}>Main goal</Text>
              <Pills options={asOptions(GOALS)} selected={(v) => formData.fitnessGoal === v} onPick={(v) => updateField('fitnessGoal', v)} />
              {formData.fitnessGoal === 'Other' && otherInput('otherFitnessGoal', 'What are you training for?')}
            </Enter>
            {hasWeightGoal(formData.fitnessGoal) && (
              <Enter order={5}>
                {numeralField('Target weight', 'kg', 'targetWeight', '0')}
                <Text style={styles.label}>Weekly pace</Text>
                <Pills options={PACE} selected={(v) => formData.weeklyWeightGoal === v} onPick={(v) => updateField('weeklyWeightGoal', v)} />
              </Enter>
            )}
          </>
        );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <View style={styles.progress}>
            {STEPS.map((s, i) => (
              <View key={s.id} style={[styles.segment, i <= currentStep && styles.segmentOn]} />
            ))}
          </View>

          <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Enter order={0} key={`h-${step.id}`}>
              <Text style={styles.eyebrow}>{step.eyebrow}</Text>
              <Text style={styles.title}>{step.title}</Text>
            </Enter>
            <View key={step.id}>{renderStep()}</View>
          </ScrollView>

          <View style={styles.footer}>
            {currentStep > 0 ? (
              <TouchableOpacity style={styles.secondary} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Back">
                <ChevronLeft color={Palette.ink} size={20} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.primary} onPress={handleNext} accessibilityRole="button">
              <Text style={styles.primaryText}>{currentStep === STEPS.length - 1 ? 'Finish' : 'Continue'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.canvas },
  flex: { flex: 1 },
  progress: { flexDirection: 'row', gap: Space.sm, paddingHorizontal: Space.xl, paddingTop: Space.lg, paddingBottom: Space.sm, backgroundColor: Palette.canvas },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Palette.line },
  segmentOn: { backgroundColor: Palette.accent },
  content: { paddingHorizontal: Space.xl, paddingTop: Space.xl, paddingBottom: Space.xxl },
  eyebrow: { ...Type.eyebrow, color: Palette.accent },
  title: { ...Type.title, color: Palette.ink, marginTop: Space.xs },
  label: { ...Type.eyebrow, color: Palette.inkMuted, marginTop: Space.xl, marginBottom: Space.sm },

  textInput: {
    ...Type.body, color: Palette.ink, backgroundColor: Palette.canvasRaised, borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line, paddingHorizontal: Space.md, paddingVertical: Space.md,
    marginTop: Space.sm,
  },

  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  pill: { paddingHorizontal: Space.lg, paddingVertical: Space.sm + 2, borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong },
  pillOn: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  pillText: { ...Type.caption, color: Palette.ink },
  pillTextOn: { color: Palette.canvas, fontWeight: '700' },

  numeralGrid: { flexDirection: 'row', gap: Space.lg },
  numeralRow: { flexDirection: 'row', alignItems: 'baseline' },
  // Fixed width: on web a TextInput otherwise grows to the row and pushes its unit away.
  numeralInput: { ...Type.title, color: Palette.ink, width: 64, padding: 0, fontVariant: Type.numeral.fontVariant },
  unit: { ...Type.caption, color: Palette.inkMuted, marginLeft: Space.xs, flexShrink: 0 },

  list: { gap: Space.sm },
  row: {
    backgroundColor: Palette.canvasRaised, borderRadius: Radius.md, padding: Space.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
  },
  rowOn: { borderColor: Palette.accent, backgroundColor: Palette.accentGlow },
  rowLabel: { ...Type.bodyStrong, color: Palette.ink },
  rowLabelOn: { color: Palette.accent },
  rowHint: { ...Type.caption, color: Palette.inkMuted, marginTop: 2 },
  rowHintOn: { color: Palette.inkMuted },

  footer: { flexDirection: 'row', gap: Space.md, paddingHorizontal: Space.xl, paddingVertical: Space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line },
  secondary: { width: 56, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong },
  primary: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: Space.lg },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
});
