import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { ChefHat, Clock, Flame } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { generateRecipe } from '@/services/ai-service';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function RecipesScreen() {
  const { profile } = useUserProfile();
  const [preferences, setPreferences] = useState({
    mealType: 'lunch',
    calories: '',
    cuisine: '',
  });
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const cuisines = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American'];

  const handleGenerateRecipe = async () => {
    setLoading(true);
    try {
      const result = await generateRecipe({
        ...preferences,
        dietary: profile.dietaryPreferences?.join(', '),
      });
      setRecipe(result);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Recipe Generator',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ChefHat size={60} color={Colors.primary} />
          <Text style={styles.title}>AI Recipe Generator</Text>
          <Text style={styles.subtitle}>
            Get personalized recipes based on your preferences
          </Text>
        </View>

        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    preferences.mealType === type && styles.optionButtonActive,
                  ]}
                  onPress={() => setPreferences({ ...preferences, mealType: type })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      preferences.mealType === type && styles.optionTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.sectionTitle}>Cuisine</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {cuisines.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.optionButton,
                    preferences.cuisine === cuisine && styles.optionButtonActive,
                  ]}
                  onPress={() => setPreferences({ ...preferences, cuisine })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      preferences.cuisine === cuisine && styles.optionTextActive,
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.sectionTitle}>Target Calories (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500"
            value={preferences.calories}
            onChangeText={(text) => setPreferences({ ...preferences, calories: text })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateRecipe}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.generateButtonText}>Generate Recipe</Text>
            )}
          </TouchableOpacity>
        </View>

        {recipe && (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            
            <View style={styles.recipeStats}>
              <View style={styles.statItem}>
                <Flame size={20} color={Colors.primary} />
                <Text style={styles.statText}>{recipe.calories} cal</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.statText}>{recipe.prepTime}</Text>
              </View>
            </View>

            <View style={styles.macrosRow}>
              <Text style={styles.macroItem}>Protein: {recipe.protein}</Text>
              <Text style={styles.macroItem}>Carbs: {recipe.carbs}</Text>
              <Text style={styles.macroItem}>Fat: {recipe.fat}</Text>
            </View>

            <Text style={styles.subheading}>Ingredients</Text>
            {recipe.ingredients?.map((ingredient: string, index: number) => (
              <Text key={index} style={styles.ingredient}>
                • {ingredient}
              </Text>
            ))}

            <Text style={styles.subheading}>Instructions</Text>
            {recipe.instructions?.map((step: string, index: number) => (
              <Text key={index} style={styles.instruction}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        )}
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
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGrey,
    marginTop: 5,
    textAlign: 'center',
  },
  preferencesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 10,
    marginTop: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 5,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  recipeCard: {
    backgroundColor: Colors.white,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
  },
  recipeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 15,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    marginBottom: 15,
  },
  macroItem: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginTop: 15,
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 5,
  },
  instruction: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 10,
    lineHeight: 20,
  },
});