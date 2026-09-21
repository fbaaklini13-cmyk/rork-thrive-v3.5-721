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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Coffee, Sun, Moon, Cookie, Camera as CameraIcon, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserProfile } from '@/hooks/user-profile-store';
import { AIService } from '@/services/ai-service';
import type { NutritionEntry } from '@/types/user';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import Enter from '@/components/Enter';

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
    <SafeAreaView edges={['top']} style={styles.safe}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} testID="nutritionScreen">
      <Enter order={0}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
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
                <Text style={[styles.calorieValue, { color: (calculateDailyCalories() || 0) - todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0) >= 0 ? Palette.good : Palette.bad }]}>
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
      </Enter>

      <Enter order={1}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddMeal(true)}
        testID="logMealButton"
      >
        <Plus color={Palette.canvas} size={24} />
        <Text style={styles.addButtonText}>Log Meal</Text>
      </TouchableOpacity>
      </Enter>

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
                  color={selectedMeal === type.id ? Palette.canvas : Palette.inkMuted}
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
              <CameraIcon color={Palette.accent} size={18} />
              <Text style={styles.attachText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton} onPress={pickFromLibrary} testID="uploadPhotoButton">
              <ImageIcon color={Palette.accent} size={18} />
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
            placeholderTextColor={Palette.inkMuted}
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
                <ActivityIndicator color={Palette.canvas} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {profile.aiEnabled ? 'Analyze & Save' : 'Save'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Enter order={2}>
      <View style={styles.entriesContainer}>
        <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
        
        {todayEntries.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged today</Text>
        ) : (
          todayEntries.map((entry) => {
            const MealIcon = MEAL_TYPES.find((t) => t.id === entry.meal)?.icon || Coffee;
            return (
              <View key={entry.id} style={styles.entryCard} testID={`mealEntry-${entry.id}`}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryIcon}>
                    <MealIcon color={Palette.accent} size={20} />
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
                        <Text style={styles.aiAlternativesTitle}>Healthier alternatives</Text>
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
      </Enter>

      <View style={styles.footerSpace} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.canvas },
  container: { flex: 1, backgroundColor: Palette.canvas },

  eyebrow: { ...Type.eyebrow, color: Palette.accent, marginBottom: Space.xs },
  header: {
    paddingHorizontal: Space.xl,
    paddingTop: Space.lg,
    paddingBottom: Space.xl,
    backgroundColor: Palette.canvas,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.line,
  },
  dateText: { ...Type.title, color: Palette.ink, marginBottom: Space.xl },

  calorieInfo: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
    padding: Space.lg,
  },
  calorieRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Space.md },
  calorieItem: { alignItems: 'center', flex: 1 },
  calorieLabel: { ...Type.eyebrow, color: Palette.inkMuted, marginBottom: Space.xs },
  // Neutral by default. "Remaining" overrides to good/bad because that number has a
  // direction; Target and Consumed do not, and the system reserves colour for direction.
  calorieValue: { ...Type.heading, color: Palette.ink, fontVariant: Type.numeral.fontVariant },

  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.line,
    marginBottom: Space.sm,
  },
  macroSummaryItem: { alignItems: 'center', flex: 1 },
  macroSummaryLabel: { ...Type.eyebrow, color: Palette.inkMuted, marginBottom: 2 },
  macroSummaryValue: { ...Type.bodyStrong, color: Palette.ink, fontVariant: Type.numeral.fontVariant },
  weightGoal: { ...Type.caption, color: Palette.inkMuted },

  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    backgroundColor: Palette.accent, borderRadius: Radius.pill,
    marginHorizontal: Space.xl, marginVertical: Space.xl, paddingVertical: Space.lg,
    shadowColor: Palette.accent, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
  },
  addButtonText: { ...Type.bodyStrong, color: Palette.canvas },

  addMealCard: {
    backgroundColor: Palette.canvasRaised,
    marginHorizontal: Space.xl,
    marginBottom: Space.xl,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
    padding: Space.lg,
  },
  cardTitle: { ...Type.heading, color: Palette.ink, marginBottom: Space.lg },

  mealTypeContainer: { flexDirection: 'row', gap: Space.sm, marginBottom: Space.lg },
  mealTypeButton: {
    flex: 1, alignItems: 'center', gap: Space.xs,
    paddingVertical: Space.md, borderRadius: Radius.sm,
    backgroundColor: Palette.canvas, borderWidth: 1, borderColor: Palette.line,
  },
  mealTypeButtonActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  mealTypeText: { ...Type.caption, color: Palette.inkMuted },
  mealTypeTextActive: { color: Palette.canvas, fontWeight: '700' },

  attachmentRow: { flexDirection: 'row', gap: Space.md, marginBottom: Space.md },
  attachButton: {
    flexDirection: 'row', alignItems: 'center', gap: Space.sm,
    paddingVertical: Space.md, paddingHorizontal: Space.md,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  attachText: { ...Type.caption, color: Palette.accent },

  photoPreviewContainer: { marginBottom: Space.md, alignItems: 'flex-start' },
  photoPreview: { width: 160, height: 160, borderRadius: Radius.md },
  removePhotoBtn: {
    marginTop: Space.sm, paddingVertical: Space.sm, paddingHorizontal: Space.md,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  removePhotoText: { ...Type.caption, color: Palette.bad },

  mealInput: {
    ...Type.body,
    color: Palette.ink,
    backgroundColor: Palette.canvas,
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: Radius.md,
    padding: Space.md,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Space.lg,
  },

  addMealActions: { flexDirection: 'row', gap: Space.md },
  cancelButton: {
    flex: 1, alignItems: 'center', paddingVertical: Space.lg,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  cancelButtonText: { ...Type.bodyStrong, color: Palette.ink },
  saveButton: {
    flex: 1, alignItems: 'center', paddingVertical: Space.lg,
    borderRadius: Radius.pill, backgroundColor: Palette.accent,
  },
  saveButtonText: { ...Type.bodyStrong, color: Palette.canvas },

  entriesContainer: { paddingHorizontal: Space.xl, paddingBottom: Space.xl },
  sectionTitle: { ...Type.heading, color: Palette.ink, marginBottom: Space.lg },
  emptyText: { ...Type.body, color: Palette.inkMuted, textAlign: 'center', marginTop: Space.xl },

  entryCard: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
    padding: Space.lg,
    marginBottom: Space.md,
  },
  entryHeader: { flexDirection: 'row', gap: Space.md },
  entryIcon: {
    width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Palette.canvas,
    alignItems: 'center', justifyContent: 'center',
  },
  entryInfo: { flex: 1 },
  entryMealType: { ...Type.eyebrow, color: Palette.accent, marginBottom: 2 },
  entryDescription: { ...Type.bodyStrong, color: Palette.ink, marginBottom: Space.xs },
  entryCalories: { ...Type.caption, color: Palette.inkMuted, fontVariant: Type.numeral.fontVariant },
  entryPhoto: { width: 120, height: 120, borderRadius: Radius.sm, marginTop: Space.sm },

  aiAnalysis: {
    marginTop: Space.md, paddingTop: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line,
  },
  aiAnalysisTitle: { ...Type.eyebrow, color: Palette.accent, marginBottom: Space.sm },
  aiAnalysisText: { ...Type.caption, color: Palette.inkMuted, marginBottom: Space.sm },
  aiAlternativesTitle: { ...Type.eyebrow, color: Palette.ink, marginTop: Space.sm, marginBottom: Space.xs },
  aiAlternative: { ...Type.caption, color: Palette.inkMuted, marginLeft: Space.sm },

  macrosContainer: {
    flexDirection: 'row', gap: Space.lg, marginTop: Space.sm, paddingTop: Space.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line,
  },
  macroItem: { alignItems: 'center' },
  macroLabel: { ...Type.eyebrow, color: Palette.inkMuted },
  macroValue: { ...Type.bodyStrong, color: Palette.ink, marginTop: 2, fontVariant: Type.numeral.fontVariant },

  footerSpace: { height: Space.xxxl },
});
