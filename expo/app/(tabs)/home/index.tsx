/**
 * Home — the first thing a signed-in user sees, rebuilt on the dark system.
 *
 * WHAT CHANGED AND WHY (redesign/onboarding, 20 Sep 2026)
 *   The previous Home was a light dashboard: a gradient header with a looping
 *   shimmer and a waving-hand emoji, two BMI/calorie cards on white with a
 *   pulsing icon, a blurred progress card, and a stack of light premium cards.
 *   Nothing on it was a number you could read from arm's length, and three
 *   animations looped forever. This is the screen where the "data as something
 *   to look at" bet gets tested, so:
 *
 *   - One hero numeral: today's calories against target, 56pt, tabular. The bar
 *     under it is the only place a semantic colour appears, and only when the
 *     data has a direction (over target -> warn).
 *   - A row of three week-scale numbers computed from what the app already
 *     stores (workout logs, nutrition entries): sessions this week, tonnage
 *     lifted, current streak. Real data, no placeholders.
 *   - Two actions, one primary: Start workout. Log a meal is the quiet one.
 *   - Body (BMI, daily target) is a small factual row. BMI category is text,
 *     not a colour: a category is not a direction, and the system reserves
 *     semantic colours for direction.
 *   - The premium rows keep their exact gating and routes; only the surface
 *     changed. PremiumFeatureCard (light) is left for other screens.
 *
 *   Motion: entrances only (600ms, 80ms stagger, from theme.ts). Nothing loops.
 *   The Stack header is hidden; the greeting is the header, under the safe area.
 *
 * OnboardingModal, WeeklyCheckInModal and PremiumModal open over this screen;
 *   all three are on the dark system as of 22 Sep (they were the light
 *   components when this tab was first migrated).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Camera,
  ChefHat,
  BarChart3,
  Pill,
  Lock,
  ChevronRight,
  Brain,
  Dumbbell,
  Utensils,
} from 'lucide-react-native';
import { useUserProfile } from '@/hooks/user-profile-store';
import OnboardingModal from '@/components/OnboardingModal';
import WeeklyCheckInModal from '@/components/WeeklyCheckInModal';
import PremiumModal from '@/components/PremiumModal';
import { Motion, Palette, Radius, Space, Type } from '@/constants/theme';
import Enter from '@/components/Enter';
import type { NutritionEntry, WorkoutLog } from '@/types/user';

// ---------------------------------------------------------------- data

const DAY_MS = 86_400_000;

function isoDay(d: Date): string {
  return d.toISOString().split('T')[0];
}

/** Distinct days with a logged workout inside the last 7 days (today inclusive). */
export function sessionsThisWeek(logs: WorkoutLog[], now = new Date()): number {
  const since = isoDay(new Date(now.getTime() - 6 * DAY_MS));
  const days = new Set(logs.filter((l) => l.date >= since && l.date <= isoDay(now)).map((l) => l.date));
  return days.size;
}

/** Kilograms moved this week: sum of weight x reps over completed working sets. */
export function tonnageThisWeek(logs: WorkoutLog[], now = new Date()): number {
  const since = isoDay(new Date(now.getTime() - 6 * DAY_MS));
  let kg = 0;
  for (const l of logs) {
    if (l.date < since || l.date > isoDay(now)) continue;
    for (const s of l.sets) if (s.completed && !s.isWarmup) kg += (s.weight || 0) * (s.reps || 0);
  }
  return kg;
}

/** Consecutive days, ending today or yesterday, with either a workout or a meal logged. */
export function streakDays(logs: WorkoutLog[], meals: NutritionEntry[], now = new Date()): number {
  const active = new Set<string>([...logs.map((l) => l.date), ...meals.map((m) => m.date)]);
  let cursor = new Date(now.getTime());
  if (!active.has(isoDay(cursor))) cursor = new Date(cursor.getTime() - DAY_MS); // today not yet logged is not a broken streak
  let n = 0;
  while (active.has(isoDay(cursor))) {
    n += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return n;
}

function formatTonnage(kg: number): { value: string; unit: string } {
  if (kg >= 1000) return { value: (kg / 1000).toFixed(kg >= 10_000 ? 0 : 1), unit: 't' };
  return { value: String(Math.round(kg)), unit: 'kg' };
}

function greetingFor(hour: number): string {
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// ---------------------------------------------------------------- pieces

function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
      <Text style={styles.eyebrowMuted}>{label}</Text>
    </View>
  );
}

function FeatureRow({ icon: Icon, title, description, locked, onPress, last }: {
  icon: React.ComponentType<any>; title: string; description: string; locked: boolean; onPress: () => void; last?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress(); }}
      style={[styles.row, last && styles.rowLast]}
      accessibilityRole="button"
      accessibilityLabel={`${title}${locked ? ', premium' : ''}`}
    >
      <View style={styles.rowIcon}><Icon size={20} color={locked ? Palette.inkMuted : Palette.accent} /></View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      {locked ? <Lock size={16} color={Palette.inkFaint} /> : <ChevronRight size={18} color={Palette.inkFaint} />}
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------- screen

