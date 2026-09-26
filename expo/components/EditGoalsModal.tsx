/**
 * Edit goals, on the dark system.
 *
 * Same fields, same `updateProfile` call, same validation rules (a goal is
 * required; target weight and weekly pace are required only for weight-loss or
 * muscle-gain goals). What changed: a sheet on canvas; the goal and activity
 * choices are pill rows instead of five full-width buttons each, so the whole
 * form fits on one screen; the numeric fields are large numerals with their
 * unit beside them, like the check-in sheet; the two `any` casts are gone --
 * the option values are typed from `UserProfile` now, so a typo in an activity
 * level would fail tsc instead of silently writing a string the calorie
 * multiplier table does not know; haptics on every choice.
 */
import { targetWeightProblem } from '@/lib/calorie-target';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import Enter from '@/components/Enter';
import { FITNESS_GOALS, hasWeightGoal } from '@/constants/goals';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';
import type { UserProfile } from '@/types/user';

interface EditGoalsModalProps {
  visible: boolean;
  onClose: () => void;
}

type ActivityLevel = NonNullable<UserProfile['activityLevel']>;

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
  { value: 'very-active', label: 'Very active' },
];

const needsWeightTargets = hasWeightGoal;

export default function EditGoalsModal({ visible, onClose }: EditGoalsModalProps) {
  const { profile, updateProfile } = useUserProfile();

  const [fitnessGoal, setFitnessGoal] = useState(profile.fitnessGoal || '');
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight?.toString() || '');
  const [weeklyWeightGoal, setWeeklyWeightGoal] = useState(profile.weeklyWeightGoal?.toString() || '');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'moderate');
  const [weeklyFrequency, setWeeklyFrequency] = useState(profile.weeklyFrequency?.toString() || '');

  const tap = () => Haptics.selectionAsync().catch(() => {});

  // A goal stored before the two pickers shared one list ("Muscle Gain/Bulking"),
  // or typed under "Other" at sign-up, is not in FITNESS_GOALS. Show it as its
  // own pill, selected, so the sheet reflects what is actually saved instead of
  // showing nothing chosen; picking a listed goal replaces it.
  const goalChoices: string[] =
    fitnessGoal && !(FITNESS_GOALS as readonly string[]).includes(fitnessGoal)
      ? [fitnessGoal, ...FITNESS_GOALS]
      : [...FITNESS_GOALS];

  const handleSave = async () => {
    if (!fitnessGoal) {
      Alert.alert('Pick a goal', 'Choose what you are training for first.');
      return;
    }

    const updates: Partial<UserProfile> = { fitnessGoal, activityLevel };

    if (weeklyFrequency) {
      const days = parseInt(weeklyFrequency, 10);
      if (Number.isNaN(days) || days < 0 || days > 7) {
        Alert.alert('Check the frequency', 'Days per week should be between 0 and 7.');
        return;
      }
      updates.weeklyFrequency = days;
    }

    if (needsWeightTargets(fitnessGoal)) {
      const target = parseFloat(targetWeight);
      const pace = parseFloat(weeklyWeightGoal);
      if (!targetWeight || !weeklyWeightGoal || Number.isNaN(target) || Number.isNaN(pace) || target <= 0 || pace <= 0) {
        Alert.alert('Two more numbers', 'A target weight and a weekly pace are needed for that goal.');
        return;
      }
      const tooLow = targetWeightProblem(profile.height, target);
      if (tooLow) {
        Alert.alert('Target weight', tooLow);
        return;
      }
      updates.targetWeight = target;
      updates.weeklyWeightGoal = pace;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await updateProfile(updates);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <Enter order={0} style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Goals</Text>
              <Text style={styles.title}>What you&apos;re training for</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
              <X size={22} color={Palette.inkMuted} />
            </TouchableOpacity>
          </Enter>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Enter order={1}>
              <Text style={styles.label}>Goal</Text>
              <View style={styles.pills}>
                {goalChoices.map((goal) => {
                  const on = fitnessGoal === goal;
                  return (
                    <TouchableOpacity
                      key={goal}
                      style={[styles.pill, on && styles.pillOn]}
                      onPress={() => { tap(); setFitnessGoal(goal); }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Text style={[styles.pillText, on && styles.pillTextOn]}>{goal}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Enter>

            {needsWeightTargets(fitnessGoal) && (
              <Enter order={2}>
                <Text style={styles.label}>Target weight</Text>
                <View style={styles.numeralRow}>
                  <TextInput
                    style={styles.numeralInput}
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={Palette.inkFaint}
                    accessibilityLabel="Target weight in kilograms"
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>

                <Text style={styles.label}>Weekly pace</Text>
                <View style={styles.numeralRow}>
                  <TextInput
                    style={styles.numeralInput}
                    value={weeklyWeightGoal}
                    onChangeText={setWeeklyWeightGoal}
                    keyboardType="decimal-pad"
                    placeholder="0.5"
                    placeholderTextColor={Palette.inkFaint}
                    accessibilityLabel="Weekly weight change in kilograms"
                  />
                  <Text style={styles.unit}>kg / week</Text>
                </View>
                <Text style={styles.helper}>0.5 to 1 kg a week is the range most people can hold.</Text>
              </Enter>
            )}

            <Enter order={3}>
              <Text style={styles.label}>Activity outside training</Text>
              <View style={styles.pills}>
                {ACTIVITY_LEVELS.map((level) => {
                  const on = activityLevel === level.value;
                  return (
                    <TouchableOpacity
                      key={level.value}
                      style={[styles.pill, on && styles.pillOn]}
                      onPress={() => { tap(); setActivityLevel(level.value); }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Text style={[styles.pillText, on && styles.pillTextOn]}>{level.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Enter>

            <Enter order={4}>
              <Text style={styles.label}>Sessions a week</Text>
              <View style={styles.numeralRow}>
                <TextInput
                  style={styles.numeralInput}
                  value={weeklyFrequency}
                  onChangeText={setWeeklyFrequency}
                  keyboardType="number-pad"
                  placeholder="4"
                  placeholderTextColor={Palette.inkFaint}
                  maxLength={1}
                  accessibilityLabel="Workout days per week"
                />
                <Text style={styles.unit}>days</Text>
              </View>
            </Enter>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondary} onPress={onClose} accessibilityRole="button">
              <Text style={styles.secondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primary} onPress={handleSave} accessibilityRole="button">
              <Text style={styles.primaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(3, 8, 6, 0.72)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Palette.canvasRaised,
    borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
    maxHeight: '90%',
  },
  grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: Palette.lineStrong, marginTop: Space.sm },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Space.xl, paddingTop: Space.lg, paddingBottom: Space.md,
  },
  eyebrow: { ...Type.eyebrow, color: Palette.accent },
  title: { ...Type.heading, color: Palette.ink, marginTop: Space.xs },
  body: { flexGrow: 0 },
  bodyContent: { paddingHorizontal: Space.xl, paddingBottom: Space.md },
  label: { ...Type.eyebrow, color: Palette.inkMuted, marginTop: Space.lg, marginBottom: Space.sm },
  helper: { ...Type.caption, color: Palette.inkFaint, marginTop: Space.sm },

  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  pill: { paddingHorizontal: Space.lg, paddingVertical: Space.sm + 2, borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong },
  pillOn: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  pillText: { ...Type.caption, color: Palette.ink },
  pillTextOn: { color: Palette.canvas, fontWeight: '700' },

  numeralRow: { flexDirection: 'row', alignItems: 'baseline' },
  // Fixed width: on web a TextInput otherwise grows to the row and pushes its unit
  // to the far edge (seen in the first render: 'kg / week' wrapped at the margin).
  numeralInput: { ...Type.display, color: Palette.ink, width: 100, padding: 0, fontVariant: Type.numeral.fontVariant },
  unit: { ...Type.heading, color: Palette.inkMuted, marginLeft: Space.sm, flexShrink: 0 },

  footer: { flexDirection: 'row', gap: Space.md, padding: Space.xl, paddingTop: Space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line },
  primary: { flex: 1.4, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: Space.lg },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
  secondary: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingVertical: Space.lg, borderWidth: 1, borderColor: Palette.lineStrong },
  secondaryText: { ...Type.bodyStrong, color: Palette.ink },
});
