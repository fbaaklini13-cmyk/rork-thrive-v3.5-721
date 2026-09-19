import { Tabs, useRouter, useSegments } from "expo-router";
import { Home, Utensils, Dumbbell, User } from "lucide-react-native";
import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet, Platform } from 'react-native';
import { useUserProfile } from '@/hooks/user-profile-store';
import { Palette } from '@/constants/theme';

const AnimatedTabIcon = ({ icon: Icon, color, focused }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.12 : 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Icon color={color} size={24} />
      </Animated.View>
      <View style={[styles.activeIndicator, { opacity: focused ? 1 : 0 }]} />
    </View>
  );
};

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useUserProfile();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in' as any);
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Palette.accent,
        tabBarInactiveTintColor: Palette.inkMuted,
        // The tab bar is the frame every tab sits in, so it moves to the dark
        // system with Home. Tabs still on the light palette will show a dark bar
        // under a light screen until their own pass -- the honest half-state.
        tabBarStyle: {
          backgroundColor: Palette.canvasRaised,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: Palette.line,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
          letterSpacing: 0.3,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={Dumbbell} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: "Nutrition",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={Utensils} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon icon={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Above the icon, not below it: below is where the label sits.
  activeIndicator: {
    position: 'absolute',
    top: -9,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.accent,
  },
});