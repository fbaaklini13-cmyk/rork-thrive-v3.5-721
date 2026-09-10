import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Brain, 
  Crown, 
  Camera, 
  ChefHat, 
  Pill, 
  BarChart3,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { useUserProfile } from '@/hooks/user-profile-store';
import { useRouter } from 'expo-router';
import OnboardingModal from '@/components/OnboardingModal';
import WeeklyCheckInModal from '@/components/WeeklyCheckInModal';
import PremiumModal from '@/components/PremiumModal';
import PremiumFeatureCard from '@/components/PremiumFeatureCard';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const AnimatedCard = ({ children, delay = 0, style }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const AnimatedStatCard = ({ icon: Icon, label, value, unit, color, delay = 0 }: any) => {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedCard delay={delay} style={styles.statCard}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.statCardTouchable}
      >
        <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
          <LinearGradient
            colors={[Colors.white, Colors.white + 'F5']}
            style={styles.statCardGradient}
          >
            <Animated.View 
              style={[
                styles.statIcon,
                { 
                  backgroundColor: color + '15',
                  transform: [{ scale: pulseAnim }],
                }
              ]}
            >
              <Icon color={color} size={24} />
            </Animated.View>
            <Text style={styles.statLabel}>{label}</Text>
            {value !== null && value !== undefined ? (
              <>
                <Text style={styles.statValue}>{value}</Text>
                {unit && <Text style={styles.statUnit}>{unit}</Text>}
              </>
            ) : (
              <Text style={styles.statEmpty}>Not set</Text>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </AnimatedCard>
  );
};

export default function DashboardScreen() {
  const {
    profile,
    completeOnboarding,
    calculateBMI,
    calculateDailyCalories,
    nutritionEntries,
    workoutPlans,
    needsWeeklyCheckIn,
  } = useUserProfile();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWeeklyCheckIn, setShowWeeklyCheckIn] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const headerScale = useRef(new Animated.Value(0.95)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerScale, {
        toValue: 1,
        friction: 6,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    if (profile.aiEnabled && !profile.onboardingCompleted) {
      setShowOnboarding(true);
    } else if (profile.onboardingCompleted) {
      const checkInNeeded = needsWeeklyCheckIn();
      if (checkInNeeded) {
        const timer = setTimeout(() => {
          setShowWeeklyCheckIn(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [profile.aiEnabled, profile.onboardingCompleted]);

  const handleOnboardingComplete = async (data: any) => {
    await completeOnboarding(data);
    setShowOnboarding(false);
  };

  const bmi = calculateBMI();
  const dailyCalories = calculateDailyCalories();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: Colors.underweight };
    if (bmi < 25) return { text: 'Normal', color: Colors.normal };
    if (bmi < 30) return { text: 'Overweight', color: Colors.overweight };
    return { text: 'Obese', color: Colors.obese };
  };

  const todayCalories = nutritionEntries
    .filter((e) => e.date === new Date().toISOString().split('T')[0])
    .reduce((sum, e) => sum + (e.calories || 0), 0);

  const progressPercentage = dailyCalories ? (todayCalories / dailyCalories) * 100 : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.min(progressPercentage / 100, 1),
      duration: 1000,
      delay: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <LinearGradient 
          colors={[Colors.primary, Colors.secondary]} 
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [
                  {
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width, width],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
          
          <Sparkles 
            size={20} 
            color={Colors.white} 
            style={styles.sparkleIcon} 
          />
          
          <Text style={styles.greeting}>
            Hello, {profile.name || 'there'}! 👋
          </Text>
          <Text style={styles.subGreeting}>
            {profile.aiEnabled
              ? "Your AI assistant is ready to help"
              : "Enable AI for personalized insights"}
          </Text>
        </LinearGradient>
      </Animated.View>

      {profile.aiEnabled && profile.onboardingCompleted && (
        <>
          <View style={styles.statsContainer}>
            <AnimatedStatCard
              icon={Activity}
              label="BMI"
              value={bmi?.toFixed(1)}
              unit={bmi ? getBMICategory(bmi).text : null}
              color={bmi ? getBMICategory(bmi).color : Colors.primary}
              delay={200}
            />
            <AnimatedStatCard
              icon={TrendingUp}
              label="Daily Target"
              value={dailyCalories}
              unit="calories"
              color={Colors.secondary}
              delay={300}
            />
          </View>

          <AnimatedCard delay={400} style={styles.progressCard}>
            {Platform.OS === 'web' ? (
              <View style={styles.progressContent}>
                <View style={styles.progressHeader}>
                  <Zap size={20} color={Colors.warning} />
                  <Text style={styles.progressTitle}>Today's Progress</Text>
                </View>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[Colors.secondary, Colors.primary]}
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                </View>
                <Text style={styles.progressText}>
                  {todayCalories} / {dailyCalories || 2000} calories
                </Text>
              </View>
            ) : (
              <BlurView intensity={90} tint="light" style={styles.progressContent}>
                <View style={styles.progressHeader}>
                  <Zap size={20} color={Colors.warning} />
                  <Text style={styles.progressTitle}>Today's Progress</Text>
                </View>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[Colors.secondary, Colors.primary]}
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                </View>
                <Text style={styles.progressText}>
                  {todayCalories} / {dailyCalories || 2000} calories
                </Text>
              </BlurView>
            )}
          </AnimatedCard>

          <View style={styles.quickStats}>
            <AnimatedCard delay={500} style={styles.quickStatCard}>
              <TouchableOpacity style={styles.quickStatTouchable}>
                <Target color={Colors.warning} size={20} />
                <Text style={styles.quickStatValue}>{workoutPlans.length}</Text>
                <Text style={styles.quickStatLabel}>Workout Plans</Text>
              </TouchableOpacity>
            </AnimatedCard>

            <AnimatedCard delay={600} style={styles.quickStatCard}>
              <TouchableOpacity style={styles.quickStatTouchable}>
                <Brain color={Colors.primary} size={20} />
                <Text style={styles.quickStatValue}>
                  {profile.fitnessGoal || 'Health'}
                </Text>
                <Text style={styles.quickStatLabel}>Fitness Goal</Text>
              </TouchableOpacity>
            </AnimatedCard>
          </View>
        </>
      )}

      {!profile.aiEnabled && (
        <AnimatedCard delay={200} style={styles.aiPrompt}>
          <Brain color={Colors.primary} size={48} />
          <Text style={styles.aiPromptTitle}>Enable AI Assistant</Text>
          <Text style={styles.aiPromptText}>
            Get personalized nutrition insights, workout plans, and productivity coaching
          </Text>
          <Text style={styles.aiPromptHint}>
            Go to Profile → AI Settings to get started
          </Text>
        </AnimatedCard>
      )}

      <AnimatedCard delay={700} style={styles.premiumSection}>
        <View style={styles.premiumHeader}>
          <Text style={styles.premiumTitle}>Premium Features</Text>
          {!profile.isPremium && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <LinearGradient
                colors={[Colors.warning, Colors.warning + 'DD']}
                style={styles.upgradeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Crown size={16} color={Colors.white} />
                <Text style={styles.upgradeText}>Upgrade</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <PremiumFeatureCard
          title="AI Body Scanner"
          description="Analyze your physique with AI"
          icon={<Camera size={24} color={Colors.primary} />}
          isPremium={profile.isPremium}
          onPress={() => {
            if (profile.isPremium) {
              router.push('/premium/body-scanner');
            } else {
              setShowPremiumModal(true);
            }
          }}
        />

        <PremiumFeatureCard
          title="Macros Breakdown"
          description="Track protein, carbs, and fats"
          icon={<BarChart3 size={24} color={Colors.primary} />}
          isPremium={profile.isPremium}
          onPress={() => {
            if (profile.isPremium) {
              router.push('/premium/macros');
            } else {
              setShowPremiumModal(true);
            }
          }}
        />

        <PremiumFeatureCard
          title="Recipe Generator"
          description="AI-powered meal suggestions"
          icon={<ChefHat size={24} color={Colors.primary} />}
          isPremium={profile.isPremium}
          onPress={() => {
            if (profile.isPremium) {
              router.push('/premium/recipes');
            } else {
              setShowPremiumModal(true);
            }
          }}
        />

        <PremiumFeatureCard
          title="Supplement Guide"
          description="Personalized supplement recommendations"
          icon={<Pill size={24} color={Colors.primary} />}
          isPremium={profile.isPremium}
          onPress={() => {
            if (profile.isPremium) {
              router.push('/premium/supplements');
            } else {
              setShowPremiumModal(true);
            }
          }}
        />
      </AnimatedCard>

      <OnboardingModal
        visible={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      <WeeklyCheckInModal
        visible={showWeeklyCheckIn}
        onClose={() => setShowWeeklyCheckIn(false)}
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
  headerContainer: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width * 2,
  },
  sparkleIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.7,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.white,
    marginBottom: 4,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  statCardTouchable: {
    flex: 1,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '10',
    borderRadius: 20,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.darkGrey,
    letterSpacing: -1,
  },
  statUnit: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 4,
  },
  statEmpty: {
    fontSize: 16,
    color: Colors.mediumGrey,
    marginTop: 8,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  progressContent: {
    padding: 20,
    backgroundColor: Platform.OS === 'web' ? Colors.white : 'transparent',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.darkGrey,
    letterSpacing: -0.3,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.lightGrey + '80',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  quickStatTouchable: {
    padding: 16,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.darkGrey,
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  quickStatLabel: {
    fontSize: 12,
    color: Colors.mediumGrey,
    letterSpacing: 0.3,
  },
  aiPrompt: {
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '10',
  },
  aiPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.darkGrey,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  aiPromptText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiPromptHint: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  premiumSection: {
    padding: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: Colors.darkGrey,
    letterSpacing: -0.5,
  },
  upgradeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  upgradeText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
