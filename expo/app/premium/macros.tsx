import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { PieChart } from 'lucide-react-native';
import { Palette } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function MacrosScreen() {
  const { nutritionEntries, calculateDailyCalories } = useUserProfile();
  
  const todayEntries = nutritionEntries.filter(
    (e) => e.date === new Date().toISOString().split('T')[0]
  );

  const totalCalories = todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const totalProtein = todayEntries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalCarbs = todayEntries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalFat = todayEntries.reduce((sum, e) => sum + (e.fat || 0), 0);

  const dailyTarget = calculateDailyCalories() || 2000;
  const proteinTarget = Math.round(dailyTarget * 0.3 / 4); // 30% of calories, 4 cal/g
  const carbsTarget = Math.round(dailyTarget * 0.4 / 4); // 40% of calories, 4 cal/g
  const fatTarget = Math.round(dailyTarget * 0.3 / 9); // 30% of calories, 9 cal/g

  const MacroCard = ({ label, current, target, color, unit = 'g' }: any) => {
    // The bar is capped at full; the number is not. Capping both made 112% of the fat
    // target read "100%" -- as if exactly on target.
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const barWidth = Math.min(percentage, 100);
    
    return (
      <View style={styles.macroCard}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={[styles.macroValue, { color }]}>
          {current}{unit}
        </Text>
        <Text style={styles.macroTarget}>of {target}{unit}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${barWidth}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Macros Breakdown',
          headerStyle: { backgroundColor: Palette.canvas },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <PieChart size={60} color={Palette.accent} />
          <Text style={styles.title}>Today&apos;s Macronutrients</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.caloriesCard}>
          <Text style={styles.caloriesLabel}>Total Calories</Text>
          <Text style={styles.caloriesValue}>{totalCalories}</Text>
          <Text style={styles.caloriesTarget}>Target: {dailyTarget}</Text>
          <View style={styles.caloriesProgress}>
            <View style={styles.caloriesProgressBar}>
              <View 
                style={[
                  styles.caloriesProgressFill, 
                  { width: `${Math.min((totalCalories / dailyTarget) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.caloriesRemaining}>
              {/* Over target used to read "-150 calories remaining". */}
              {totalCalories <= dailyTarget
                ? `${dailyTarget - totalCalories} calories remaining`
                : `${totalCalories - dailyTarget} calories over target`}
            </Text>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          <MacroCard
            label="Protein"
            current={totalProtein}
            target={proteinTarget}
            color="#FF6B6B"
          />
          <MacroCard
            label="Carbs"
            current={totalCarbs}
            target={carbsTarget}
            color="#4ECDC4"
          />
          <MacroCard
            label="Fat"
            current={totalFat}
            target={fatTarget}
            color="#FFD93D"
          />
        </View>

        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
          {todayEntries.length > 0 ? (
            todayEntries.map((entry) => (
              <View key={entry.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealName}>{entry.meal.charAt(0).toUpperCase() + entry.meal.slice(1)}</Text>
                  <Text style={styles.mealCalories}>{entry.calories || 0} cal</Text>
                </View>
                <Text style={styles.mealDescription}>{entry.description}</Text>
                <View style={styles.mealMacros}>
                  <Text style={styles.mealMacro}>P: {entry.protein || 0}g</Text>
                  <Text style={styles.mealMacro}>C: {entry.carbs || 0}g</Text>
                  <Text style={styles.mealMacro}>F: {entry.fat || 0}g</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No meals logged today</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Palette.canvasRaised,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.ink,
    marginTop: 10,
  },
  date: {
    fontSize: 16,
    color: Palette.inkMuted,
    marginTop: 5,
  },
  caloriesCard: {
    backgroundColor: Palette.canvasRaised,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  caloriesLabel: {
    fontSize: 16,
    color: Palette.ink,
    opacity: 0.9,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Palette.ink,
    marginVertical: 5,
  },
  caloriesTarget: {
    fontSize: 14,
    color: Palette.ink,
    opacity: 0.8,
  },
  caloriesProgress: {
    marginTop: 15,
    alignSelf: 'stretch',   // the card centres its children, which squeezed the bar to a stub
  },
  caloriesProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Palette.line,
    borderRadius: 4,
    overflow: 'hidden',
  },
  caloriesProgressFill: {
    height: '100%',
    backgroundColor: Palette.accent,
    borderRadius: 4,
  },
  caloriesRemaining: {
    fontSize: 12,
    color: Palette.ink,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  macroCard: {
    flex: 1,
    backgroundColor: Palette.canvasRaised,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  macroLabel: {
    fontSize: 14,
    color: Palette.inkMuted,
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  macroTarget: {
    fontSize: 12,
    color: Palette.inkMuted,
    marginTop: 2,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: Palette.line,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    color: Palette.inkMuted,
    marginTop: 5,
  },
  mealsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Palette.ink,
    marginBottom: 15,
  },
  mealCard: {
    backgroundColor: Palette.canvasRaised,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.ink,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.accent,
  },
  mealDescription: {
    fontSize: 14,
    color: Palette.inkMuted,
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 15,
  },
  mealMacro: {
    fontSize: 14,
    color: Palette.inkMuted,
  },
  emptyText: {
    fontSize: 16,
    color: Palette.inkMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});