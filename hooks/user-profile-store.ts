import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import type { UserProfile, NutritionEntry, WorkoutPlan, ChatMessage, WorkoutLog, WeeklyCheckIn, BodyScan, Recipe, BodyMeasurement, ProgressPhoto, Achievement } from '@/types/user';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEYS = {
  PROFILE: 'user_profile',
  NUTRITION: 'nutrition_entries',
  WORKOUTS: 'workout_plans',
  CHAT_HISTORY: 'chat_history',
  WORKOUT_LOGS: 'workout_logs',
  WEEKLY_CHECKINS: 'weekly_checkins',
  BODY_SCANS: 'body_scans',
  SAVED_RECIPES: 'saved_recipes',
  BODY_MEASUREMENTS: 'body_measurements',
  PROGRESS_PHOTOS: 'progress_photos',
  ACHIEVEMENTS: 'achievements',
};

export const [UserProfileProvider, useUserProfile] = createContextHook(() => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    aiEnabled: false,
    onboardingCompleted: false,
    isPremium: false,
  });
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [bodyScans, setBodyScans] = useState<BodyScan[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearUserData = () => {
    setProfile({
      aiEnabled: false,
      onboardingCompleted: false,
      isPremium: false,
    });
    setNutritionEntries([]);
    setWorkoutPlans([]);
    setChatHistory([]);
    setWorkoutLogs([]);
    setWeeklyCheckIns([]);
    setBodyScans([]);
    setSavedRecipes([]);
    setBodyMeasurements([]);
    setProgressPhotos([]);
    setAchievements([]);
  };

  const loadUserData = async (currentUserId: string) => {
    try {
      const userStorageKey = `${currentUserId}_`;
      const [profileData, nutritionData, workoutData, chatData, logsData, checkInsData, scansData, recipesData, measurementsData, photosData, achievementsData] = await Promise.all([
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.NUTRITION),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.WORKOUTS),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.CHAT_HISTORY),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.WORKOUT_LOGS),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.WEEKLY_CHECKINS),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.BODY_SCANS),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.SAVED_RECIPES),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.BODY_MEASUREMENTS),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.PROGRESS_PHOTOS),
        AsyncStorage.getItem(userStorageKey + STORAGE_KEYS.ACHIEVEMENTS),
      ]);

      const safeJSONParse = <T>(data: string | null, fallback: T, key: string): T => {
        if (!data) return fallback;
        try {
          const parsed = JSON.parse(data);
          return parsed;
        } catch (error) {
          console.error(`Failed to parse ${key}:`, error);
          console.error(`Data value:`, data?.substring(0, 100));
          return fallback;
        }
      };

      if (profileData) {
        const parsedProfile = safeJSONParse<UserProfile>(profileData, {
          aiEnabled: false,
          onboardingCompleted: false,
          isPremium: false,
        }, 'profile');
        
        if (parsedProfile.isPremium && parsedProfile.premiumExpiresAt) {
          const expiryDate = new Date(parsedProfile.premiumExpiresAt);
          if (expiryDate < new Date()) {
            parsedProfile.isPremium = false;
            parsedProfile.premiumExpiresAt = undefined;
            await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.PROFILE, JSON.stringify(parsedProfile));
          }
        }
        setProfile(parsedProfile);
      } else {
        setProfile({
          aiEnabled: false,
          onboardingCompleted: false,
          isPremium: false,
        });
      }
      
      setNutritionEntries(safeJSONParse(nutritionData, [], 'nutrition'));
      setWorkoutPlans(safeJSONParse(workoutData, [], 'workouts'));
      setChatHistory(safeJSONParse(chatData, [], 'chat'));
      setWorkoutLogs(safeJSONParse(logsData, [], 'logs'));
      setWeeklyCheckIns(safeJSONParse(checkInsData, [], 'checkins'));
      setBodyScans(safeJSONParse(scansData, [], 'scans'));
      setSavedRecipes(safeJSONParse(recipesData, [], 'recipes'));
      setBodyMeasurements(safeJSONParse(measurementsData, [], 'measurements'));
      setProgressPhotos(safeJSONParse(photosData, [], 'photos'));
      setAchievements(safeJSONParse(achievementsData, [], 'achievements'));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!isSupabaseConfigured()) {
          console.warn('Supabase not configured - skipping auth check');
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
          setIsAuthenticated(true);
          await loadUserData(session.user.id);
        } else {
          clearUserData();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    if (!isSupabaseConfigured()) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        const newUserId = session.user.id;
        const previousUserId = userId;
        
        if (previousUserId && previousUserId !== newUserId) {
          console.log('User switched from', previousUserId, 'to', newUserId);
          clearUserData();
        }
        
        setUserId(newUserId);
        setIsAuthenticated(true);
        await loadUserData(newUserId);
      } else {
        console.log('User signed out');
        setUserId(null);
        setIsAuthenticated(false);
        clearUserData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
  };

  // Toggle AI
  const toggleAI = async (enabled: boolean) => {
    await updateProfile({ aiEnabled: enabled });
  };

  // Complete onboarding
  const completeOnboarding = async (data: Partial<UserProfile>) => {
    await updateProfile({ ...data, onboardingCompleted: true });
  };

  // Reset onboarding
  const resetOnboarding = async () => {
    await updateProfile({ onboardingCompleted: false });
  };

  const addNutritionEntry = async (entry: NutritionEntry) => {
    if (!userId) return;
    const newEntries = [...nutritionEntries, entry];
    setNutritionEntries(newEntries);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.NUTRITION, JSON.stringify(newEntries));
  };

  const addWorkoutPlan = async (plan: WorkoutPlan) => {
    if (!userId) return;
    const newPlans = [...workoutPlans, plan];
    setWorkoutPlans(newPlans);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.WORKOUTS, JSON.stringify(newPlans));
  };

  const replaceExerciseInPlan = async (planId: string, dayIndex: number, exerciseIndex: number, newExercise: any) => {
    if (!userId) return;
    const updatedPlans = workoutPlans.map(plan => {
      if (plan.id === planId) {
        const updatedPlan = { ...plan };
        updatedPlan.plan = [...plan.plan];
        updatedPlan.plan[dayIndex] = {
          ...plan.plan[dayIndex],
          exercises: [...plan.plan[dayIndex].exercises]
        };
        updatedPlan.plan[dayIndex].exercises[exerciseIndex] = newExercise;
        return updatedPlan;
      }
      return plan;
    });
    
    setWorkoutPlans(updatedPlans);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.WORKOUTS, JSON.stringify(updatedPlans));
  };

  const addChatMessage = async (message: ChatMessage) => {
    if (!userId) return;
    const newHistory = [...chatHistory, message];
    setChatHistory(newHistory);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(newHistory));
  };

  const clearChatHistory = async () => {
    if (!userId) return;
    setChatHistory([]);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.removeItem(userStorageKey + STORAGE_KEYS.CHAT_HISTORY);
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (!profile.height || !profile.weight) return null;
    const heightInM = profile.height / 100;
    return profile.weight / (heightInM * heightInM);
  };

  // Calculate daily calorie needs with weight goals
  const calculateDailyCalories = () => {
    if (!profile.age || !profile.weight || !profile.height || !profile.gender) return null;

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    };

    const multiplier = activityMultipliers[profile.activityLevel || 'sedentary'];
    let maintenanceCalories = Math.round(bmr * multiplier);

    // Adjust for weight goals
    if (profile.fitnessGoal && profile.targetWeight && profile.weeklyWeightGoal) {
      const isWeightLoss = profile.fitnessGoal.toLowerCase().includes('weight loss') || profile.fitnessGoal.toLowerCase().includes('fat loss');
      const isWeightGain = profile.fitnessGoal.toLowerCase().includes('muscle gain') || profile.fitnessGoal.toLowerCase().includes('bulking');
      
      if (isWeightLoss || isWeightGain) {
        // 1 kg = ~7700 calories
        const weeklyCalorieAdjustment = profile.weeklyWeightGoal * 7700;
        const dailyCalorieAdjustment = weeklyCalorieAdjustment / 7;
        
        if (isWeightLoss) {
          maintenanceCalories -= dailyCalorieAdjustment;
        } else if (isWeightGain) {
          maintenanceCalories += dailyCalorieAdjustment;
        }
      }
    }

    return Math.round(maintenanceCalories);
  };

  // Calculate weeks to reach target weight
  const calculateWeeksToTarget = () => {
    if (!profile.weight || !profile.targetWeight || !profile.weeklyWeightGoal) return null;
    const weightDifference = Math.abs(profile.targetWeight - profile.weight);
    return Math.ceil(weightDifference / profile.weeklyWeightGoal);
  };

  const addWorkoutLog = async (log: WorkoutLog) => {
    if (!userId) return;
    const newLogs = [...workoutLogs, log];
    setWorkoutLogs(newLogs);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(newLogs));
  };

  const updateWorkoutLog = async (logId: string, updates: Partial<WorkoutLog>) => {
    if (!userId) return;
    const newLogs = workoutLogs.map(log => 
      log.id === logId ? { ...log, ...updates } : log
    );
    setWorkoutLogs(newLogs);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(newLogs));
  };

  // Get logs for a specific workout
  const getWorkoutLogs = (workoutPlanId: string) => {
    return workoutLogs.filter(log => log.workoutPlanId === workoutPlanId);
  };

  const addWeeklyCheckIn = async (checkIn: WeeklyCheckIn) => {
    if (!userId) return;
    const newCheckIns = [...weeklyCheckIns, checkIn];
    setWeeklyCheckIns(newCheckIns);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.WEEKLY_CHECKINS, JSON.stringify(newCheckIns));
  };

  // Check if weekly check-in is needed
  const needsWeeklyCheckIn = () => {
    if (weeklyCheckIns.length === 0) return true;
    
    const lastCheckIn = weeklyCheckIns[weeklyCheckIns.length - 1];
    const lastCheckInDate = new Date(lastCheckIn.date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff >= 7;
  };

  // Premium subscription management
  const subscribeToPremium = async () => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription
    await updateProfile({ 
      isPremium: true, 
      premiumExpiresAt: expiryDate.toISOString() 
    });
  };

  const cancelPremium = async () => {
    await updateProfile({ 
      isPremium: false, 
      premiumExpiresAt: undefined 
    });
  };

  const addBodyScan = async (scan: BodyScan) => {
    if (!userId) return;
    const newScans = [...bodyScans, scan];
    setBodyScans(newScans);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.BODY_SCANS, JSON.stringify(newScans));
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (!userId) return;
    const newRecipes = [...savedRecipes, recipe];
    setSavedRecipes(newRecipes);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(newRecipes));
  };

  const removeRecipe = async (recipeId: string) => {
    if (!userId) return;
    const newRecipes = savedRecipes.filter(r => r.id !== recipeId);
    setSavedRecipes(newRecipes);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(newRecipes));
  };

  const addBodyMeasurement = async (measurement: BodyMeasurement) => {
    if (!userId) return;
    const newMeasurements = [...bodyMeasurements, measurement];
    setBodyMeasurements(newMeasurements);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.BODY_MEASUREMENTS, JSON.stringify(newMeasurements));
  };

  const addProgressPhoto = async (photo: ProgressPhoto) => {
    if (!userId) return;
    const newPhotos = [...progressPhotos, photo];
    setProgressPhotos(newPhotos);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.PROGRESS_PHOTOS, JSON.stringify(newPhotos));
  };

  const addAchievement = async (achievement: Achievement) => {
    if (!userId) return;
    const existing = achievements.find(a => a.id === achievement.id);
    if (existing) return;
    
    const newAchievements = [...achievements, achievement];
    setAchievements(newAchievements);
    const userStorageKey = `${userId}_`;
    await AsyncStorage.setItem(userStorageKey + STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements));
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      if (!isSupabaseConfigured()) {
        Alert.alert(
          'Configuration Required',
          'Supabase credentials are not configured.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        Alert.alert('Error', 'Failed to resend confirmation email. Please try again.');
        return false;
      }

      Alert.alert(
        'Email Sent',
        'Confirmation email has been sent. Please check your inbox and spam folder.',
        [{ text: 'OK' }]
      );
      return true;
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        Alert.alert(
          'Configuration Required',
          'Supabase credentials are not configured. Please add your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        if (error.message === 'Email not confirmed') {
          Alert.alert(
            'Email Not Confirmed',
            'Please confirm your email address before signing in. Check your inbox for the confirmation link.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Resend Email',
                onPress: () => resendConfirmationEmail(email),
              },
            ]
          );
          return false;
        }
        
        Alert.alert(
          'Sign In Failed',
          error.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message
        );
        return false;
      }

      if (data.user) {
        const newUserId = data.user.id;
        const previousUserId = userId;
        
        if (previousUserId && previousUserId !== newUserId) {
          clearUserData();
        }
        
        setIsAuthenticated(true);
        setUserId(newUserId);
        await loadUserData(newUserId);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        Alert.alert(
          'Configuration Required',
          'Supabase credentials are not configured. Please add your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Sign up error:', error);
        Alert.alert(
          'Sign Up Failed',
          error.message === 'User already registered'
            ? 'This email is already registered. Please sign in instead.'
            : error.message
        );
        return false;
      }

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          Alert.alert(
            'Email Already Registered',
            'This email is already registered. Please sign in instead.',
            [{ text: 'OK' }]
          );
          return false;
        }
        
        if (data.session) {
          const newUserId = data.user.id;
          const previousUserId = userId;
          
          if (previousUserId && previousUserId !== newUserId) {
            clearUserData();
          }
          
          setIsAuthenticated(true);
          setUserId(newUserId);
          await loadUserData(newUserId);
          Alert.alert(
            'Account Created',
            'Your account has been created successfully!',
            [{ text: 'OK' }]
          );
          return true;
        } else {
          Alert.alert(
            'Confirm Your Email',
            'Account created successfully! Please check your email and click the confirmation link before signing in.',
            [{ text: 'OK' }]
          );
          return false;
        }
      }
      return false;
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      clearUserData();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        Alert.alert(
          'Configuration Required',
          'Supabase credentials are not configured. Please add your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) {
        console.error('Phone sign in error:', error);
        Alert.alert(
          'Sign In Failed',
          error.message === 'Invalid login credentials'
            ? 'Invalid phone number or password. Please check your credentials and try again.'
            : error.message
        );
        return false;
      }

      if (data.user) {
        const newUserId = data.user.id;
        const previousUserId = userId;
        
        if (previousUserId && previousUserId !== newUserId) {
          clearUserData();
        }
        
        setIsAuthenticated(true);
        setUserId(newUserId);
        await loadUserData(newUserId);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const signUpWithPhone = async (phone: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        Alert.alert(
          'Configuration Required',
          'Supabase credentials are not configured. Please add your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
      });

      if (error) {
        console.error('Phone sign up error:', error);
        Alert.alert(
          'Sign Up Failed',
          error.message === 'User already registered'
            ? 'This phone number is already registered. Please sign in instead.'
            : error.message
        );
        return false;
      }

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          Alert.alert(
            'Phone Already Registered',
            'This phone number is already registered. Please sign in instead.',
            [{ text: 'OK' }]
          );
          return false;
        }
        
        const newUserId = data.user.id;
        const previousUserId = userId;
        
        if (previousUserId && previousUserId !== newUserId) {
          clearUserData();
        }
        
        setIsAuthenticated(true);
        setUserId(newUserId);
        await loadUserData(newUserId);
        Alert.alert(
          'Account Created',
          'Your account has been created successfully!',
          [{ text: 'OK' }]
        );
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Phone sign up error:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    try {
      if (!isSupabaseConfigured()) {
        Alert.alert(
          'Configuration Required',
          'Supabase credentials are not configured. Please add your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const redirectUrl = Linking.createURL('auth/callback');

      console.log('Attempting OAuth sign in with provider:', provider);
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) {
        console.error('OAuth sign in error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
          Alert.alert(
            'Provider Not Enabled',
            `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not enabled. Please enable it in your Supabase Dashboard under Authentication > Providers, or use email/password to sign in.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'OAuth Error',
            error.message || `Failed to sign in with ${provider}`,
            [{ text: 'OK' }]
          );
        }
        
        return false;
      }

      if (Platform.OS === 'web') {
        return true;
      }

      if (data?.url) {
        console.log('Opening OAuth URL:', data.url);
        const supported = await Linking.canOpenURL(data.url);
        if (supported) {
          await Linking.openURL(data.url);
          return true;
        } else {
          console.error('Cannot open URL:', data.url);
          Alert.alert(
            'Error',
            'Unable to open authentication page. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }

      return false;
    } catch (error: any) {
      console.error('OAuth sign in error:', error);
      console.error('Error stack:', error.stack);
      Alert.alert(
        'Error',
        'An unexpected error occurred during sign in. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  return {
    userId,
    isAuthenticated,
    profile,
    nutritionEntries,
    workoutPlans,
    chatHistory,
    workoutLogs,
    weeklyCheckIns,
    bodyScans,
    savedRecipes,
    bodyMeasurements,
    progressPhotos,
    achievements,
    isLoading,
    updateProfile,
    toggleAI,
    completeOnboarding,
    resetOnboarding,
    addNutritionEntry,
    addWorkoutPlan,
    addChatMessage,
    clearChatHistory,
    addWorkoutLog,
    updateWorkoutLog,
    getWorkoutLogs,
    addWeeklyCheckIn,
    needsWeeklyCheckIn,
    calculateBMI,
    calculateDailyCalories,
    calculateWeeksToTarget,
    subscribeToPremium,
    cancelPremium,
    addBodyScan,
    saveRecipe,
    removeRecipe,
    replaceExerciseInPlan,
    addBodyMeasurement,
    addProgressPhoto,
    addAchievement,
    signIn,
    signUp,
    signOut,
    signInWithPhone,
    signUpWithPhone,
    signInWithOAuth,
    resendConfirmationEmail,
  };
});