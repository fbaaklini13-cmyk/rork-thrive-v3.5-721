import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { 
  User, 
  Brain, 
  RefreshCw, 
  Activity,
  Target,
  Edit3,
  Crown,
  CreditCard,
  LogOut,
  Smartphone
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/user-profile-store';
import { Colors } from '@/constants/colors';
import EditGoalsModal from '@/components/EditGoalsModal';
import PremiumModal from '@/components/PremiumModal';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    profile,
    toggleAI,
    resetOnboarding,
    updateProfile,
    calculateBMI,
    calculateDailyCalories,
    calculateWeeksToTarget,
    cancelPremium,
    subscribeToPremium,
    signOut,
  } = useUserProfile();

  const [showEditGoals, setShowEditGoals] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleToggleAI = async (value: boolean) => {
    await toggleAI(value);
    if (value && !profile.onboardingCompleted) {
      Alert.alert(
        'Setup Required',
        'Please complete the onboarding to personalize your AI experience.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will clear your profile data and restart the setup process. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetOnboarding,
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };



  const bmi = calculateBMI();
  const dailyCalories = calculateDailyCalories();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color={Colors.white} size={40} />
        </View>
        <Text style={styles.name}>{profile.name || 'User'}</Text>
        {profile.age && profile.gender && (
          <Text style={styles.info}>
            {profile.age} years • {profile.gender}
          </Text>
        )}
      </View>

      {/* Premium Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        
        {/* Debug: Add test premium button */}
        {!profile.isPremium && (
          <TouchableOpacity 
            style={[styles.upgradeCard, { backgroundColor: Colors.secondary }]}
            onPress={async () => {
              await subscribeToPremium();
              Alert.alert('Success!', 'Premium activated for testing! 🎉');
            }}
          >
            <View style={styles.upgradeContent}>
              <Crown color={Colors.white} size={32} />
              <View style={styles.upgradeText}>
                <Text style={[styles.upgradeTitle, { color: Colors.white }]}>Test Premium</Text>
                <Text style={[styles.upgradeDescription, { color: Colors.white, opacity: 0.9 }]}>
                  Activate premium for testing (free)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        
        {profile.isPremium ? (
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Crown color={Colors.primary} size={24} />
              <Text style={styles.premiumTitle}>Thrive Premium</Text>
            </View>
            <Text style={styles.premiumStatus}>Active Subscription</Text>
            {profile.premiumExpiresAt && (
              <Text style={styles.premiumExpiry}>
                Expires: {new Date(profile.premiumExpiresAt).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                Alert.alert(
                  'Cancel Subscription',
                  'Are you sure you want to cancel your premium subscription?',
                  [
                    { text: 'Keep Premium', style: 'cancel' },
                    {
                      text: 'Cancel',
                      style: 'destructive',
                      onPress: cancelPremium,
                    },
                  ]
                );
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.upgradeCard}
            onPress={() => setShowPremiumModal(true)}
          >
            <View style={styles.upgradeContent}>
              <Crown color={Colors.primary} size={32} />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeDescription}>
                  Unlock AI Body Scanner, Macros Tracking, Recipe Generator & more
                </Text>
                <Text style={styles.upgradePrice}>$4.99/month</Text>
              </View>
            </View>
            <CreditCard color={Colors.mediumGrey} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Brain color={Colors.primary} size={24} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>AI Assistant</Text>
              <Text style={styles.settingDescription}>
                Enable personalized insights and recommendations
              </Text>
            </View>
          </View>
          <Switch
            value={profile.aiEnabled}
            onValueChange={handleToggleAI}
            trackColor={{ false: Colors.lightGrey, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>

        {profile.aiEnabled && profile.onboardingCompleted && (
          <TouchableOpacity style={styles.settingRow} onPress={handleResetOnboarding}>
            <View style={styles.settingInfo}>
              <RefreshCw color={Colors.error} size={24} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Reset Profile</Text>
                <Text style={styles.settingDescription}>
                  Restart onboarding questionnaire
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {profile.onboardingCompleted && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Activity color={Colors.primary} size={20} />
                <Text style={styles.metricLabel}>BMI</Text>
                <Text style={styles.metricValue}>
                  {bmi ? bmi.toFixed(1) : 'Not set'}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Target color={Colors.secondary} size={20} />
                <Text style={styles.metricLabel}>Daily Calories</Text>
                <Text style={styles.metricValue}>
                  {dailyCalories || 'Not set'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>
                  {profile.height ? `${profile.height} cm` : 'Not set'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>
                  {profile.weight ? `${profile.weight} kg` : 'Not set'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Activity Level</Text>
                <Text style={styles.infoValue}>
                  {profile.activityLevel || 'Not set'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Fitness Goal</Text>
                <Text style={styles.infoValue}>
                  {profile.fitnessGoal || 'Not set'}
                </Text>
              </View>

              {profile.targetWeight && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Target Weight</Text>
                  <Text style={styles.infoValue}>
                    {profile.targetWeight} kg
                  </Text>
                </View>
              )}

              {profile.weeklyWeightGoal && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Weekly Goal</Text>
                  <Text style={styles.infoValue}>
                    {profile.weeklyWeightGoal} kg/week
                  </Text>
                </View>
              )}

              {calculateWeeksToTarget() && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Time to Target</Text>
                  <Text style={styles.infoValue}>
                    {calculateWeeksToTarget()} weeks
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowEditGoals(true)}
            >
              <Edit3 color={Colors.white} size={20} />
              <Text style={styles.editButtonText}>Edit Goals</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Devices & Data</Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push('/(tabs)/profile/devices')}
        >
          <View style={styles.settingInfo}>
            <Smartphone color={Colors.primary} size={24} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Connected Devices</Text>
              <Text style={styles.settingDescription}>
                Manage Apple Watch, WHOOP, Garmin & more
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut color={Colors.error} size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <EditGoalsModal 
        visible={showEditGoals}
        onClose={() => setShowEditGoals(false)}
      />

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 12,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  switchText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  infoGrid: {
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGrey,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  premiumCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  premiumStatus: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  premiumExpiry: {
    fontSize: 13,
    color: Colors.mediumGrey,
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.error,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  upgradeCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 13,
    color: Colors.mediumGrey,
    marginBottom: 4,
  },
  upgradePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
});