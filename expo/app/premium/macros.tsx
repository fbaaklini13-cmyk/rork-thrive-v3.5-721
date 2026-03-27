import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { PieChart } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
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
    const percentage = Math.min((current / target) * 100, 100);
    
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
              { width: `${percentage}%`, backgroundColor: color }
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
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <PieChart size={60} color={Colors.primary} />
          <Text style={styles.title}>Today's Macronutrients</Text>
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
              {dailyTarget - totalCalories} calories remaining
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
          <Text style={styles.sectionTitle}>Today's Meals</Text>
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
    backgroundColor: Colors.lightGrey,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginTop: 10,
  },
  date: {
    fontSize: 16,
    color: Colors.mediumGrey,
    marginTop: 5,
  },
  caloriesCard: {
    backgroundColor: Colors.primary,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  caloriesLabel: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
    marginVertical: 5,
  },
  caloriesTarget: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  caloriesProgress: {
    marginTop: 15,
  },
  caloriesProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  caloriesProgressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  caloriesRemaining: {
    fontSize: 12,
    color: Colors.white,
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
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  macroTarget: {
    fontSize: 12,
    color: Colors.mediumGrey,
    marginTop: 2,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.lightGrey,
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
    color: Colors.mediumGrey,
    marginTop: 5,
  },
  mealsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 15,
  },
  mealCard: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
    color: Colors.darkGrey,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  mealDescription: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 15,
  },
  mealMacro: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginTop: 20,
  },
});