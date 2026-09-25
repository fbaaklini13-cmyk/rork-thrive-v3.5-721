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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserProfile } from '@/hooks/user-profile-store';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import Enter from '@/components/Enter';
import EditGoalsModal from '@/components/EditGoalsModal';
import PremiumModal from '@/components/PremiumModal';
import { useAIConsent } from '@/components/AIConsentProvider';
import { AI_SERVICE, hasAIConsent } from '@/lib/ai-consent';

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
    deleteAccount,
  } = useUserProfile();

  const [showEditGoals, setShowEditGoals] = useState(false);
  const requestAIConsent = useAIConsent();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Turning AI on goes through the disclosure (lib/ai-consent.ts); turning it off
  // withdraws the recorded consent, so turning it back on asks again.
  const handleToggleAI = async (value: boolean) => {
    if (value) {
      if (!(await requestAIConsent())) return;
    } else {
      await toggleAI(false);
    }
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



  // App Review 5.1.1(v): deletion, not deactivation, reachable from inside the app.
  const handleDeleteAccount = () => {
    if (deleting) return;
    Alert.alert(
      'Delete account?',
      'This permanently deletes your Thrive account and the data stored with it, and removes this account\'s data from this phone. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const result = await deleteAccount();
            setDeleting(false);
            if (result.ok) {
              router.replace('/(auth)/sign-in');
            } else {
              Alert.alert('Account not deleted', result.reason);
            }
          },
        },
      ]
    );
  };

  const bmi = calculateBMI();
  const dailyCalories = calculateDailyCalories();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Enter order={0}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color={Palette.canvas} size={40} />
        </View>
        <Text style={styles.name}>{profile.name || 'User'}</Text>
        {profile.age && profile.gender && (
          <Text style={styles.info}>
            {profile.age} years • {profile.gender}
          </Text>
        )}
      </View>
      </Enter>

      {/* Premium Section */}
      <Enter order={1}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        
        {/* Dev-only: test premium button, gated out of production builds */}
        {__DEV__ && !profile.isPremium && (
          <TouchableOpacity 
            style={[styles.upgradeCard, { backgroundColor: Palette.accent, borderColor: Palette.accent }]}
            onPress={async () => {
              await subscribeToPremium();
              Alert.alert('Success!', 'Premium activated for testing! 🎉');
            }}
          >
            <View style={styles.upgradeContent}>
              <Crown color={Palette.canvas} size={32} />
              <View style={styles.upgradeText}>
                <Text style={[styles.upgradeTitle, { color: Palette.canvas }]}>Test Premium</Text>
                <Text style={[styles.upgradeDescription, { color: Palette.canvas, opacity: 0.9 }]}>
                  Activate premium for testing (free)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        
        {profile.isPremium ? (
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Crown color={Palette.accent} size={24} />
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
              <Crown color={Palette.accent} size={32} />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeDescription}>
                  Unlock AI Body Scanner, Macros Tracking, Recipe Generator & more
                </Text>
                <Text style={styles.upgradePrice}>$4.99/month</Text>
              </View>
            </View>
            <CreditCard color={Palette.inkMuted} size={20} />
          </TouchableOpacity>
        )}
      </View>
      </Enter>

      <Enter order={2}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Brain color={Palette.accent} size={24} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>AI Assistant</Text>
              <Text style={styles.settingDescription}>
                {hasAIConsent(profile)
                  ? `On: sends data to ${AI_SERVICE.name} when you use an AI feature`
                  : 'Off: nothing is sent to an AI service'}
              </Text>
            </View>
          </View>
          <Switch
            value={hasAIConsent(profile)}
            onValueChange={handleToggleAI}
            trackColor={{ false: Palette.lineStrong, true: Palette.accent }}
            thumbColor={Palette.ink}
          />
        </View>

        {profile.aiEnabled && profile.onboardingCompleted && (
          <TouchableOpacity style={styles.settingRow} onPress={handleResetOnboarding}>
            <View style={styles.settingInfo}>
              <RefreshCw color={Palette.bad} size={24} />
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
      </Enter>

      {profile.onboardingCompleted && (
        <Enter order={3}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Activity color={Palette.accent} size={20} />
                <Text style={styles.metricLabel}>BMI</Text>
                <Text style={styles.metricValue}>
                  {bmi ? bmi.toFixed(1) : 'Not set'}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Target color={Palette.accent} size={20} />
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
              <Edit3 color={Palette.canvas} size={20} />
              <Text style={styles.editButtonText}>Edit Goals</Text>
            </TouchableOpacity>
          </View>
        </Enter>
      )}

      <Enter order={4}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Devices & Data</Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push('/(tabs)/profile/devices')}
        >
          <View style={styles.settingInfo}>
            <Smartphone color={Palette.accent} size={24} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Connected Devices</Text>
              <Text style={styles.settingDescription}>
                Manage Apple Watch, WHOOP, Garmin & more
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      </Enter>

      <Enter order={5}>
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut color={Palette.bad} size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel="Delete account"
        >
          <Text style={styles.deleteAccountText}>{deleting ? 'Deleting…' : 'Delete account'}</Text>
        </TouchableOpacity>
      </View>
      </Enter>

      <View style={styles.footerSpace} />

      <EditGoalsModal 
        visible={showEditGoals}
        onClose={() => setShowEditGoals(false)}
      />

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.canvas },
  container: { flex: 1, backgroundColor: Palette.canvas },

  header: {
    alignItems: 'center',
    paddingHorizontal: Space.xl,
    paddingVertical: Space.xxl,
    backgroundColor: Palette.canvas,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.line,
  },
  avatar: {
    width: 80, height: 80, borderRadius: Radius.pill,
    backgroundColor: Palette.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Space.md,
  },
  name: { ...Type.title, color: Palette.ink },
  info: { ...Type.caption, color: Palette.inkMuted, marginTop: Space.xs },

  section: {
    backgroundColor: Palette.canvasRaised,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
    marginTop: Space.md,
    paddingVertical: Space.lg,
  },
  sectionTitle: { ...Type.eyebrow, color: Palette.inkMuted, paddingHorizontal: Space.xl, marginBottom: Space.md },

  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.xl, paddingVertical: Space.md,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: Space.md },
  settingText: { flex: 1 },
  settingLabel: { ...Type.bodyStrong, color: Palette.ink },
  settingDescription: { ...Type.caption, color: Palette.inkMuted, marginTop: 2 },

  metricsGrid: { flexDirection: 'row', paddingHorizontal: Space.xl, gap: Space.md },
  metricCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: Palette.canvas,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
    padding: Space.lg,
  },
  metricLabel: { ...Type.eyebrow, color: Palette.inkMuted, marginTop: Space.sm, marginBottom: Space.xs },
  metricValue: { ...Type.heading, color: Palette.ink, fontVariant: Type.numeral.fontVariant },

  infoGrid: { paddingHorizontal: Space.xl },
  infoItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Space.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.line,
  },
  infoLabel: { ...Type.body, color: Palette.inkMuted },
  infoValue: { ...Type.bodyStrong, color: Palette.ink },

  editButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    backgroundColor: Palette.accent, borderRadius: Radius.pill,
    marginHorizontal: Space.xl, marginTop: Space.lg, paddingVertical: Space.lg,
  },
  editButtonText: { ...Type.bodyStrong, color: Palette.canvas },

  premiumCard: {
    marginHorizontal: Space.xl, padding: Space.lg,
    backgroundColor: Palette.canvas,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
  },
  premiumHeader: { flexDirection: 'row', alignItems: 'center', gap: Space.sm, marginBottom: Space.sm },
  premiumTitle: { ...Type.heading, color: Palette.ink },
  premiumStatus: { ...Type.bodyStrong, color: Palette.accent, marginBottom: Space.xs },
  premiumExpiry: { ...Type.caption, color: Palette.inkMuted, marginBottom: Space.md },
  cancelButton: {
    alignSelf: 'flex-start',
    paddingVertical: Space.sm, paddingHorizontal: Space.md,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  // Destructive actions keep the red label. theme.ts reserves good/warn/bad for data
  // direction; a control that cancels or signs out is neither data nor navigation state,
  // and dropping the convention costs more than the rule saves.
  cancelButtonText: { ...Type.caption, color: Palette.bad },

  upgradeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Space.xl, padding: Space.lg,
    backgroundColor: Palette.canvas,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.line,
  },
  upgradeContent: { flexDirection: 'row', alignItems: 'center', gap: Space.md, flex: 1 },
  upgradeText: { flex: 1 },
  upgradeTitle: { ...Type.bodyStrong, color: Palette.ink, marginBottom: Space.xs },
  upgradeDescription: { ...Type.caption, color: Palette.inkMuted, marginBottom: Space.xs },
  upgradePrice: { ...Type.bodyStrong, color: Palette.accent, fontVariant: Type.numeral.fontVariant },

  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.sm,
    marginHorizontal: Space.xl, paddingVertical: Space.lg,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.lineStrong,
  },
  signOutText: { ...Type.bodyStrong, color: Palette.bad },
  deleteAccountButton: { alignItems: 'center', marginTop: Space.md, paddingVertical: Space.md },
  deleteAccountText: { ...Type.caption, color: Palette.inkMuted, textDecorationLine: 'underline' },

  footerSpace: { height: Space.xxxl },
});
