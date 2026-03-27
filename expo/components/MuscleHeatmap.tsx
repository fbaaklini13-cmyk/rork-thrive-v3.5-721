import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useUserProfile } from '@/hooks/user-profile-store';
import Svg, { Path, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

type MuscleGroup = 
  | 'chest' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'forearms'
  | 'abs' 
  | 'obliques'
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves'
  | 'upper_back'
  | 'lats'
  | 'lower_back';

interface MuscleData {
  name: string;
  volume: number;
  frequency: number;
}

interface MuscleHeatmapProps {
  timeRange?: '7d' | '30d' | '90d';
  compact?: boolean;
  overrideIntensities?: Partial<Record<MuscleGroup, number>>;
}

type KeywordMatcher = string | RegExp;

const MUSCLE_GROUPS = [
  { id: 'triceps' as MuscleGroup, label: 'Triceps', view: 'back' },
  { id: 'chest' as MuscleGroup, label: 'Chest', view: 'front' },
  { id: 'shoulders' as MuscleGroup, label: 'Shoulders', view: 'front' },
  { id: 'biceps' as MuscleGroup, label: 'Biceps', view: 'front' },
  { id: 'upper_back' as MuscleGroup, label: 'Back', view: 'back' },
  { id: 'abs' as MuscleGroup, label: 'Abs', view: 'front' },
  { id: 'quads' as MuscleGroup, label: 'Quadriceps', view: 'front' },
  { id: 'hamstrings' as MuscleGroup, label: 'Hamstrings', view: 'back' },
  { id: 'glutes' as MuscleGroup, label: 'Glutes', view: 'back' },
];

const EMPTY_MUSCLE_DATA: Record<MuscleGroup, MuscleData> = {
  chest: { name: 'chest', volume: 0, frequency: 0 },
  shoulders: { name: 'shoulders', volume: 0, frequency: 0 },
  biceps: { name: 'biceps', volume: 0, frequency: 0 },
  triceps: { name: 'triceps', volume: 0, frequency: 0 },
  forearms: { name: 'forearms', volume: 0, frequency: 0 },
  abs: { name: 'abs', volume: 0, frequency: 0 },
  obliques: { name: 'obliques', volume: 0, frequency: 0 },
  quads: { name: 'quads', volume: 0, frequency: 0 },
  hamstrings: { name: 'hamstrings', volume: 0, frequency: 0 },
  glutes: { name: 'glutes', volume: 0, frequency: 0 },
  calves: { name: 'calves', volume: 0, frequency: 0 },
  upper_back: { name: 'upper_back', volume: 0, frequency: 0 },
  lats: { name: 'lats', volume: 0, frequency: 0 },
  lower_back: { name: 'lower_back', volume: 0, frequency: 0 },
};

export default function MuscleHeatmap({ timeRange = '30d', compact = false, overrideIntensities }: MuscleHeatmapProps) {
  const { workoutLogs } = useUserProfile();
  console.log('[MuscleHeatmap] render', { timeRange, compact });

  const { data: muscleData, hasActivity } = useMemo(() => {
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const muscleStats: Partial<Record<MuscleGroup, MuscleData>> = {};

    workoutLogs
      .filter(log => new Date(log.date) >= cutoffDate)
      .forEach(log => {
        const exerciseName = log.exerciseName.toLowerCase();
        const totalVolume = log.sets.reduce((sum, set) => 
          sum + (set.completed ? set.weight * set.reps : 0), 0
        );

        const muscles = inferMuscleGroups(exerciseName);
        muscles.forEach(muscle => {
          if (!muscleStats[muscle]) {
            muscleStats[muscle] = { name: muscle, volume: 0, frequency: 0 };
          }
          muscleStats[muscle].volume += totalVolume;
          muscleStats[muscle].frequency += 1;
        });
      });

    const mergedData = Object.keys(EMPTY_MUSCLE_DATA).reduce((acc, key) => {
      const muscle = key as MuscleGroup;
      const stats = muscleStats[muscle];
      acc[muscle] = stats
        ? { ...stats }
        : { ...EMPTY_MUSCLE_DATA[muscle] };
      return acc;
    }, {} as Record<MuscleGroup, MuscleData>);

    const activityPresent = Object.values(mergedData).some(muscle => muscle.volume > 0);

    return { data: mergedData, hasActivity: activityPresent };
  }, [workoutLogs, timeRange]);

  const DEFAULT_EXAMPLE: Record<MuscleGroup, number> = {
    chest: 1,
    shoulders: 0.85,
    triceps: 0.8,
    biceps: 0.25,
    forearms: 0,
    abs: 0,
    obliques: 0,
    quads: 0,
    hamstrings: 0,
    glutes: 0,
    calves: 0,
    upper_back: 0,
    lats: 0,
    lower_back: 0,
  };

  const intensityOverrides = overrideIntensities ?? (hasActivity ? undefined : DEFAULT_EXAMPLE);

  const maxVolume = useMemo(() => {
    const volumes = Object.values(muscleData).map(m => m.volume);
    return Math.max(...volumes, 1);
  }, [muscleData]);

  const getMuscleIntensity = (muscle: MuscleGroup): number => {
    if (intensityOverrides && typeof intensityOverrides[muscle] === 'number') {
      return Math.max(0, Math.min(1, intensityOverrides[muscle] as number));
    }
    const data = muscleData[muscle];
    if (!data || data.volume === 0) return 0;
    return Math.min(data.volume / maxVolume, 1);
  };

  const getMuscleColor = (intensity: number): string => {
    if (intensity <= 0) {
      return '#404040';
    }

    const colorStops = [
      { value: 0, color: '#1f2937' },
      { value: 0.25, color: '#14532d' },
      { value: 0.5, color: '#15803d' },
      { value: 0.75, color: '#22c55e' },
      { value: 1, color: '#a3e635' },
    ];

    const clampIntensity = Math.min(Math.max(intensity, 0), 1);

    let lower = colorStops[0];
    let upper = colorStops[colorStops.length - 1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      const current = colorStops[i];
      const next = colorStops[i + 1];

      if (clampIntensity >= current.value && clampIntensity <= next.value) {
        lower = current;
        upper = next;
        break;
      }
    }

    if (upper.value === lower.value) {
      return lower.color;
    }

    const progress = (clampIntensity - lower.value) / (upper.value - lower.value);

    const interpolate = (start: number, end: number) =>
      Math.round(start + (end - start) * progress);

    const hexToRgb = (hex: string) => {
      const clean = hex.replace('#', '');
      const bigint = parseInt(clean, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    const lowerRgb = hexToRgb(lower.color);
    const upperRgb = hexToRgb(upper.color);

    const r = interpolate(lowerRgb.r, upperRgb.r);
    const g = interpolate(lowerRgb.g, upperRgb.g);
    const b = interpolate(lowerRgb.b, upperRgb.b);

    return `rgb(${r}, ${g}, ${b})`;
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {!hasActivity && (
          <View style={styles.compactEmptyState}>
            <Text style={styles.emptyStateTitle}>Log a workout to light things up</Text>
            <Text style={styles.emptyStateSubtitle}>
              Muscles glow based on the volume you log in the past few weeks.
            </Text>
          </View>
        )}
        <View style={styles.gridContainer}>
          {MUSCLE_GROUPS.map((muscle) => {
            const intensity = getMuscleIntensity(muscle.id);
            const color = getMuscleColor(intensity);

            return (
              <View key={muscle.id} style={styles.muscleCard}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                  <Text style={styles.muscleLabel}>{muscle.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="muscle-heatmap-container">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasActivity && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No recent training data</Text>
            <Text style={styles.emptyStateSubtitle}>
              Track a few workouts to see which muscle groups are heating up.
            </Text>
          </View>
        )}
        <View style={styles.bodyRow}>
          <View style={styles.singleBodyView}>
            <Text style={styles.viewLabel}>FRONT</Text>
            <Svg width={width * 0.45} height={height * 0.75} viewBox="0 0 200 500">
              <Defs>
                <LinearGradient id="frontBodyGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#5f5f5f" />
                  <Stop offset="0.35" stopColor="#4b4b4b" />
                  <Stop offset="1" stopColor="#2b2b2b" />
                </LinearGradient>
                <LinearGradient id="frontHighlight" x1="0.3" y1="0" x2="0.7" y2="1">
                  <Stop offset="0" stopColor="rgba(255,255,255,0.15)" />
                  <Stop offset="0.5" stopColor="rgba(255,255,255,0.05)" />
                  <Stop offset="1" stopColor="rgba(255,255,255,0)" />
                </LinearGradient>
              </Defs>
              <FrontBodyView 
                getMuscleColor={getMuscleColor}
                getMuscleIntensity={getMuscleIntensity}
              />
            </Svg>
          </View>

          <View style={styles.singleBodyView}>
            <Text style={styles.viewLabel}>BACK</Text>
            <Svg width={width * 0.45} height={height * 0.75} viewBox="0 0 200 500">
              <Defs>
                <LinearGradient id="backBodyGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#5a5a5a" />
                  <Stop offset="0.4" stopColor="#3f3f3f" />
                  <Stop offset="1" stopColor="#222222" />
                </LinearGradient>
                <LinearGradient id="backHighlight" x1="0.3" y1="0" x2="0.7" y2="1">
                  <Stop offset="0" stopColor="rgba(255,255,255,0.12)" />
                  <Stop offset="0.6" stopColor="rgba(255,255,255,0.04)" />
                  <Stop offset="1" stopColor="rgba(255,255,255,0)" />
                </LinearGradient>
              </Defs>
              <BackBodyView 
                getMuscleColor={getMuscleColor}
                getMuscleIntensity={getMuscleIntensity}
              />
            </Svg>
          </View>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#404040' }]} />
            <Text style={styles.legendText}>No Activity</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#15803d' }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#a3e635' }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const FrontBodyView = ({ 
  getMuscleColor,
  getMuscleIntensity 
}: { 
  getMuscleColor: (intensity: number) => string;
  getMuscleIntensity: (muscle: MuscleGroup) => number;
}) => {
  return (
    <G>
      <Path d="M100 8 C95 8 91 10 88 14 L87 18 L86 24 L86 32 C86 36 87 40 90 42 L95 44 L100 44 L105 44 L110 42 C113 40 114 36 114 32 L114 24 L113 18 L112 14 C109 10 105 8 100 8 Z" fill="#3A3A3A" stroke="#222" strokeWidth="0.6" />
      <Path d="M93 18 L95 20 L100 20 L105 20 L107 18 L107 14 L106 12 L100 11 L94 12 L93 14 Z" fill="#505050" opacity="0.4" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M88 22 L90 26 L92 32 L93 40 C94 42 95 43 96 44 L89 44 C87 42 86 38 85 32 L85 26 Z" fill="#404040" stroke="#222" strokeWidth="0.5" />
      <Path d="M112 22 L110 26 L108 32 L107 40 C106 42 105 43 104 44 L111 44 C113 42 114 38 115 32 L115 26 Z" fill="#404040" stroke="#222" strokeWidth="0.5" />
      
      <Path d="M82 46 C80 50 78 56 76 62 L74 70 L72 80 L71 90 L70 100 C70 102 71 104 72 105 C73 102 74 98 75 93 L77 83 L79 72 C80 66 81 60 83 54 L85 48 Z" fill={getMuscleColor(getMuscleIntensity('shoulders'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M118 46 C120 50 122 56 124 62 L126 70 L128 80 L129 90 L130 100 C130 102 129 104 128 105 C127 102 126 98 125 93 L123 83 L121 72 C120 66 119 60 117 54 L115 48 Z" fill={getMuscleColor(getMuscleIntensity('shoulders'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="79" cy="70" rx="5" ry="14" fill={getMuscleColor(getMuscleIntensity('shoulders'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      <Ellipse cx="121" cy="70" rx="5" ry="14" fill={getMuscleColor(getMuscleIntensity('shoulders'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M86 44 C88 44 90 44 92 45 L96 46 L100 46 L104 46 L108 45 C110 44 112 44 114 44 C116 46 118 50 119 56 L120 68 C120 78 119 88 118 98 L117 110 C116 116 114 122 112 126 L110 130 L90 130 L88 126 C86 122 84 116 83 110 L82 98 C81 88 80 78 80 68 L81 56 C82 50 84 46 86 44 Z" fill="#3A3A3A" stroke="#222" strokeWidth="0.8" />
      
      <Path d="M90 52 C92 50 95 49 100 49 C105 49 108 50 110 52 C112 54 114 58 115 65 L116 78 C116 88 115 98 114 108 L113 118 C112 122 110 125 108 126 L92 126 C90 125 88 122 87 118 L86 108 C85 98 84 88 84 78 L85 65 C86 58 88 54 90 52 Z" fill={getMuscleColor(getMuscleIntensity('chest'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Path d="M92 58 L94 56 L96 55 L100 55 L104 55 L106 56 L108 58 L109 62 L110 68 L111 76 C111 84 110 92 109 100 L108 108 C107 113 106 117 105 119 L104 121 L96 121 C95 119 94 113 93 108 L92 100 C91 92 90 84 90 76 L91 68 L92 62 Z" fill={getMuscleColor(getMuscleIntensity('chest'))} opacity="0.5" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Ellipse cx="94" cy="74" rx="9" ry="18" fill={getMuscleColor(getMuscleIntensity('chest'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="106" cy="74" rx="9" ry="18" fill={getMuscleColor(getMuscleIntensity('chest'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M96 62 Q98 64 100 64 Q102 64 104 62" stroke="#1A1A1A" strokeWidth="0.4" fill="none" />
      <Path d="M94 75 Q96 77 98 77" stroke="#1A1A1A" strokeWidth="0.4" fill="none" />
      <Path d="M102 77 Q104 77 106 75" stroke="#1A1A1A" strokeWidth="0.4" fill="none" />
      <Path d="M94 88 Q96 90 98 90" stroke="#1A1A1A" strokeWidth="0.4" fill="none" />
      <Path d="M102 90 Q104 90 106 88" stroke="#1A1A1A" strokeWidth="0.4" fill="none" />
      
      <Path d="M70 100 L69 110 C68 122 67 134 66 146 L65 160 C65 164 66 166 67 167 C68 162 69 156 70 148 L71 136 C72 124 73 112 74 102 L75 98 Z" fill={getMuscleColor(getMuscleIntensity('biceps'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M130 100 L131 110 C132 122 133 134 134 146 L135 160 C135 164 134 166 133 167 C132 162 131 156 130 148 L129 136 C128 124 127 112 126 102 L125 98 Z" fill={getMuscleColor(getMuscleIntensity('biceps'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="70" cy="122" rx="4.5" ry="15" fill={getMuscleColor(getMuscleIntensity('biceps'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      <Ellipse cx="130" cy="122" rx="4.5" ry="15" fill={getMuscleColor(getMuscleIntensity('biceps'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M89 130 L88 145 C87 157 86 170 86 184 L87 200 L113 200 L114 184 C114 170 113 157 112 145 L111 130 Z" fill="#3A3A3A" stroke="#222" strokeWidth="0.8" />
      
      <Path d="M92 135 L91 150 C90 162 90 176 90 190 L91 198 L109 198 L110 190 C110 176 110 162 109 150 L108 135 Z" fill={getMuscleColor(getMuscleIntensity('abs'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Path d="M88 132 L86 145 C85 155 84 166 84 178 C84 188 85 196 87 202 L89 206 C90 200 91 192 92 182 L93 168 C93 158 92 148 91 138 L90 132 Z" fill={getMuscleColor(getMuscleIntensity('obliques'))} stroke="#1A1A1A" strokeWidth="0.7" opacity="0.9" />
      <Path d="M112 132 L114 145 C115 155 116 166 116 178 C116 188 115 196 113 202 L111 206 C110 200 109 192 108 182 L107 168 C107 158 108 148 109 138 L110 132 Z" fill={getMuscleColor(getMuscleIntensity('obliques'))} stroke="#1A1A1A" strokeWidth="0.7" opacity="0.9" />
      
      <Ellipse cx="95" cy="145" rx="6" ry="9" fill={getMuscleColor(getMuscleIntensity('abs'))} opacity="0.4" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="105" cy="145" rx="6" ry="9" fill={getMuscleColor(getMuscleIntensity('abs'))} opacity="0.4" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Ellipse cx="95" cy="161" rx="6" ry="9" fill={getMuscleColor(getMuscleIntensity('abs'))} opacity="0.4" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="105" cy="161" rx="6" ry="9" fill={getMuscleColor(getMuscleIntensity('abs'))} opacity="0.4" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Ellipse cx="95" cy="178" rx="6" ry="9" fill={getMuscleColor(getMuscleIntensity('abs'))} opacity="0.4" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="105" cy="178" rx="6" ry="9" fill={getMuscleColor(getMuscleIntensity('abs'))} opacity="0.4" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M100 139 L100 152" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M100 156 L100 170" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M100 174 L100 188" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      
      <Path d="M86 200 L85 218 C84 235 83 252 83 270 L82 290 C82 308 82 326 83 344 L84 364 C85 382 86 400 88 418 L90 438 C91 453 93 468 95 483 L97 498 L99 513 C100 526 101 539 102 550 L100 552 C98 540 97 528 96 515 L94 500 L92 485 C90 470 89 455 88 440 L86 420 C84 402 83 384 82 366 L81 346 C80 328 80 310 80 292 L81 272 C81 254 82 236 83 220 L84 200 Z" fill={getMuscleColor(getMuscleIntensity('quads'))} stroke="#1A1A1A" strokeWidth="0.8" />
      <Path d="M114 200 L115 218 C116 235 117 252 117 270 L118 290 C118 308 118 326 117 344 L116 364 C115 382 114 400 112 418 L110 438 C109 453 107 468 105 483 L103 498 L101 513 C100 526 99 539 98 550 L100 552 C102 540 103 528 104 515 L106 500 L108 485 C110 470 111 455 112 440 L114 420 C116 402 117 384 118 366 L119 346 C120 328 120 310 120 292 L119 272 C119 254 118 236 117 220 L116 200 Z" fill={getMuscleColor(getMuscleIntensity('quads'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Ellipse cx="87" cy="242" rx="8" ry="32" fill={getMuscleColor(getMuscleIntensity('quads'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="113" cy="242" rx="8" ry="32" fill={getMuscleColor(getMuscleIntensity('quads'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M85 280 L84 300 L83 320 L82 340 L82 360" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      <Path d="M115 280 L116 300 L117 320 L118 340 L118 360" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      
      <Path d="M86 420 L85 440 L84 460 L83 480 L82 500 L81 520" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      <Path d="M114 420 L115 440 L116 460 L117 480 L118 500 L119 520" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      
      <Path d="M65 160 L64 178 C63 193 62 210 62 228 L61 248 C61 254 62 258 63 260 C64 254 65 246 66 236 L67 220 C68 205 69 190 70 176 L71 164 Z" fill={getMuscleColor(getMuscleIntensity('forearms'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M135 160 L136 178 C137 193 138 210 138 228 L139 248 C139 254 138 258 137 260 C136 254 135 246 134 236 L133 220 C132 205 131 190 130 176 L129 164 Z" fill={getMuscleColor(getMuscleIntensity('forearms'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="66" cy="192" rx="4" ry="16" fill={getMuscleColor(getMuscleIntensity('forearms'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.4" />
      <Ellipse cx="134" cy="192" rx="4" ry="16" fill={getMuscleColor(getMuscleIntensity('forearms'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M80 480 C79 488 78 496 77 504 L76 514 C75 522 75 530 76 538 L77 550 L79 551 C80 544 81 536 82 528 L83 518 C84 510 85 502 86 494 L87 484 Z" fill={getMuscleColor(getMuscleIntensity('calves'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M120 480 C121 488 122 496 123 504 L124 514 C125 522 125 530 124 538 L123 550 L121 551 C120 544 119 536 118 528 L117 518 C116 510 115 502 114 494 L113 484 Z" fill={getMuscleColor(getMuscleIntensity('calves'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="82" cy="508" rx="5" ry="26" fill={getMuscleColor(getMuscleIntensity('calves'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="118" cy="508" rx="5" ry="26" fill={getMuscleColor(getMuscleIntensity('calves'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.5" />
    </G>
  );
};

const BackBodyView = ({ 
  getMuscleColor,
  getMuscleIntensity 
}: { 
  getMuscleColor: (intensity: number) => string;
  getMuscleIntensity: (muscle: MuscleGroup) => number;
}) => {
  return (
    <G>
      <Path d="M100 8 C95 8 91 10 88 14 L87 18 L86 24 L86 32 C86 36 87 40 90 42 L95 44 L100 44 L105 44 L110 42 C113 40 114 36 114 32 L114 24 L113 18 L112 14 C109 10 105 8 100 8 Z" fill="#3A3A3A" stroke="#222" strokeWidth="0.6" />
      <Path d="M93 18 L95 20 L100 20 L105 20 L107 18 L107 14 L106 12 L100 11 L94 12 L93 14 Z" fill="#505050" opacity="0.4" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M82 46 C80 50 78 56 76 62 L74 70 L72 80 L71 90 L70 100 C70 102 71 104 72 105 C73 102 74 98 75 93 L77 83 L79 72 C80 66 81 60 83 54 L85 48 Z" fill={getMuscleColor(getMuscleIntensity('shoulders'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M118 46 C120 50 122 56 124 62 L126 70 L128 80 L129 90 L130 100 C130 102 129 104 128 105 C127 102 126 98 125 93 L123 83 L121 72 C120 66 119 60 117 54 L115 48 Z" fill={getMuscleColor(getMuscleIntensity('shoulders'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="79" cy="70" rx="5" ry="14" fill={getMuscleColor(getMuscleIntensity('shoulders'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      <Ellipse cx="121" cy="70" rx="5" ry="14" fill={getMuscleColor(getMuscleIntensity('shoulders'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M86 44 C88 44 90 44 92 45 L96 46 L100 46 L104 46 L108 45 C110 44 112 44 114 44 C116 46 118 50 119 56 L120 68 C120 78 119 88 118 98 L117 110 C116 116 114 122 112 126 L110 130 L90 130 L88 126 C86 122 84 116 83 110 L82 98 C81 88 80 78 80 68 L81 56 C82 50 84 46 86 44 Z" fill="#3A3A3A" stroke="#222" strokeWidth="0.8" />
      
      <Path d="M90 52 C92 50 95 49 100 49 C105 49 108 50 110 52 C112 54 114 58 115 65 L116 78 C116 88 115 98 114 108 L113 118 C112 122 110 125 108 126 L92 126 C90 125 88 122 87 118 L86 108 C85 98 84 88 84 78 L85 65 C86 58 88 54 90 52 Z" fill={getMuscleColor(getMuscleIntensity('upper_back'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Path d="M92 58 L94 56 L96 55 L100 55 L104 55 L106 56 L108 58 L109 62 L110 68 L111 76 C111 84 110 92 109 100 L108 108 C107 113 106 117 105 119 L104 121 L96 121 C95 119 94 113 93 108 L92 100 C91 92 90 84 90 76 L91 68 L92 62 Z" fill={getMuscleColor(getMuscleIntensity('upper_back'))} opacity="0.5" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M94 62 L96 60 L100 60 L104 60 L106 62 L107 66 L108 72 L108 80 C108 88 107 96 106 104 L105 112 C105 115 104 118 103 119 L97 119 C96 118 95 115 95 112 L94 104 C93 96 92 88 92 80 L92 72 L93 66 Z" fill={getMuscleColor(getMuscleIntensity('upper_back'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M100 56 L100 64" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M100 68 L100 76" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M100 80 L100 88" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      
      <Path d="M70 100 L69 110 C68 122 67 134 66 146 L65 160 C65 164 66 166 67 167 C68 162 69 156 70 148 L71 136 C72 124 73 112 74 102 L75 98 Z" fill={getMuscleColor(getMuscleIntensity('triceps'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M130 100 L131 110 C132 122 133 134 134 146 L135 160 C135 164 134 166 133 167 C132 162 131 156 130 148 L129 136 C128 124 127 112 126 102 L125 98 Z" fill={getMuscleColor(getMuscleIntensity('triceps'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="70" cy="122" rx="4.5" ry="15" fill={getMuscleColor(getMuscleIntensity('triceps'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      <Ellipse cx="130" cy="122" rx="4.5" ry="15" fill={getMuscleColor(getMuscleIntensity('triceps'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M89 130 L88 145 C87 157 86 170 86 184 L87 200 L113 200 L114 184 C114 170 113 157 112 145 L111 130 Z" fill="#3A3A3A" stroke="#222" strokeWidth="0.8" />
      
      <Path d="M92 135 L91 150 C90 162 90 176 90 190 L91 198 L109 198 L110 190 C110 176 110 162 109 150 L108 135 Z" fill={getMuscleColor(getMuscleIntensity('lats'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Path d="M94 140 L93 155 C92 165 92 176 92 187 L93 195 L107 195 L108 187 C108 176 108 165 107 155 L106 140 Z" fill={getMuscleColor(getMuscleIntensity('lats'))} opacity="0.5" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M96 145 L95 158 C94 166 94 175 94 184 L95 191 L105 191 L106 184 C106 175 106 166 105 158 L104 145 Z" fill={getMuscleColor(getMuscleIntensity('lower_back'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Path d="M100 142 L100 155" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M100 159 L100 172" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M100 176 L100 188" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      
      <Path d="M90 200 L89 214 C88 224 88 234 88 244 L89 256 L111 256 L112 244 C112 234 112 224 111 214 L110 200 Z" fill={getMuscleColor(getMuscleIntensity('glutes'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Ellipse cx="95" cy="224" rx="8" ry="20" fill={getMuscleColor(getMuscleIntensity('glutes'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="105" cy="224" rx="8" ry="20" fill={getMuscleColor(getMuscleIntensity('glutes'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M92 210 Q95 212 98 212" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M102 212 Q105 212 108 210" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M92 230 Q95 232 98 232" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      <Path d="M102 232 Q105 232 108 230" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.5" />
      
      <Path d="M86 256 L85 274 C84 291 83 308 83 326 L82 346 C82 364 82 382 83 400 L84 420 C85 438 86 456 88 474 L90 494 C91 509 93 524 95 539 L97 554 L99 569 C100 582 101 595 102 606 L100 608 C98 596 97 584 96 571 L94 556 L92 541 C90 526 89 511 88 496 L86 476 C84 458 83 440 82 422 L81 402 C80 384 80 366 80 348 L81 328 C81 310 82 292 83 276 L84 256 Z" fill={getMuscleColor(getMuscleIntensity('hamstrings'))} stroke="#1A1A1A" strokeWidth="0.8" />
      <Path d="M114 256 L115 274 C116 291 117 308 117 326 L118 346 C118 364 118 382 117 400 L116 420 C115 438 114 456 112 474 L110 494 C109 509 107 524 105 539 L103 554 L101 569 C100 582 99 595 98 606 L100 608 C102 596 103 584 104 571 L106 556 L108 541 C110 526 111 511 112 496 L114 476 C116 458 117 440 118 422 L119 402 C120 384 120 366 120 348 L119 328 C119 310 118 292 117 276 L116 256 Z" fill={getMuscleColor(getMuscleIntensity('hamstrings'))} stroke="#1A1A1A" strokeWidth="0.8" />
      
      <Ellipse cx="87" cy="312" rx="6" ry="36" fill={getMuscleColor(getMuscleIntensity('hamstrings'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="113" cy="312" rx="6" ry="36" fill={getMuscleColor(getMuscleIntensity('hamstrings'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.5" />
      
      <Path d="M85 336 L84 356 L83 376 L82 396 L82 416" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      <Path d="M115 336 L116 356 L117 376 L118 396 L118 416" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      
      <Path d="M86 476 L85 496 L84 516 L83 536 L82 556 L81 576" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      <Path d="M114 476 L115 496 L116 516 L117 536 L118 556 L119 576" stroke="#1A1A1A" strokeWidth="0.4" opacity="0.4" />
      
      <Path d="M65 160 L64 178 C63 193 62 210 62 228 L61 248 C61 254 62 258 63 260 C64 254 65 246 66 236 L67 220 C68 205 69 190 70 176 L71 164 Z" fill={getMuscleColor(getMuscleIntensity('forearms'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M135 160 L136 178 C137 193 138 210 138 228 L139 248 C139 254 138 258 137 260 C136 254 135 246 134 236 L133 220 C132 205 131 190 130 176 L129 164 Z" fill={getMuscleColor(getMuscleIntensity('forearms'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="66" cy="192" rx="4" ry="16" fill={getMuscleColor(getMuscleIntensity('forearms'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.4" />
      <Ellipse cx="134" cy="192" rx="4" ry="16" fill={getMuscleColor(getMuscleIntensity('forearms'))} opacity="0.3" stroke="#1A1A1A" strokeWidth="0.4" />
      
      <Path d="M80 536 C79 544 78 552 77 560 L76 570 C75 578 75 586 76 594 L77 606 L79 607 C80 600 81 592 82 584 L83 574 C84 566 85 558 86 550 L87 540 Z" fill={getMuscleColor(getMuscleIntensity('calves'))} stroke="#1A1A1A" strokeWidth="0.7" />
      <Path d="M120 536 C121 544 122 552 123 560 L124 570 C125 578 125 586 124 594 L123 606 L121 607 C120 600 119 592 118 584 L117 574 C116 566 115 558 114 550 L113 540 Z" fill={getMuscleColor(getMuscleIntensity('calves'))} stroke="#1A1A1A" strokeWidth="0.7" />
      
      <Ellipse cx="82" cy="564" rx="5" ry="26" fill={getMuscleColor(getMuscleIntensity('calves'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.5" />
      <Ellipse cx="118" cy="564" rx="5" ry="26" fill={getMuscleColor(getMuscleIntensity('calves'))} opacity="0.35" stroke="#1A1A1A" strokeWidth="0.5" />
    </G>
  );
};

const MUSCLE_KEYWORD_MAP: { muscle: MuscleGroup; keywords: KeywordMatcher[] }[] = [
  {
    muscle: 'chest',
    keywords: [
      'chest',
      'bench press',
      'incline press',
      'decline press',
      'chest press',
      'dumbbell press',
      'push-up',
      'pushup',
      'fly',
      'pec deck',
    ],
  },
  {
    muscle: 'shoulders',
    keywords: [
      'shoulder',
      'overhead press',
      'military press',
      'arnold press',
      'lateral raise',
      'front raise',
      'rear delt',
      'face pull',
      'shrug',
      'press and jerk',
      'push press',
    ],
  },
  {
    muscle: 'biceps',
    keywords: [
      /\bbiceps?\b/,
      'chin-up',
      'chin up',
      'chinup',
      'preacher',
      'drag curl',
      'ez bar curl',
      'barbell curl',
      'dumbbell curl',
      'cable curl',
      'concentration curl',
      'hammer curl',
      'incline curl',
    ],
  },
  {
    muscle: 'triceps',
    keywords: [
      'tricep',
      'dip',
      'pushdown',
      'skullcrusher',
      'close grip bench',
      'kickback',
      'overhead extension',
      'rope extension',
    ],
  },
  {
    muscle: 'forearms',
    keywords: [
      'forearm',
      'wrist',
      'farmer',
      'hammer curl',
      'reverse curl',
      'grip',
    ],
  },
  {
    muscle: 'abs',
    keywords: [
      /\babs?\b/,
      'core',
      'crunch',
      /sit[- ]?up/,
      'leg raise',
      'hanging raise',
      /v[- ]?up/,
      'hollow body',
      'mountain climber',
      'toes to bar',
      'flutter kick',
      'jackknife',
    ],
  },
  {
    muscle: 'obliques',
    keywords: [
      'oblique',
      'side bend',
      'side plank',
      'russian twist',
      'windmill',
      'woodchop',
      'wood chop',
      'twist',
    ],
  },
  {
    muscle: 'upper_back',
    keywords: [
      'row',
      'face pull',
      'reverse fly',
      'rear delt',
      'shrug',
      'trap',
      'pull-apart',
      'pull apart',
    ],
  },
  {
    muscle: 'lats',
    keywords: [
      /\blats?\b/,
      'pulldown',
      'pull-down',
      'pullup',
      'pull-up',
      'chin-up',
      'chinup',
      'pullover',
      'row',
    ],
  },
  {
    muscle: 'lower_back',
    keywords: [
      'lower back',
      'good morning',
      'hyperextension',
      'back extension',
      'superman',
      'reverse hyper',
    ],
  },
  {
    muscle: 'glutes',
    keywords: [
      'glute',
      'hip thrust',
      'bridge',
      'step-up',
      'stepup',
      'hip abduction',
      'hip extension',
      'glute kickback',
      'cable kickback',
      'donkey kick',
      'lunge',
      'split squat',
    ],
  },
  {
    muscle: 'quads',
    keywords: [
      'quad',
      'squat',
      'leg press',
      'leg extension',
      'lunge',
      'step-up',
      'stepup',
      'split squat',
      'front squat',
      'hack squat',
    ],
  },
  {
    muscle: 'hamstrings',
    keywords: [
      'hamstring',
      'deadlift',
      'romanian',
      'rdl',
      'good morning',
      'leg curl',
      'glute-ham',
      'glute ham',
      'hip hinge',
      'good-morning',
    ],
  },
  {
    muscle: 'calves',
    keywords: [
      'calf',
      'calves',
      'calf raise',
      'seated calf',
      'standing calf',
      'donkey calf',
    ],
  },
];

const COMPOUND_MOVEMENT_KEYWORDS: { keywords: KeywordMatcher[]; muscles: MuscleGroup[] }[] = [
  {
    keywords: ['deadlift', 'romanian', 'rdl', 'good morning'],
    muscles: ['hamstrings', 'glutes', 'lower_back'],
  },
  {
    keywords: ['squat', 'front squat', 'back squat', 'split squat', 'lunge'],
    muscles: ['quads', 'glutes', 'hamstrings'],
  },
  {
    keywords: ['hip thrust', 'glute bridge', 'hip bridge', 'hip extension'],
    muscles: ['glutes', 'hamstrings'],
  },
  {
    keywords: ['pullup', 'pull-up', 'chin-up', 'chinup'],
    muscles: ['lats', 'upper_back', 'biceps'],
  },
  {
    keywords: ['row', 't-bar', 'pendlay'],
    muscles: ['upper_back', 'lats', 'biceps'],
  },
  {
    keywords: ['burpee', 'clean', 'snatch'],
    muscles: ['shoulders', 'quads', 'glutes', 'hamstrings', 'abs'],
  },
  {
    keywords: ['farmer carry', 'suitcase carry', 'rack carry', 'yoke carry', 'sandbag carry'],
    muscles: ['forearms', 'shoulders'],
  },
];

const keywordMatches = (value: string, keyword: KeywordMatcher) =>
  typeof keyword === 'string' ? value.includes(keyword) : keyword.test(value);

function inferMuscleGroups(exerciseName: string): MuscleGroup[] {
  const name = exerciseName.toLowerCase();
  const matched = new Set<MuscleGroup>();

  MUSCLE_KEYWORD_MAP.forEach(({ muscle, keywords }) => {
    if (keywords.some(keyword => keywordMatches(name, keyword))) {
      matched.add(muscle);
    }
  });

  COMPOUND_MOVEMENT_KEYWORDS.forEach(({ keywords, muscles }) => {
    if (keywords.some(keyword => keywordMatches(name, keyword))) {
      muscles.forEach(m => matched.add(m));
    }
  });

  if (matched.size === 0) {
    if (name.includes('press') && !name.includes('leg press')) {
      matched.add('shoulders');
      matched.add('triceps');
    }
    if (name.includes('pull')) {
      matched.add('lats');
      matched.add('upper_back');
    }
    if (name.includes('push')) {
      matched.add('chest');
      matched.add('shoulders');
    }
  }

  return Array.from(matched);
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  singleBodyView: {
    alignItems: 'center',
    flex: 1,
  },
  viewLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 10,
    letterSpacing: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  legendText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500' as const,
  },
  compactContainer: {
    backgroundColor: '#000',
    paddingVertical: 20,
  },
  compactEmptyState: {
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 12,
  },
  muscleCard: {
    width: (width - 72) / 3,
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  muscleLabel: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  emptyStateContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
