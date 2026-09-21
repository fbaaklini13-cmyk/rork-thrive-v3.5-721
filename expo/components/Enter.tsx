/**
 * Entrance motion, once, for every screen on the dark system.
 *
 * The Home tab defined this inline; Nutrition and Profile needed the same thing,
 * and three copies of a timing function is how a system turns back into
 * per-screen improvisation. The numbers live in theme.ts (Motion.enter 600ms,
 * Motion.stagger 80ms): `order` is the item's place in the stagger, so a screen
 * reads top-down as it arrives. Entrances only -- nothing here loops.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle, type StyleProp } from 'react-native';
import { Motion } from '@/constants/theme';

export default function Enter({
  children,
  order = 0,
  style,
}: {
  children: React.ReactNode;
  order?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: Motion.enter,
        delay: order * Motion.stagger,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: Motion.enter,
        delay: order * Motion.stagger,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // Mount-once by design: the animated values are refs and `order` is fixed per call
    // site, so re-running this would replay the entrance on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
