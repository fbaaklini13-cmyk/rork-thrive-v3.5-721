import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import type { WorkoutLog, BodyMeasurement, ProgressPhoto, WeeklyCheckIn } from '@/types/user';

export class DataExportService {
  private static getBaseDir(): string {
    const fs = FileSystem as unknown as { cacheDirectory?: string | null; documentDirectory?: string | null };
    const dir = fs.cacheDirectory ?? fs.documentDirectory ?? null;
    if (!dir) {
      console.error('No writable directory available for export');
      throw new Error('Storage unavailable');
    }
    return dir;
  }

  static async exportWorkoutsToCSV(workoutLogs: WorkoutLog[]): Promise<void> {
    const headers = ['Date', 'Exercise', 'Set Number', 'Weight (kg)', 'Reps', 'Completed', 'Is Warmup', 'Volume (kg)'];
    const rows = [headers.join(',')];

    workoutLogs.forEach(log => {
      log.sets.forEach(set => {
        const volume = set.completed ? set.weight * set.reps : 0;
        const row = [
          new Date(log.date).toLocaleDateString(),
          `"${log.exerciseName}"`,
          set.setNumber.toString(),
          set.weight.toString(),
          set.reps.toString(),
          set.completed ? 'Yes' : 'No',
          set.isWarmup ? 'Yes' : 'No',
          volume.toString(),
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = rows.join('\n');
    const fileName = `workouts_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = `${DataExportService.getBaseDir()}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: 'utf8',
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Workouts',
        UTI: 'public.comma-separated-values-text',
      });
    }
  }

  static async exportMeasurementsToCSV(measurements: BodyMeasurement[]): Promise<void> {
    const headers = [
      'Date',
      'Neck (cm)',
      'Chest (cm)',
      'Left Bicep (cm)',
      'Right Bicep (cm)',
      'Waist (cm)',
      'Hips (cm)',
      'Left Thigh (cm)',
      'Right Thigh (cm)',
      'Left Calf (cm)',
      'Right Calf (cm)',
      'Notes',
    ];
    const rows = [headers.join(',')];

    measurements.forEach(m => {
      const row = [
        new Date(m.date).toLocaleDateString(),
        m.neck?.toString() || '',
        m.chest?.toString() || '',
        m.leftBicep?.toString() || '',
        m.rightBicep?.toString() || '',
        m.waist?.toString() || '',
        m.hips?.toString() || '',
        m.leftThigh?.toString() || '',
        m.rightThigh?.toString() || '',
        m.leftCalf?.toString() || '',
        m.rightCalf?.toString() || '',
        m.notes ? `"${m.notes}"` : '',
      ];
      rows.push(row.join(','));
    });

    const csvContent = rows.join('\n');
    const fileName = `body_measurements_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = `${DataExportService.getBaseDir()}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: 'utf8',
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Body Measurements',
        UTI: 'public.comma-separated-values-text',
      });
    }
  }

  static async exportCheckInsToCSV(checkIns: WeeklyCheckIn[]): Promise<void> {
    const headers = ['Date', 'Weight (kg)', 'Mood', 'Energy (1-10)', 'Notes'];
    const rows = [headers.join(',')];

    checkIns.forEach(c => {
      const row = [
        new Date(c.date).toLocaleDateString(),
        c.weight.toString(),
        c.mood,
        c.energy.toString(),
        c.notes ? `"${c.notes}"` : '',
      ];
      rows.push(row.join(','));
    });

    const csvContent = rows.join('\n');
    const fileName = `check_ins_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = `${DataExportService.getBaseDir()}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: 'utf8',
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Check-ins',
        UTI: 'public.comma-separated-values-text',
      });
    }
  }

  static async exportAllDataToJSON(data: {
    workoutLogs: WorkoutLog[];
    bodyMeasurements: BodyMeasurement[];
    progressPhotos: ProgressPhoto[];
    weeklyCheckIns: WeeklyCheckIn[];
  }): Promise<void> {
    const exportData = {
      exportDate: new Date().toISOString(),
      ...data,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const fileName = `fitness_data_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${DataExportService.getBaseDir()}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: 'utf8',
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Export All Data',
        UTI: 'public.json',
      });
    }
  }

  static generateWorkoutSummaryText(workoutLogs: WorkoutLog[]): string {
    if (workoutLogs.length === 0) {
      return 'No workout data available.';
    }

    const totalWorkouts = workoutLogs.length;
    const totalVolume = workoutLogs.reduce((total, log) =>
      total + log.sets.reduce((setTotal, set) =>
        setTotal + (set.completed ? set.weight * set.reps : 0), 0
      ), 0
    );

    const exerciseCount = new Set(workoutLogs.map(log => log.exerciseName)).size;

    let summary = `Workout Summary\n`;
    summary += `================\n\n`;
    summary += `Total Workouts: ${totalWorkouts}\n`;
    summary += `Total Volume: ${(totalVolume / 1000).toFixed(1)}K kg\n`;
    summary += `Unique Exercises: ${exerciseCount}\n\n`;

    summary += `Recent Workouts:\n`;
    summary += `----------------\n`;
    
    workoutLogs
      .slice(-10)
      .reverse()
      .forEach(log => {
        const completedSets = log.sets.filter(s => s.completed).length;
        const totalSets = log.sets.length;
        summary += `${new Date(log.date).toLocaleDateString()} - ${log.exerciseName} (${completedSets}/${totalSets} sets)\n`;
      });

    return summary;
  }
}
