/**
 * Thrive visual system — the decision, as tokens.
 *
 * DIRECTION: "dark gym, one green light."
 *   The references split into two camps. WHOOP and Ladder are dark, data-forward, one narrow
 *   semantic palette, big numerals you can read from arm's length. Gentler Streak and Strava
 *   are light, warm and humane. Thrive's existing identity is a clinical light palette (white,
 *   greys, a Pantone teal-green used as a small accent on forms), which is exactly the "bland"
 *   Freddy named. The green is real brand equity and stays; what changes is the canvas it sits
 *   on. On a deep green-black the same green becomes the one luminous thing on screen, numbers
 *   become something to look at, and the app reads right at 6am and 10pm, which is when people
 *   open a training app.
 *
 * RULES THE TOKENS ENFORCE
 *   - One accent. Green. Semantic colours (good/warn/bad) are for data direction only, never for
 *     buttons, borders or navigation state. (WHOOP's three-colour vocabulary, applied narrowly.)
 *   - Hierarchy by weight and size, not by colour. The display face is the system font at 800;
 *     the body at 400. Weight contrast is the typography, so no font dependency is added in v1.
 *     (A Google Font is a free, zero-risk upgrade later: expo-font is already installed.)
 *   - Motion means something: entrances 600ms ease-out with an 80ms stagger, state changes
 *     220ms, and nothing loops except the hero glow, which breathes at 4s so the screen is
 *     never fully still before the first tap.
 *   - Every number is tabular. Every tap has a haptic.
 *
 * CONTRAST (WCAG, computed from the hex values, not estimated): accent #19C59A on canvas
 * #0B1512 = 8.4:1; ink #F2F7F5 on canvas = 17.2:1; inkMuted #9FB3AC on canvas = 8.4:1. The
 * original #008264 on the dark canvas would be 3.9:1 -- passes only for large text -- which is
 * why the on-dark accent is the brighter variant and #008264 is kept for light surfaces and
 * the brand mark.
 *
 * constants/colors.ts is untouched so the 30-odd existing screens keep building. New and
 * restyled screens import from here; the migration of the rest is a screen-by-screen job.
 */
import { Platform, type TextStyle } from 'react-native';

// The outer `as const` would make this tuple readonly, which TextStyle rejects.
const TABULAR = ['tabular-nums'] as NonNullable<TextStyle['fontVariant']>;

export const Palette = {
  // canvas
  canvas: '#0B1512',          // deep green-black
  canvasRaised: '#111D19',    // cards, sheets
  canvasOverlay: '#18262146', // 27% ink over canvas (hex8)
  line: '#1F2E29',
  lineStrong: '#2C3F38',
  // ink
  ink: '#F2F7F5',
  inkMuted: '#9FB3AC',
  inkFaint: '#5E6F69',
  // brand
  green: '#008264',           // Pantone 3288 C, the brand mark and light surfaces
  accent: '#19C59A',          // the same green, lit for dark canvas
  accentDeep: '#0E8F6F',
  accentGlow: '#19C59A33',    // 20%
  // data direction only
  good: '#19C59A',
  warn: '#F2B33D',
  bad: '#F0645A',
  // legacy light surfaces
  white: '#FFFFFF',
} as const;

export const Type = {
  family: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
  display: { fontSize: 40, lineHeight: 44, fontWeight: '800' as const, letterSpacing: -1.2 },
  title:   { fontSize: 28, lineHeight: 32, fontWeight: '800' as const, letterSpacing: -0.6 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, letterSpacing: -0.2 },
  body:    { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, letterSpacing: 0 },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const, letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const, letterSpacing: 0.2 },
  eyebrow: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 1.4, textTransform: 'uppercase' as const },
  numeral: { fontSize: 56, lineHeight: 60, fontWeight: '800' as const, letterSpacing: -2, fontVariant: TABULAR },
} as const;

export const Space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const Radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;

export const Motion = {
  state: 220,
  enter: 600,
  stagger: 80,
  breathe: 4000,
} as const;

export const Shadow = {
  glow: { shadowColor: Palette.accent, shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
} as const;
