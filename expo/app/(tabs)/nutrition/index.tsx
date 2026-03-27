import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { Plus, Coffee, Sun, Moon, Cookie, Camera as CameraIcon, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserProfile } from '@/hooks/user-profile-store';
import { AIService } from '@/services/ai-service';
import type { NutritionEntry } from '@/types/user';
import { Colors } from '@/constants/colors';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: Sun },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snack', label: 'Snack', icon: Cookie },
] as const;

export default function NutritionScreen() {
  const { profile, nutritionEntries, addNutritionEntry, calculateDailyCalories, calculateWeeksToTarget } = useUserProfile();
  const [showAddMeal, setShowAddMeal] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<NutritionEntry['meal']>('breakfast');
  const [mealDescription, setMealDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pickedPhotoUri, setPickedPhotoUri] = useState<string | undefined>(undefined);
  const [pickedPhotoBase64, setPickedPhotoBase64] = useState<string | undefined>(undefined);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayEntries = nutritionEntries.filter((e) => e.date === today);

  const requestMediaPermissions = useCallback(async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert('Permission needed', 'We need access to your photos to upload images.');
      return false;
    }
    return true;
  }, []);

  const requestCameraPermissions = useCallback(async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) {
      Alert.alert('Permission needed', 'We need access to your camera to take a photo.');
      return false;
    }
    return true;
  }, []);

  const pickFromLibrary = useCallback(async () => {
    try {
      const granted = await requestMediaPermissions();
      if (!granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.8,
        allowsEditing: false,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (asset?.uri) {
        setPickedPhotoUri(asset.uri ?? undefined);
        setPickedPhotoBase64(asset.base64 ?? undefined);
      }
    } catch (e) {
      console.error('pickFromLibrary error', e);
      Alert.alert('Error', 'Failed to pick photo.');
    }
  }, [requestMediaPermissions]);

  const takePhoto = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Camera capture is limited on web. Please upload from library instead.');
        await pickFromLibrary();
        return;
      }
      const granted = await requestCameraPermissions();
      if (!granted) return;
      const result = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.8,
        allowsEditing: false,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (asset?.uri) {
        setPickedPhotoUri(asset.uri ?? undefined);
        setPickedPhotoBase64(asset.base64 ?? undefined);
      }
    } catch (e) {
      console.error('takePhoto error', e);
      Alert.alert('Error', 'Failed to take photo.');
    }
  }, [pickFromLibrary, requestCameraPermissions]);

  const handleAddMeal = useCallback(async () => {
    if (!mealDescription.trim() && !pickedPhotoUri) {
      Alert.alert('Add details', 'Please describe your meal or attach a photo.');
      return;
    }

    const entry: NutritionEntry = {
      id: Date.now().toString(),
      date: today,
      meal: selectedMeal,
      description: mealDescription,
      photoUri: pickedPhotoUri,
    };

    if (profile.aiEnabled) {
      setIsAnalyzing(true);
      try {
        let analysis;
        if (pickedPhotoBase64) {
          analysis = await AIService.analyzeNutritionImage(pickedPhotoBase64, {
            ...profile,
            dailyCalories: calculateDailyCalories(),
          });
        } else {
          analysis = await AIService.analyzeNutrition(mealDescription, {
            ...profile,
            dailyCalories: calculateDailyCalories(),
          });
        }
        entry.aiAnalysis = analysis;

        // Use structured data from AI analysis
        if (analysis.calories) {
          entry.calories = analysis.calories;
        }

        // Extract macros for premium users
        if (profile.isPremium) {
          if (analysis.protein) entry.protein = analysis.protein;
          if (analysis.carbs) entry.carbs = analysis.carbs;
          if (analysis.fat) entry.fat = analysis.fat;
        }
      } catch (error) {
        console.error('AI analysis failed:', error);
        Alert.alert('AI Error', 'Could not analyze meal. You can still save it.');
      } finally {
        setIsAnalyzing(false);
      }
    }

    await addNutritionEntry(entry);
    setMealDescription('');
    setPickedPhotoUri(undefined);
    setPickedPhotoBase64(undefined);
    setShowAddMeal(false);
  }, [mealDescription, pickedPhotoUri, pickedPhotoBase64, profile.aiEnabled, selectedMeal, today, addNutritionEntry, profile, calculateDailyCalories]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} testID="nutritionScreen">
      <View style={styles.header}>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text>
        
        {profile.onboardingCompleted && (
          <View style={styles.calorieInfo}>
            <View style={styles.calorieRow}>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieLabel}>Target</Text>
                <Text style={styles.calorieValue}>{calculateDailyCalories() || 'Not set'}</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieLabel}>Consumed</Text>
                <Text style={styles.calorieValue}>{todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0)}</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieLabel}>Remaining</Text>
                <Text style={[styles.calorieValue, { color: (calculateDailyCalories() || 0) - todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0) >= 0 ? Colors.success : Colors.error }]}>
                  {(calculateDailyCalories() || 0) - todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0)}
                </Text>
              </View>
            </View>
            {profile.isPremium && (
              <View style={styles.macroSummary}>
                <View style={styles.macroSummaryItem}>
                  <Text style={styles.macroSummaryLabel}>Protein</Text>
                  <Text style={styles.macroSummaryValue}>{todayEntries.reduce((sum, e) => sum + (e.protein || 0), 0)}g</Text>
                </View>
                <View style={styles.macroSummaryItem}>
                  <Text style={styles.macroSummaryLabel}>Carbs</Text>
                  <Text style={styles.macroSummaryValue}>{todayEntries.reduce((sum, e) => sum + (e.carbs || 0), 0)}g</Text>
                </View>
                <View style={styles.macroSummaryItem}>
                  <Text style={styles.macroSummaryLabel}>Fat</Text>
                  <Text style={styles.macroSummaryValue}>{todayEntries.reduce((sum, e) => sum + (e.fat || 0), 0)}g</Text>
                </View>
              </View>
            )}
            {profile.targetWeight && profile.weeklyWeightGoal && (
              <Text style={styles.weightGoal}>
                Goal: {profile.weight}kg → {profile.targetWeight}kg ({calculateWeeksToTarget()} weeks)
              </Text>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddMeal(true)}
        testID="logMealButton"
      >
        <Plus color={Colors.white} size={24} />
        <Text style={styles.addButtonText}>Log Meal</Text>
      </TouchableOpacity>

      {showAddMeal && (
        <View style={styles.addMealCard} testID="addMealCard">
          <Text style={styles.cardTitle}>Add Meal</Text>
          
          <View style={styles.mealTypeContainer}>
            {MEAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.mealTypeButton,
                  selectedMeal === type.id && styles.mealTypeButtonActive,
                ]}
                onPress={() => setSelectedMeal(type.id)}
                testID={`mealType-${type.id}`}
              >
                <type.icon
                  color={selectedMeal === type.id ? Colors.white : Colors.mediumGrey}
                  size={20}
                />
                <Text
                  style={[
                    styles.mealTypeText,
                    selectedMeal === type.id && styles.mealTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.attachmentRow}>
            <TouchableOpacity style={styles.attachButton} onPress={takePhoto} testID="takePhotoButton">
              <CameraIcon color={Colors.primary} size={18} />
              <Text style={styles.attachText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton} onPress={pickFromLibrary} testID="uploadPhotoButton">
              <ImageIcon color={Colors.primary} size={18} />
              <Text style={styles.attachText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          {pickedPhotoUri && (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: pickedPhotoUri }} style={styles.photoPreview} accessibilityLabel="Meal photo preview" />
              <TouchableOpacity onPress={() => { setPickedPhotoUri(undefined); setPickedPhotoBase64(undefined); }} style={styles.removePhotoBtn} testID="removePhotoButton">
                <Text style={styles.removePhotoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={styles.mealInput}
            placeholder="Describe your meal..."
            value={mealDescription}
            onChangeText={setMealDescription}
            multiline
            numberOfLines={3}
            testID="mealDescriptionInput"
          />

          <View style={styles.addMealActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddMeal(false);
                setMealDescription('');
                setPickedPhotoUri(undefined);
                setPickedPhotoBase64(undefined);
              }}
              testID="cancelAddMealButton"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddMeal}
              disabled={isAnalyzing}
              testID="saveMealButton"
            >
              {isAnalyzing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {profile.aiEnabled ? 'Analyze & Save' : 'Save'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.entriesContainer}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        
        {todayEntries.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged today</Text>
        ) : (
          todayEntries.map((entry) => {
            const MealIcon = MEAL_TYPES.find((t) => t.id === entry.meal)?.icon || Coffee;
            return (
              <View key={entry.id} style={styles.entryCard} testID={`mealEntry-${entry.id}`}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryIcon}>
                    <MealIcon color={Colors.secondary} size={20} />
                  </View>
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryMealType}>
                      {entry.meal.charAt(0).toUpperCase() + entry.meal.slice(1)}
                    </Text>
                    <Text style={styles.entryDescription}>{entry.description}</Text>
                    {entry.calories && (
                      <Text style={styles.entryCalories}>{entry.calories} calories</Text>
                    )}
                    {profile.isPremium && (entry.protein || entry.carbs || entry.fat) && (
                      <View style={styles.macrosContainer}>
                        {entry.protein && (
                          <View style={styles.macroItem}>
                            <Text style={styles.macroLabel}>Protein</Text>
                            <Text style={styles.macroValue}>{entry.protein}g</Text>
                          </View>
                        )}
                        {entry.carbs && (
                          <View style={styles.macroItem}>
                            <Text style={styles.macroLabel}>Carbs</Text>
                            <Text style={styles.macroValue}>{entry.carbs}g</Text>
                          </View>
                        )}
                        {entry.fat && (
                          <View style={styles.macroItem}>
                            <Text style={styles.macroLabel}>Fat</Text>
                            <Text style={styles.macroValue}>{entry.fat}g</Text>
                          </View>
                        )}
                      </View>
                    )}
                    {entry.photoUri && (
                      <Image source={{ uri: entry.photoUri }} style={styles.entryPhoto} />
                    )}
                  </View>
                </View>

                {entry.aiAnalysis && (
                  <View style={styles.aiAnalysis}>
                    <Text style={styles.aiAnalysisTitle}>AI Insights</Text>
                    <Text style={styles.aiAnalysisText}>{entry.aiAnalysis.insights}</Text>
                    
                    {entry.aiAnalysis.healthierAlternatives.length > 0 && (
                      <>
                        <Text style={styles.aiAlternativesTitle}>Healthier Alternatives:</Text>
                        {entry.aiAnalysis.healthierAlternatives.map((alt, index) => (
                          <Text key={index} style={styles.aiAlternative}>
                            • {alt}
                          </Text>
                        ))}
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  dateText: {
    fontSize: 16,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  calorieInfo: {
    backgroundColor: Colors.lightGrey,
    padding: 16,
    borderRadius: 12,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calorieItem: {
    alignItems: 'center',
    flex: 1,
  },
  calorieLabel: {
    fontSize: 12,
    color: Colors.mediumGrey,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.white,
    marginBottom: 8,
  },
  macroSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroSummaryLabel: {
    fontSize: 11,
    color: Colors.mediumGrey,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  macroSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  weightGoal: {
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  addMealCard: {
    backgroundColor: Colors.white,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 16,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  mealTypeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
    gap: 4,
  },
  mealTypeButtonActive: {
    backgroundColor: Colors.secondary,
  },
  mealTypeText: {
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  mealTypeTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  attachText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  photoPreviewContainer: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  photoPreview: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  removePhotoBtn: {
    marginTop: 8,
    backgroundColor: Colors.lightGrey,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  removePhotoText: {
    color: Colors.error,
    fontWeight: '600',
  },
  mealInput: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.lightGrey,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  addMealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.mediumGrey,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  entriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.mediumGrey,
    fontSize: 16,
    marginTop: 20,
  },
  entryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryInfo: {
    flex: 1,
  },
  entryMealType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  entryCalories: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  entryPhoto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 8,
  },
  aiAnalysis: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  aiAnalysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
  },
  aiAnalysisText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
    marginBottom: 8,
  },
  aiAlternativesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginTop: 8,
    marginBottom: 4,
  },
  aiAlternative: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
    marginLeft: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 11,
    color: Colors.mediumGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
});