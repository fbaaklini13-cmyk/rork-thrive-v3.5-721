import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { Palette } from '@/constants/theme';

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
          color: plateColors[plateWeight] || Palette.inkMuted,
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
              <X color={Palette.ink} size={24} />
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
    backgroundColor: Palette.canvasRaised,
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
    borderBottomColor: Palette.line,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Palette.ink,
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
    color: Palette.inkMuted,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Palette.accent,
  },
  barDisplay: {
    backgroundColor: Palette.canvasRaised,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  perSideDisplay: {
    backgroundColor: Palette.canvasRaised + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.ink,
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
    borderColor: Palette.lineStrong,
  },
  plateText: {
    fontSize: 15,
    color: Palette.ink,
    fontWeight: '500',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Palette.inkMuted,
  },
  warning: {
    backgroundColor: Palette.warn + '1F',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 13,
    color: Palette.warn,
  },
  visualization: {
    marginTop: 16,
    alignItems: 'center',
  },
  barLine: {
    width: '100%',
    height: 8,
    backgroundColor: Palette.lineStrong,
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
    borderColor: Palette.lineStrong,
  },
});
