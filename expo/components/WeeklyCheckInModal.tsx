/**
 * Weekly check-in, on the dark system.
 *
 * It opens over the Home tab, so it was the first light surface a signed-in user
 * would see after the redesign. Same fields, same store call, same validation.
 * What changed: a bottom sheet instead of a centred card; mood is a single-accent
 * choice (five colours for five moods was five different meanings of the same
 * colour vocabulary -- a mood is a category, not a direction); energy is a row
 * of ten with the chosen level lit; the emoji labels are gone because the type
 * carries the hierarchy now; haptics on every choice.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';

interface WeeklyCheckInModalProps {
  visible: boolean;
  onClose: () => void;
}

type Mood = 'great' | 'good' | 'okay' | 'tired' | 'stressed';
const MOODS: { value: Mood; label: string }[] = [
  { value: 'great', label: 'Great' },
  { value: 'good', label: 'Good' },
  { value: 'okay', label: 'Okay' },
  { value: 'tired', label: 'Tired' },
  { value: 'stressed', label: 'Stressed' },
];

export default function WeeklyCheckInModal({ visible, onClose }: WeeklyCheckInModalProps) {
  const { addWeeklyCheckIn, profile } = useUserProfile();

  const [weight, setWeight] = useState(profile.weight?.toString() || '');
  const [mood, setMood] = useState<Mood>('good');
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');

  const tap = () => Haptics.selectionAsync().catch(() => {});

  const handleSubmit = async () => {
    const w = parseFloat(weight);
    if (!weight || Number.isNaN(w) || w <= 0) {
      Alert.alert('Weight needed', 'Enter your current weight to save the check-in.');
      return;
    }
    await addWeeklyCheckIn({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: w,
      mood,
      energy,
      notes: notes.trim() || undefined,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Weekly check-in</Text>
              <Text style={styles.title}>How did the week go?</Text>
            </View>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" hitSlop={12}>
              <X color={Palette.inkMuted} size={22} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Weight</Text>
            <View style={styles.weightRow}>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={Palette.inkFaint}
                accessibilityLabel="Current weight in kilograms"
              />
              <Text style={styles.weightUnit}>kg</Text>
            </View>

            <Text style={styles.label}>How are you feeling?</Text>
            <View style={styles.pills}>
              {MOODS.map((m) => {
                const on = mood === m.value;
                return (
                  <TouchableOpacity
                    key={m.value}
                    style={[styles.pill, on && styles.pillOn]}
                    onPress={() => { tap(); setMood(m.value); }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                  >
                    <Text style={[styles.pillText, on && styles.pillTextOn]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Energy</Text>
            <View style={styles.energyRow} accessibilityRole="adjustable" accessibilityValue={{ min: 1, max: 10, now: energy }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                const lit = n <= energy;
                return (
                  <TouchableOpacity
                    key={n}
                    style={[styles.energyCell, lit && styles.energyCellLit, n === energy && styles.energyCellCurrent]}
                    onPress={() => { tap(); setEnergy(n); }}
                    accessibilityLabel={`Energy ${n} of 10`}
                  >
                    <Text style={[styles.energyText, lit && styles.energyTextLit]}>{n}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.notes}
              value={notes}
              onChangeText={setNotes}
              placeholder="Anything worth remembering about this week"
              placeholderTextColor={Palette.inkFaint}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondary} onPress={onClose} accessibilityRole="button">
              <Text style={styles.secondaryText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primary} onPress={handleSubmit} accessibilityRole="button">
              <Text style={styles.primaryText}>Save check-in</Text>
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
    maxHeight: '88%',
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

  weightRow: { flexDirection: 'row', alignItems: 'baseline' },
  weightInput: { ...Type.display, color: Palette.ink, minWidth: 96, padding: 0, fontVariant: Type.numeral.fontVariant },
  weightUnit: { ...Type.heading, color: Palette.inkMuted, marginLeft: Space.sm },

  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  pill: { paddingHorizontal: Space.lg, paddingVertical: Space.sm + 2, borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong },
  pillOn: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  pillText: { ...Type.caption, color: Palette.ink },
  pillTextOn: { color: Palette.canvas, fontWeight: '700' },

  energyRow: { flexDirection: 'row', gap: 4 },
  energyCell: { flex: 1, height: 36, borderRadius: Radius.sm, backgroundColor: Palette.canvas, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line },
  energyCellLit: { backgroundColor: Palette.accentGlow, borderColor: Palette.accentDeep },
  energyCellCurrent: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  energyText: { ...Type.caption, color: Palette.inkFaint, fontVariant: Type.numeral.fontVariant },
  energyTextLit: { color: Palette.ink },

  notes: {
    ...Type.body, color: Palette.ink, backgroundColor: Palette.canvas, borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line, padding: Space.md, minHeight: 84, textAlignVertical: 'top',
  },

  footer: { flexDirection: 'row', gap: Space.md, padding: Space.xl, paddingTop: Space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line },
  primary: { flex: 1.4, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: Space.lg },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
  secondary: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingVertical: Space.lg, borderWidth: 1, borderColor: Palette.lineStrong },
  secondaryText: { ...Type.bodyStrong, color: Palette.ink },
});
