import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motion, Palette, Radius, Space, Type } from '@/constants/theme';

/**
 * The intro before the sign-up ask.
 *
 * Freddy's complaint, verbatim: "there is no page animation or intro, like images before
 * signing up, it's just phrases." Before this screen, an unauthenticated user was routed
 * straight to a login form. Now they get four full-bleed slides with real imagery and
 * motion, and the sign-up button is the last thing they see, not the first.
 *
 * Every claim on a slide is a feature that exists on this branch: the workout logger, the
 * 873-exercise library with demonstration frames, the progress and muscle-heatmap screens,
 * and the training programs. Nothing aspirational is promised here.
 *
 * Imagery is the free-exercise-db photography the app already uses in the exercise library
 * (public domain, served from raw.githubusercontent.com). If the network is not there on
 * first launch the slide still works: the canvas, the glow and the type carry it.
 *
 * Motion is core react-native Animated only -- no new native dependency, so this builds
 * without a rebuild. reanimated is the obvious upgrade when the app next takes one.
 */

const { width: W, height: H } = Dimensions.get('window');
export const INTRO_SEEN_KEY = 'thrive.intro_seen.v1';

const IMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

type Slide = { key: string; eyebrow: string; title: string; body: string; image: string };
const SLIDES: Slide[] = [
  { key: 'log', eyebrow: 'Thrive', title: 'Every rep,\ncounted.', body: 'Log each session as you train. Sets, weight and rest, without slowing you down.', image: `${IMG}/Barbell_Squat/0.jpg` },
  { key: 'library', eyebrow: '873 exercises', title: 'Shown,\nnot described.', body: 'Every movement in the library comes with a demonstration and step-by-step form cues.', image: `${IMG}/Pullups/0.jpg` },
  { key: 'progress', eyebrow: 'Progress', title: 'See what\nis changing.', body: 'A muscle heatmap and week-over-week progress, built from what you actually lifted.', image: `${IMG}/Barbell_Deadlift/0.jpg` },
  { key: 'start', eyebrow: 'Programs', title: 'Start where\nyou are.', body: 'Programs for every level, and a nutrition log alongside. Your data stays yours.', image: `${IMG}/Plank/0.jpg` },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<Animated.FlatList<Slide> | null>(null);
  const [index, setIndex] = useState(0);
  const breathe = useRef(new Animated.Value(0)).current;

  // The hero glow breathes so the screen is never fully still before the first tap.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: Motion.breathe / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: Motion.breathe / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    AsyncStorage.setItem(INTRO_SEEN_KEY, '1').catch(() => {});
    return () => loop.stop();
  }, [breathe]);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true });

  // The active index comes from the scroll position itself, not from onMomentumScrollEnd:
  // a programmatic scrollToOffset does not reliably end with a momentum event (never on web,
  // inconsistently on Android), and that left the copy on slides 2-4 at opacity 0 in the
  // first web render. Reading scrollX works everywhere the list can move.
  const indexRef = useRef(0);
  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      const i = Math.max(0, Math.min(SLIDES.length - 1, Math.round(value / W)));
      if (i !== indexRef.current) {
        indexRef.current = i;
        setIndex(i);
        Haptics.selectionAsync().catch(() => {});
      }
    });
    return () => scrollX.removeListener(id);
  }, [scrollX]);

  const goTo = (i: number) => scrollRef.current?.scrollToOffset({ offset: i * W, animated: true });
  const last = index === SLIDES.length - 1;

  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.08] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.9] });

  return (
    <View style={styles.root}>
      <Animated.FlatList
        ref={scrollRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index: i }) => <SlideView slide={item} i={i} scrollX={scrollX} active={i === index} />}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
      />

      {/* the one green light: a real radial falloff, so there is no visible disc edge */}
      <Animated.View pointerEvents="none" style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id="g" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={Palette.accent} stopOpacity={0.28} />
              <Stop offset="0.55" stopColor={Palette.accent} stopOpacity={0.08} />
              <Stop offset="1" stopColor={Palette.accent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#g)" />
        </Svg>
      </Animated.View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.chrome} pointerEvents="box-none">
        <View style={styles.topRow} pointerEvents="box-none">
          <Text style={styles.brand}>THRIVE</Text>
          <Pressable onPress={() => router.replace('/(auth)/sign-in')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Skip intro">
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.bottom} pointerEvents="box-none">
          <Dots count={SLIDES.length} scrollX={scrollX} />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              if (last) router.replace('/(auth)/sign-up');
              else goTo(index + 1);
            }}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>{last ? 'Get started' : 'Continue'}</Text>
          </Pressable>
          <Pressable onPress={() => router.replace('/(auth)/sign-in')} hitSlop={8} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryText}>I already have an account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SlideView({ slide, i, scrollX, active }: { slide: Slide; i: number; scrollX: Animated.Value; active: boolean }) {
  const inputRange = [(i - 1) * W, i * W, (i + 1) * W];
  // parallax: the photo moves at a third of the scroll speed, so it feels set behind the glass
  const imgTranslate = scrollX.interpolate({ inputRange, outputRange: [W * 0.33, 0, -W * 0.33], extrapolate: 'clamp' });
  const imgScale = scrollX.interpolate({ inputRange, outputRange: [1.12, 1, 1.12], extrapolate: 'clamp' });

  // staggered entrance for the copy the first time the slide becomes active
  const entered = useRef(new Animated.Value(i === 0 ? 1 : 0)).current;
  useEffect(() => {
    if (active) {
      Animated.timing(entered, { toValue: 1, duration: Motion.enter, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }
  }, [active, entered]);
  const rise = (delayFraction: number) => ({
    opacity: entered.interpolate({ inputRange: [delayFraction, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [{ translateY: entered.interpolate({ inputRange: [delayFraction, 1], outputRange: [18, 0], extrapolate: 'clamp' }) }],
  });
  const stagger = useMemo(() => [0, Motion.stagger / Motion.enter, (2 * Motion.stagger) / Motion.enter], []);

  return (
    <View style={styles.slide}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: imgTranslate }, { scale: imgScale }] }]}>
        <Image
          source={{ uri: slide.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="center"
          transition={400}
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      {/* the photo sits under a green-black wash so the type always reads and the palette stays one
          colour whatever the gym walls happen to be: a flat tint over the whole frame, then a
          gradient that resolves to the canvas behind the copy */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint]} />
      <LinearGradient
        colors={['rgba(11,21,18,0.15)', 'rgba(11,21,18,0.70)', Palette.canvas]}
        locations={[0, 0.55, 0.92]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.copy}>
        <Animated.Text style={[styles.eyebrow, rise(stagger[0])]}>{slide.eyebrow}</Animated.Text>
        <Animated.Text style={[styles.title, rise(stagger[1])]}>{slide.title}</Animated.Text>
        <Animated.Text style={[styles.body, rise(stagger[2])]}>{slide.body}</Animated.Text>
      </View>
    </View>
  );
}

function Dots({ count, scrollX }: { count: number; scrollX: Animated.Value }) {
  return (
    <View style={styles.dots} accessibilityRole="progressbar">
      {Array.from({ length: count }).map((_, i) => {
        const inputRange = [(i - 1) * W, i * W, (i + 1) * W];
        const width = scrollX.interpolate({ inputRange, outputRange: [6, 22, 6], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.35, 1, 0.35], extrapolate: 'clamp' });
        return <Animated.View key={i} style={[styles.dot, { width, opacity }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  slide: { width: W, height: H, backgroundColor: Palette.canvas, justifyContent: 'flex-end' },
  copy: { paddingHorizontal: Space.xl, paddingBottom: H * 0.30 },
  eyebrow: { ...Type.eyebrow, color: Palette.accent, marginBottom: Space.md },
  title: { ...Type.display, color: Palette.ink, marginBottom: Space.lg },
  body: { ...Type.body, color: Palette.inkMuted, maxWidth: 320 },
  glow: { position: 'absolute', left: -W * 0.45, top: H * 0.36, width: W * 1.3, height: W * 1.3 },
  tint: { backgroundColor: 'rgba(11,21,18,0.42)' },
  chrome: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Space.xl, paddingTop: Space.sm },
  brand: { ...Type.eyebrow, color: Palette.ink, letterSpacing: 3 },
  skip: { ...Type.caption, color: Palette.inkMuted },
  bottom: { paddingHorizontal: Space.xl, paddingBottom: Space.md, gap: Space.md },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: Space.sm },
  dot: { height: 6, borderRadius: 3, backgroundColor: Palette.accent },
  cta: {
    backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: 16, alignItems: 'center',
    shadowColor: Palette.accent, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 6 },
  },
  ctaPressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },
  ctaText: { ...Type.bodyStrong, color: Palette.canvas, fontWeight: '800' },
  secondary: { alignItems: 'center', paddingVertical: Space.sm },
  secondaryText: { ...Type.caption, color: Palette.inkMuted },
});
