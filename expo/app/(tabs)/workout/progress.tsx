import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { 
  TrendingUp, 
  Calendar, 
  Dumbbell, 
  Activity,
  Camera,
  Ruler,
  Plus,
} from 'lucide-react-native';
import { Palette } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';
import BodyMeasurementsModal from '@/components/BodyMeasurementsModal';
import ProgressPhotosModal from '@/components/ProgressPhotosModal';
import MuscleHeatmap from '@/components/MuscleHeatmap';
import StrengthBenchmark from '@/components/StrengthBenchmark';
import MotivationalBanner from '@/components/MotivationalBanner';
import DataExportModal from '@/components/DataExportModal';
import { groupSessions } from '@/lib/workout-sessions';

type TimeFilter = '3M' | '6M' | '1Y' | 'ALL';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function ProgressScreen() {
  const { workoutLogs, weeklyCheckIns, bodyMeasurements, progressPhotos, addBodyMeasurement, addProgressPhoto } = useUserProfile();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('3M');
  const [measurementsModalVisible, setMeasurementsModalVisible] = useState(false);
  const [photosModalVisible, setPhotosModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getFilteredDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case '3M':
        return new Date(now.setMonth(now.getMonth() - 3));
      case '6M':
        return new Date(now.setMonth(now.getMonth() - 6));
      case '1Y':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'ALL':
        return new Date(0);
      default:
        return new Date(now.setMonth(now.getMonth() - 3));
    }
  };

  const filteredWorkouts = useMemo(() => {
    const filterDate = getFilteredDate();
    return workoutLogs.filter(log => new Date(log.date) >= filterDate);
  }, [workoutLogs, timeFilter]);

  // One WorkoutLog is one EXERCISE; these stats are about workouts, so they count
  // sessions (lib/workout-sessions.ts). Before 24 Sep a six-exercise workout read
  // as "6 workouts" and "9.0h" -- the time was the log count x 1.5h, a number the
  // app never measured. Durations are not stored, so the time stat is now sets done.
  const sessions = useMemo(() => groupSessions(filteredWorkouts), [filteredWorkouts]);

  const weeklyStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const floor = `${oneWeekAgo.getFullYear()}-${String(oneWeekAgo.getMonth() + 1).padStart(2, '0')}-${String(oneWeekAgo.getDate()).padStart(2, '0')}`;
    const recent = sessions.filter(s => s.day >= floor);
    return {
      week: getCurrentWeek(),
      workoutCount: recent.length,
      completedSets: recent.reduce((n, s) => n + s.completedSets, 0),
      totalVolume: recent.reduce((n, s) => n + s.volumeKg, 0),
    };
  }, [sessions]);

  const workoutsByWeek = useMemo(() => {
    const weeks = new Map<string, { week: string; count: number }>();
    sessions.forEach(s => {
      const date = new Date(`${s.day}T12:00:00`);
      const year = date.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      const key = `${year}-W${week}`;
      const entry = weeks.get(key) ?? { week: `W${week}`, count: 0 };
      entry.count += 1;
      weeks.set(key, entry);
    });
    return [...weeks.values()];
  }, [sessions]);

  const totalCompletedSets = useMemo(() => sessions.reduce((n, s) => n + s.completedSets, 0), [sessions]);

  const totalVolume = useMemo(() => {
    return filteredWorkouts.reduce((total, log) => {
      return total + log.sets.reduce((setTotal, set) => {
        return setTotal + (set.completed ? set.weight * set.reps : 0);
      }, 0);
    }, 0);
  }, [filteredWorkouts]);

  const filters: TimeFilter[] = ['3M', '6M', '1Y', 'ALL'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              timeFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setTimeFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Calendar color={Palette.accent} size={24} />
          <Text style={styles.summaryTitle}>Week {weeklyStats.week} Summary</Text>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <Dumbbell color={Palette.accent} size={20} />
            <Text style={styles.summaryLabel}>Workouts</Text>
            <Text style={styles.summaryValue}>{weeklyStats.workoutCount}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Activity color={Palette.accent} size={20} />
            <Text style={styles.summaryLabel}>Sets done</Text>
            <Text style={styles.summaryValue}>{weeklyStats.completedSets}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <TrendingUp color={Palette.good} size={20} />
            <Text style={styles.summaryLabel}>Volume</Text>
            <Text style={styles.summaryValue}>
              {(weeklyStats.totalVolume / 1000).toFixed(1)}K kg
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Frequency</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {workoutsByWeek.slice(-8).map((item, index) => {
              const maxCount = Math.max(...workoutsByWeek.map(w => w.count));
              const height = (item.count / maxCount) * 120;
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: height || 10 }]}>
                      <Text style={styles.barValue}>{item.count}</Text>
                    </View>
                  </View>
                  <Text style={styles.barLabel}>{item.week}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Dumbbell color={Palette.accent} size={28} />
            <Text style={styles.overviewValue}>{sessions.length}</Text>
            <Text style={styles.overviewLabel}>Total Workouts</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <Activity color={Palette.accent} size={28} />
            <Text style={styles.overviewValue}>{totalCompletedSets}</Text>
            <Text style={styles.overviewLabel}>Sets Done</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <TrendingUp color={Palette.good} size={28} />
            <Text style={styles.overviewValue}>
              {(totalVolume / 1000).toFixed(0)}K
            </Text>
            <Text style={styles.overviewLabel}>Volume (kg)</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <Calendar color={Palette.warn} size={28} />
            <Text style={styles.overviewValue}>
              {weeklyCheckIns.length}
            </Text>
            <Text style={styles.overviewLabel}>Check-ins</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Progress</Text>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => setPhotosModalVisible(true)}
        >
          <Camera color={Palette.accent} size={24} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Progress Photos</Text>
            <Text style={styles.featureDescription}>
              {progressPhotos.length} photos saved
            </Text>
          </View>
          <Plus color={Palette.accent} size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => setMeasurementsModalVisible(true)}
        >
          <Ruler color={Palette.accent} size={24} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Body Measurements</Text>
            <Text style={styles.featureDescription}>
              {bodyMeasurements.length} measurements tracked
            </Text>
          </View>
          <Plus color={Palette.accent} size={20} />
        </TouchableOpacity>
      </View>

      <BodyMeasurementsModal
        visible={measurementsModalVisible}
        onClose={() => setMeasurementsModalVisible(false)}
        onSave={addBodyMeasurement}
        lastMeasurement={bodyMeasurements[bodyMeasurements.length - 1]}
      />

      <ProgressPhotosModal
        visible={photosModalVisible}
        onClose={() => setPhotosModalVisible(false)}
        onSave={addProgressPhoto}
      />

      <MotivationalBanner />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Muscle Activation</Text>
          <TouchableOpacity onPress={() => setExportModalVisible(true)}>
            <Text style={styles.exportLink}>Export Data</Text>
          </TouchableOpacity>
        </View>
        <MuscleHeatmap timeRange={timeFilter === '3M' ? '30d' : timeFilter === '6M' ? '90d' : '90d'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strength Benchmarks</Text>
        <View style={styles.card}>
          <StrengthBenchmark />
        </View>
      </View>

      <DataExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Palette.canvasRaised,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  filterButtonActive: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.inkMuted,
  },
  filterTextActive: {
    color: Palette.ink,
  },
  summaryCard: {
    backgroundColor: Palette.canvasRaised,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.ink,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Palette.line,
    marginHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: Palette.inkMuted,
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Palette.ink,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Palette.ink,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    backgroundColor: Palette.accent,
    borderRadius: 4,
    minHeight: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.canvas,
  },
  barLabel: {
    fontSize: 10,
    color: Palette.inkMuted,
    marginTop: 4,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    minWidth: (CARD_WIDTH - 12) / 2,
    backgroundColor: Palette.canvasRaised,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Palette.ink,
    marginTop: 12,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 13,
    color: Palette.inkMuted,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvasRaised,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.ink,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: Palette.inkMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.accent,
  },
  card: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
