import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

interface ExerciseDemoProps {
  /** Ordered frames of the movement (free-exercise-db ships two: start + end). */
  imageUrls: string[];
  width: number;
  height?: number;
  /** ms each frame is held before crossfading to the next. */
  holdMs?: number;
  /** ms the crossfade itself takes. */
  fadeMs?: number;
}

/**
 * Turns the 2 still frames we have per exercise into a looping start → end → start
 * "demo" by crossfading between them. Zero new assets, no native deps
 * (core Animated with the native driver). With one frame it just shows it.
 */
export default function ExerciseDemo({
  imageUrls,
  width,
  height = 220,
  holdMs = 900,
  fadeMs = 550,
}: ExerciseDemoProps) {
  const frames = imageUrls.filter(Boolean);
  const [failed, setFailed] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (frames.length < 2) return;
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(holdMs),
        Animated.timing(progress, { toValue: 1, duration: fadeMs, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(holdMs),
        Animated.timing(progress, { toValue: 0, duration: fadeMs, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames.length, frames[0], frames[1], holdMs, fadeMs]);

  if (frames.length === 0 || failed) {
    return null;
  }

  const frameStyle = { width, height };

  if (frames.length === 1) {
    return (
      <Image
        source={{ uri: frames[0] }}
        style={[styles.frame, frameStyle]}
        resizeMode="contain"
        onError={() => setFailed(true)}
        accessibilityLabel="Exercise demonstration"
      />
    );
  }

  return (
    <View style={[styles.container, frameStyle]} accessibilityLabel="Exercise demonstration, start and end position">
      <Image
        source={{ uri: frames[0] }}
        style={[styles.frame, styles.layer, frameStyle]}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
      <Animated.Image
        source={{ uri: frames[1] }}
        style={[styles.frame, styles.layer, frameStyle, { opacity: progress }]}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
      <View style={styles.badges} pointerEvents="none">
        <Animated.Text style={[styles.badge, { opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.25] }) }]}>Start</Animated.Text>
        <Animated.Text style={[styles.badge, { opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }) }]}>End</Animated.Text>
      </View>
      <Text style={styles.caption}>Loops between the start and end position</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  frame: {
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  badges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  caption: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    fontSize: 10,
    color: Colors.mediumGrey,
  },
});
