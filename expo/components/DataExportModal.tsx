import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Download, FileText, Database } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';
import { DataExportService } from '@/services/data-export-service';

interface DataExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DataExportModal({ visible, onClose }: DataExportModalProps) {
  const { workoutLogs, bodyMeasurements, progressPhotos, weeklyCheckIns } = useUserProfile();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'workouts' | 'measurements' | 'checkins' | 'all') => {
    setIsExporting(true);
    try {
      switch (type) {
        case 'workouts':
          if (workoutLogs.length === 0) {
            Alert.alert('No Data', 'No workout data to export');
            return;
          }
          await DataExportService.exportWorkoutsToCSV(workoutLogs);
          break;
        case 'measurements':
          if (bodyMeasurements.length === 0) {
            Alert.alert('No Data', 'No measurement data to export');
            return;
          }
          await DataExportService.exportMeasurementsToCSV(bodyMeasurements);
          break;
        case 'checkins':
          if (weeklyCheckIns.length === 0) {
            Alert.alert('No Data', 'No check-in data to export');
            return;
          }
          await DataExportService.exportCheckInsToCSV(weeklyCheckIns);
          break;
        case 'all':
          if (
            workoutLogs.length === 0 &&
            bodyMeasurements.length === 0 &&
            progressPhotos.length === 0 &&
            weeklyCheckIns.length === 0
          ) {
            Alert.alert('No Data', 'No data to export');
            return;
          }
          await DataExportService.exportAllDataToJSON({
            workoutLogs,
            bodyMeasurements,
            progressPhotos,
            weeklyCheckIns,
          });
          break;
      }
      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Export Data</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>
              Export your fitness data to CSV or JSON format. You can then import it into
              spreadsheet apps or keep it as a backup.
            </Text>

            <View style={styles.exportOptions}>
              <TouchableOpacity
                style={styles.exportCard}
                onPress={() => handleExport('workouts')}
                disabled={isExporting}
              >
                <View style={styles.exportIcon}>
                  <Download color={Colors.primary} size={24} />
                </View>
                <View style={styles.exportInfo}>
                  <Text style={styles.exportTitle}>Workout Logs</Text>
                  <Text style={styles.exportSubtitle}>
                    {workoutLogs.length} workouts • CSV format
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportCard}
                onPress={() => handleExport('measurements')}
                disabled={isExporting}
              >
                <View style={styles.exportIcon}>
                  <FileText color={Colors.secondary} size={24} />
                </View>
                <View style={styles.exportInfo}>
                  <Text style={styles.exportTitle}>Body Measurements</Text>
                  <Text style={styles.exportSubtitle}>
                    {bodyMeasurements.length} measurements • CSV format
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportCard}
                onPress={() => handleExport('checkins')}
                disabled={isExporting}
              >
                <View style={styles.exportIcon}>
                  <FileText color={Colors.success} size={24} />
                </View>
                <View style={styles.exportInfo}>
                  <Text style={styles.exportTitle}>Weekly Check-ins</Text>
                  <Text style={styles.exportSubtitle}>
                    {weeklyCheckIns.length} check-ins • CSV format
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exportCard, styles.exportCardPrimary]}
                onPress={() => handleExport('all')}
                disabled={isExporting}
              >
                <View style={styles.exportIcon}>
                  <Database color={Colors.white} size={24} />
                </View>
                <View style={styles.exportInfo}>
                  <Text style={[styles.exportTitle, styles.exportTitleWhite]}>
                    All Data
                  </Text>
                  <Text style={[styles.exportSubtitle, styles.exportSubtitleWhite]}>
                    Complete backup • JSON format
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {isExporting && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Exporting data...</Text>
              </View>
            )}
          </ScrollView>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
    marginBottom: 24,
  },
  exportOptions: {
    gap: 12,
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    gap: 16,
  },
  exportCardPrimary: {
    backgroundColor: Colors.primary,
  },
  exportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportInfo: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  exportTitleWhite: {
    color: Colors.white,
  },
  exportSubtitle: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  exportSubtitleWhite: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
});
