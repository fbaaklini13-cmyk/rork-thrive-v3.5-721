import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Lock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isPremium: boolean;
  onPress: () => void;
}

export default function PremiumFeatureCard({
  title,
  description,
  icon,
  isPremium,
  onPress,
}: PremiumFeatureCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isPremium) {
      // Shimmer effect for locked cards
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
      
      // Bounce animation for lock icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -5,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isPremium]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.card,
          !isPremium && styles.lockedCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >

        
        {!isPremium && (
          <Animated.View
            style={[
              styles.shimmerEffect,
              {
                transform: [
                  {
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-200, 400],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
              style={styles.shimmerGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
        )}
        
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={isPremium ? [Colors.primary + '20', Colors.secondary + '20'] : ['#F4F6F7', '#F4F6F7']}
            style={styles.iconGradient}
          >
            {icon}
            {!isPremium && (
              <Animated.View
                style={[
                  styles.lockOverlay,
                  {
                    transform: [{ translateY: bounceAnim }],
                  },
                ]}
              >
                <Lock size={20} color={Colors.white} />
              </Animated.View>
            )}
            {isPremium && (
              <View style={styles.sparkleIcon}>
                <Sparkles size={12} color={Colors.primary} />
              </View>
            )}
          </LinearGradient>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, !isPremium && styles.lockedText]}>{title}</Text>
          <Text style={[styles.description, !isPremium && styles.lockedText]}>
            {description}
          </Text>
          {!isPremium && (
            <View style={styles.premiumBadgeContainer}>
              <LinearGradient
                colors={[Colors.warning, Colors.warning + 'DD']}
                style={styles.premiumBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.premiumBadge}>PREMIUM</Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.primary + '08',
    overflow: 'hidden',
    position: 'relative',
  },
  lockedCard: {
    opacity: 0.85,
    borderColor: Colors.mediumGrey + '20',
  },

  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 200,
  },
  shimmerGradient: {
    flex: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary + 'DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.darkGrey,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: Colors.mediumGrey,
    letterSpacing: 0.2,
  },
  lockedText: {
    opacity: 0.7,
  },
  premiumBadgeContainer: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  premiumBadgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  premiumBadge: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});