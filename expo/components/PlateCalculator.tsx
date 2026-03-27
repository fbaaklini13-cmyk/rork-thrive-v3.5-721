import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface PlateCalculatorProps {
  visible: boolean;
  onClose: () => void;
  targetWeight: number;
  barWeight?: number;
}

interface PlateConfig {
  weight: number;
  color: string;
  count: number;
}

export default function PlateCalculator({
  visible,
  onClose,
  targetWeight,
  barWeight = 20,
}: PlateCalculatorProps) {
  const calculation = useMemo(() => {
    const weightToLoad = targetWeight - barWeight;
    const perSide = weightToLoad / 2;
    
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const plateColors: Record<number, string> = {
      25: '#FF0000',
      20: '#0000FF',
      15: '#FFFF00',
      10: '#00FF00',
      5: '#FFFFFF',
      2.5: '#000000',
      1.25: '#808080',
    };

    const plates: PlateConfig[] = [];
    let remaining = perSide;

    for (const plateWeight of availablePlates) {
      const count = Math.floor(remaining / plateWeight);
      if (count > 0) {
        plates.push({
          weight: plateWeight,
          color: plateColors[plateWeight] || Colors.mediumGrey,
          count,
        });
        remaining -= count * plateWeight;
      }
    }

    return { plates, perSide, remaining };
  }, [targetWeight, barWeight]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Plate Calculator</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.weightDisplay}>
              <Text style={styles.weightLabel}>Target Weight</Text>
              <Text style={styles.weightValue}>{targetWeight} kg</Text>
            </View>

            <View style={styles.barDisplay}>
              <Text style={styles.sectionTitle}>Bar: {barWeight} kg</Text>
            </View>

            <View style={styles.perSideDisplay}>
              <Text style={styles.sectionTitle}>Per Side: {calculation.perSide.toFixed(1)} kg</Text>
            </View>

            {calculation.plates.length > 0 ? (
              <View style={styles.platesContainer}>
                <Text style={styles.sectionTitle}>Plates (per side):</Text>
                {calculation.plates.map((plate, index) => (
                  <View key={index} style={styles.plateRow}>
                    <View 
                      style={[
                        styles.plateIndicator,
                        { backgroundColor: plate.color },
                      ]}
                    />
                    <Text style={styles.plateText}>
                      {plate.count}x {plate.weight} kg
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Only the bar needed</Text>
              </View>
            )}

            {calculation.remaining > 0 && (
              <View style={styles.warning}>
                <Text style={styles.warningText}>
                  ⚠️ {calculation.remaining.toFixed(1)} kg remaining (not achievable with standard plates)
                </Text>
              </View>
            )}

            <View style={styles.visualization}>
              <View style={styles.barLine} />
              <View style={styles.platesVisualization}>
                {calculation.plates.map((plate, index) => (
                  <View key={index} style={styles.plateStack}>
                    {Array.from({ length: plate.count }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.plateVisual,
                          { 
                            backgroundColor: plate.color,
                            height: 40 + plate.weight,
                          },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  weightDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  weightLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  barDisplay: {
    backgroundColor: Colors.lightGrey,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  perSideDisplay: {
    backgroundColor: Colors.primary + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  platesContainer: {
    marginBottom: 16,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  plateIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.mediumGrey,
  },
  plateText: {
    fontSize: 15,
    color: Colors.darkGrey,
    fontWeight: '500',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.mediumGrey,
  },
  warning: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 13,
    color: Colors.warning,
  },
  visualization: {
    marginTop: 16,
    alignItems: 'center',
  },
  barLine: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.mediumGrey,
    borderRadius: 4,
    marginBottom: 12,
  },
  platesVisualization: {
    flexDirection: 'row',
    gap: 4,
  },
  plateStack: {
    flexDirection: 'row',
    gap: 2,
  },
  plateVisual: {
    width: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.mediumGrey,
  },
});