export default function HomeScreen() {
  const {
    profile,
    completeOnboarding,
    calculateBMI,
    calculateDailyCalories,
    nutritionEntries,
    workoutLogs,
    needsWeeklyCheckIn,
  } = useUserProfile();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWeeklyCheckIn, setShowWeeklyCheckIn] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (profile.aiEnabled && !profile.onboardingCompleted) {
      setShowOnboarding(true);
    } else if (profile.onboardingCompleted && needsWeeklyCheckIn()) {
      const timer = setTimeout(() => setShowWeeklyCheckIn(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [profile.aiEnabled, profile.onboardingCompleted]);

  const now = new Date();
  const bmi = calculateBMI();
  const dailyCalories = calculateDailyCalories();
  const today = isoDay(now);
  const todayCalories = nutritionEntries
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + (e.calories || 0), 0);
  const target = dailyCalories || 0;
  const ratio = target ? todayCalories / target : 0;
  const over = target > 0 && todayCalories > target;

  const week = useMemo(() => ({
    sessions: sessionsThisWeek(workoutLogs, now),
    tonnage: formatTonnage(tonnageThisWeek(workoutLogs, now)),
    streak: streakDays(workoutLogs, nutritionEntries, now),
  }), [workoutLogs, nutritionEntries, today]);

  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: Math.min(ratio, 1),
      duration: Motion.enter,
      delay: Motion.stagger * 2,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [ratio]);

  const dateLine = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
  const firstName = (profile.name || '').trim().split(' ')[0];

  const go = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push(path as any);
  };
  const premium = (path: string) => () => {
    if (profile.isPremium) router.push(path as any);
    else setShowPremiumModal(true);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Enter order={0}>
          <Text style={styles.eyebrow}>{dateLine}</Text>
          <Text style={styles.title}>
            {greetingFor(now.getHours())}{firstName ? `, ${firstName}` : ''}
          </Text>
        </Enter>

        {/* Today: the hero numeral */}
        <Enter order={1} style={styles.hero}>
          <Text style={styles.eyebrowMuted}>Today</Text>
          <View style={styles.numeralRow}>
            <Text style={styles.numeral}>{todayCalories.toLocaleString()}</Text>
            <Text style={styles.numeralUnit}>kcal</Text>
          </View>
          <View style={styles.bar} accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: target || 0, now: todayCalories }}>
            <Animated.View
              style={[styles.barFill, { backgroundColor: over ? Palette.warn : Palette.accent,
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
            />
          </View>
          <Text style={styles.caption}>
            {target
              ? over
                ? `${(todayCalories - target).toLocaleString()} over your ${target.toLocaleString()} target`
                : `${(target - todayCalories).toLocaleString()} left of ${target.toLocaleString()}`
              : 'Set a goal in Profile to get a daily target'}
          </Text>
        </Enter>

        {/* This week: three numbers from real logs */}
        <Enter order={2} style={styles.card}>
          <Text style={[styles.eyebrowMuted, styles.cardLabel]}>This week</Text>
          <View style={styles.stats}>
            <Stat value={String(week.sessions)} label="Sessions" />
            <View style={styles.statDivider} />
            <Stat value={week.tonnage.value} unit={week.tonnage.unit} label="Lifted" />
            <View style={styles.statDivider} />
            <Stat value={String(week.streak)} unit={week.streak === 1 ? 'day' : 'days'} label="Streak" />
          </View>
        </Enter>

        {/* Actions */}
        <Enter order={3} style={styles.actions}>
          <TouchableOpacity style={styles.primary} activeOpacity={0.85} onPress={() => go('/(tabs)/workout')}
            accessibilityRole="button" accessibilityLabel="Start workout">
            <Dumbbell size={18} color={Palette.canvas} />
            <Text style={styles.primaryText}>Start workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondary} activeOpacity={0.7} onPress={() => go('/(tabs)/nutrition')}
            accessibilityRole="button" accessibilityLabel="Log a meal">
            <Utensils size={18} color={Palette.ink} />
            <Text style={styles.secondaryText}>Log a meal</Text>
          </TouchableOpacity>
        </Enter>

        {/* Body: facts, not directions */}
        {profile.onboardingCompleted && (
          <Enter order={4} style={styles.card}>
            <Text style={[styles.eyebrowMuted, styles.cardLabel]}>Body</Text>
            <View style={styles.factRow}>
              <View style={styles.fact}>
                <Text style={styles.factLabel}>BMI</Text>
                <Text style={styles.factValue}>{bmi ? bmi.toFixed(1) : '—'}</Text>
                <Text style={styles.factNote}>{bmi ? bmiCategory(bmi) : 'Add height and weight'}</Text>
              </View>
              <View style={styles.fact}>
                <Text style={styles.factLabel}>Daily target</Text>
                <Text style={styles.factValue}>{target ? target.toLocaleString() : '—'}</Text>
                <Text style={styles.factNote}>{target ? 'kcal' : 'Set a goal'}</Text>
              </View>
              <View style={styles.fact}>
                <Text style={styles.factLabel}>Goal</Text>
                <Text style={styles.factGoal} numberOfLines={2}>{profile.fitnessGoal || '—'}</Text>
                <Text style={styles.factNote}>{profile.fitnessGoal ? 'Profile' : 'Not set'}</Text>
              </View>
            </View>
          </Enter>
        )}

        {!profile.aiEnabled && (
          <Enter order={4} style={styles.card}>
            <View style={styles.aiRow}>
              <View style={styles.rowIcon}><Brain size={20} color={Palette.accent} /></View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Turn on the AI assistant</Text>
                <Text style={styles.rowDescription}>Nutrition insights, workout plans and check-ins. Profile → AI Settings.</Text>
              </View>
            </View>
          </Enter>
        )}

        {/* More */}
        <Enter order={5} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.eyebrowMuted, styles.cardLabel]}>More</Text>
            {!profile.isPremium && (
              <TouchableOpacity onPress={() => setShowPremiumModal(true)} accessibilityRole="button">
                <Text style={styles.link}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
          <FeatureRow icon={Camera} title="AI body scanner" description="Analyse your physique from a photo" locked={!profile.isPremium} onPress={premium('/premium/body-scanner')} />
          <FeatureRow icon={BarChart3} title="Macros" description="Protein, carbs and fat by day" locked={!profile.isPremium} onPress={premium('/premium/macros')} />
          <FeatureRow icon={ChefHat} title="Recipes" description="Meals built around your targets" locked={!profile.isPremium} onPress={premium('/premium/recipes')} />
          <FeatureRow icon={Pill} title="Supplements" description="What is worth taking, and what is not" locked={!profile.isPremium} onPress={premium('/premium/supplements')} last />
        </Enter>

        <View style={styles.footerSpace} />
      </ScrollView>

      <OnboardingModal visible={showOnboarding} onComplete={async (data: any) => { await completeOnboarding(data); setShowOnboarding(false); }} />
      <WeeklyCheckInModal visible={showWeeklyCheckIn} onClose={() => setShowWeeklyCheckIn(false)} />
      <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------- styles

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.canvas },
  container: { flex: 1, backgroundColor: Palette.canvas },
  content: { paddingHorizontal: Space.xl, paddingTop: Space.lg },

  eyebrow: { ...Type.eyebrow, color: Palette.accent },
  eyebrowMuted: { ...Type.eyebrow, color: Palette.inkMuted },
  title: { ...Type.title, color: Palette.ink, marginTop: Space.xs },
  caption: { ...Type.caption, color: Palette.inkMuted, marginTop: Space.sm },

  hero: { marginTop: Space.xxl },
  numeralRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: Space.xs },
  numeral: { ...Type.numeral, color: Palette.ink },
  numeralUnit: { ...Type.heading, color: Palette.inkMuted, marginLeft: Space.sm },
  bar: { height: 4, borderRadius: 2, backgroundColor: Palette.line, marginTop: Space.lg, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 2 },

  card: {
    marginTop: Space.xl,
    backgroundColor: Palette.canvasRaised,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
    padding: Space.lg,
  },
  cardLabel: { marginBottom: Space.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  link: { ...Type.caption, color: Palette.accent },

  stats: { flexDirection: 'row', alignItems: 'stretch' },
  stat: { flex: 1 },
  statDivider: { width: StyleSheet.hairlineWidth, backgroundColor: Palette.line, marginHorizontal: Space.md },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { ...Type.title, color: Palette.ink, fontVariant: Type.numeral.fontVariant },
  statUnit: { ...Type.caption, color: Palette.inkMuted, marginLeft: Space.xs },

  actions: { flexDirection: 'row', marginTop: Space.xl, gap: Space.md },
  primary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: Space.lg,
    shadowColor: Palette.accent, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
  },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
  secondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    borderRadius: Radius.pill, paddingVertical: Space.lg, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  secondaryText: { ...Type.bodyStrong, color: Palette.ink },

  factRow: { flexDirection: 'row', gap: Space.md },
  fact: { flex: 1 },
  factLabel: { ...Type.caption, color: Palette.inkMuted },
  factValue: { ...Type.heading, color: Palette.ink, marginTop: Space.xs, fontVariant: Type.numeral.fontVariant },
  factGoal: { ...Type.bodyStrong, color: Palette.ink, marginTop: Space.xs },
  factNote: { ...Type.caption, color: Palette.inkFaint, marginTop: 2 },

  aiRow: { flexDirection: 'row', alignItems: 'center' },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Space.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.line,
  },
  rowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  rowIcon: {
    width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Palette.canvas,
    alignItems: 'center', justifyContent: 'center', marginRight: Space.md,
  },
  rowText: { flex: 1 },
  rowTitle: { ...Type.bodyStrong, color: Palette.ink },
  rowDescription: { ...Type.caption, color: Palette.inkMuted, marginTop: 2 },

  footerSpace: { height: Space.xxxl },
});
