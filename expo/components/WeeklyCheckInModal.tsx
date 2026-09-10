import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { X, TrendingUp, Heart, Battery } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';

interface WeeklyCheckInModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WeeklyCheckInModal({ visible, onClose }: WeeklyCheckInModalProps) {
  const { addWeeklyCheckIn, profile } = useUserProfile();
  
  const [weight, setWeight] = useState(profile.weight?.toString() || '');
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'tired' | 'stressed'>('good');
  const [energy, setEnergy] = useState('5');
  const [notes, setNotes] = useState('');

  const moods = [
    { value: 'great', label: '😊 Great', color: '#4CAF50' },
    { value: 'good', label: '🙂 Good', color: '#8BC34A' },
    { value: 'okay', label: '😐 Okay', color: '#FFC107' },
    { value: 'tired', label: '😴 Tired', color: '#FF9800' },
    { value: 'stressed', label: '😰 Stressed', color: '#F44336' },
  ];

  const handleSubmit = async () => {
    if (!weight) {
      Alert.alert('Error', 'Please enter your current weight');
      return;
    }

    const checkIn = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      mood: mood as any,
      energy: parseInt(energy),
      notes: notes.trim() || undefined,
    };

    await addWeeklyCheckIn(checkIn);
    Alert.alert('Success', 'Weekly check-in completed! Keep up the great work!');
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
            <Text style={styles.modalTitle}>Weekly Check-In</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <TrendingUp color={Colors.primary} size={20} />
                <Text style={styles.label}>Current Weight (kg)</Text>
              </View>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="Enter your weight"
                placeholderTextColor={Colors.mediumGrey}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Heart color={Colors.primary} size={20} />
                <Text style={styles.label}>How are you feeling?</Text>
              </View>
              <View style={styles.moodGrid}>
                {moods.map((m) => (
                  <TouchableOpacity
                    key={m.value}
                    style={[
                      styles.moodButton,
                      mood === m.value && { backgroundColor: m.color },
                    ]}
                    onPress={() => setMood(m.value as any)}
                  >
                    <Text
                      style={[
                        styles.moodText,
                        mood === m.value && styles.moodTextActive,
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Battery color={Colors.primary} size={20} />
                <Text style={styles.label}>Energy Level (1-10)</Text>
              </View>
              <View style={styles.energyContainer}>
                {[...Array(10)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.energyButton,
                      parseInt(energy) > i && styles.energyButtonActive,
                    ]}
                    onPress={() => setEnergy((i + 1).toString())}
                  >
                    <Text
                      style={[
                        styles.energyText,
                        parseInt(energy) > i && styles.energyTextActive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="How was your week? Any challenges or wins?"
                placeholderTextColor={Colors.mediumGrey}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Check-In</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
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
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.darkGrey,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  moodText: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  moodTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  energyContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  energyButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  energyText: {
    fontSize: 12,
    color: Colors.darkGrey,
    fontWeight: '600',
  },
  energyTextActive: {
    color: Colors.white,
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
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});