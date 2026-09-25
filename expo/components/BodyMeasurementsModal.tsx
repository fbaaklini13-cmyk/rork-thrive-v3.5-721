import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { Palette } from '@/constants/theme';
import type { BodyMeasurement } from '@/types/user';

interface BodyMeasurementsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (measurement: BodyMeasurement) => Promise<void>;
  lastMeasurement?: BodyMeasurement;
}

const MEASUREMENT_FIELDS = [
  { key: 'neck' as const, label: 'Neck', unit: 'cm' },
  { key: 'chest' as const, label: 'Chest', unit: 'cm' },
  { key: 'leftBicep' as const, label: 'Left Bicep', unit: 'cm' },
  { key: 'rightBicep' as const, label: 'Right Bicep', unit: 'cm' },
  { key: 'waist' as const, label: 'Waist', unit: 'cm' },
  { key: 'hips' as const, label: 'Hips', unit: 'cm' },
  { key: 'leftThigh' as const, label: 'Left Thigh', unit: 'cm' },
  { key: 'rightThigh' as const, label: 'Right Thigh', unit: 'cm' },
  { key: 'leftCalf' as const, label: 'Left Calf', unit: 'cm' },
  { key: 'rightCalf' as const, label: 'Right Calf', unit: 'cm' },
];

export default function BodyMeasurementsModal({
  visible,
  onClose,
  onSave,
  lastMeasurement,
}: BodyMeasurementsModalProps) {
  const [measurements, setMeasurements] = useState<Partial<BodyMeasurement>>({});
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const hasAnyMeasurement = MEASUREMENT_FIELDS.some(
      field => measurements[field.key] !== undefined
    );

    if (!hasAnyMeasurement) {
      Alert.alert('Error', 'Please enter at least one measurement');
      return;
    }

    setIsSaving(true);
    try {
      const measurement: BodyMeasurement = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        notes: notes.trim() || undefined,
        ...measurements,
      };
      await onSave(measurement);
      setMeasurements({});
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Failed to save measurements:', err);
      Alert.alert('Error', 'Failed to save measurements');
    } finally {
      setIsSaving(false);
    }
  };

  const updateMeasurement = (key: keyof BodyMeasurement, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setMeasurements(prev => ({ ...prev, [key]: numValue }));
  };

  const getDifference = (key: keyof BodyMeasurement) => {
    if (!lastMeasurement || !measurements[key] || !lastMeasurement[key]) {
      return null;
    }
    const diff = (measurements[key] as number) - (lastMeasurement[key] as number);
    return diff;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Body Measurements</Text>
            <Text style={styles.subtitle}>Track your progress over time</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={Palette.ink} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.measurementsGrid}>
            {MEASUREMENT_FIELDS.map(field => {
              const diff = getDifference(field.key);
              const lastValue = lastMeasurement?.[field.key];

              return (
                <View key={field.key} style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>{field.label}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={lastValue ? `${lastValue}` : '0'}
                      placeholderTextColor={Palette.inkMuted}
                      keyboardType="decimal-pad"
                      value={measurements[field.key]?.toString() || ''}
                      onChangeText={value => updateMeasurement(field.key, value)}
                    />
                    <Text style={styles.unit}>{field.unit}</Text>
                  </View>
                  
                  {diff !== null && (
                    <View style={styles.difference}>
                      <Text
                        style={[
                          styles.differenceText,
                          { color: diff > 0 ? Palette.good : Palette.bad },
                        ]}
                      >
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)} {field.unit}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about your progress..."
              placeholderTextColor={Palette.inkMuted}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save color={Palette.canvas} size={20} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Measurements'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvasRaised,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.inkMuted,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  measurementsGrid: {
    gap: 16,
  },
  measurementItem: {
    gap: 8,
  },
  measurementLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.ink,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvasRaised,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Palette.ink,
    paddingVertical: 12,
  },
  unit: {
    fontSize: 14,
    color: Palette.inkMuted,
    fontWeight: '500',
  },
  difference: {
    paddingLeft: 12,
  },
  differenceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  notesSection: {
    marginTop: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.ink,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Palette.ink,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Palette.line,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.accent,
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.canvas,
  },
});
