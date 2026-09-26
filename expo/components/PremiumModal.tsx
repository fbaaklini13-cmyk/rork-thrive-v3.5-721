/**
 * Premium sheet, on the dark system.
 *
 * Same store call (`subscribeToPremium`, which throws PAYMENTS_NOT_CONFIGURED
 * outside __DEV__ -- the guard from 461a756 is untouched), same four features,
 * same price line, same "Coming soon" outcome. What changed: a bottom sheet
 * instead of a centred white card with a green gradient banner; the crown and
 * the feature icons are the single accent on canvas rather than green-on-grey;
 * the price is a numeral, not a green headline; the sparkle emoji is gone.
 *
 * One honesty change: the button used to say "Start Free Trial" while the
 * copy said "Only $4.99/month" and nothing in the app implements a trial or a
 * payment. It now says "Continue" -- the sheet's job is to tell the truth about
 * what premium is, and the store decides what happens next.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Crown, Camera, ChefHat, Pill, BarChart3, X } from 'lucide-react-native';
import Enter from '@/components/Enter';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
}

const FEATURES = [
  { icon: Camera, title: 'AI body scanner', description: 'A visual AI estimate from a photo, to compare over time' },
  { icon: BarChart3, title: 'Macros breakdown', description: 'Protein, carbs and fats alongside calories' },
  { icon: ChefHat, title: 'Recipe generator', description: 'Meal ideas that fit your goals' },
  { icon: Pill, title: 'Supplement generator', description: 'General guidance on common supplements, with typical ranges' },
] as const;

export default function PremiumModal({ visible, onClose, onSubscribe }: PremiumModalProps) {
  const { subscribeToPremium, profile } = useUserProfile();

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      await subscribeToPremium();
      Alert.alert('Welcome to Thrive Premium', 'All premium features are now unlocked.');
      onSubscribe?.();
      onClose();
    } catch (error) {
      const notConfigured = error instanceof Error && error.message === 'PAYMENTS_NOT_CONFIGURED';
      Alert.alert(
        notConfigured ? 'Coming soon' : 'Something went wrong',
        notConfigured
          ? 'Subscriptions are not available in this version yet. Check back soon.'
          : 'Could not subscribe. Please try again.',
      );
    }
  };

  if (profile.isPremium) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <Enter order={0} style={styles.header}>
            <View style={styles.crownWrap}>
              <Crown size={28} color={Palette.accent} strokeWidth={1.75} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>Thrive Premium</Text>
              <Text style={styles.title}>All features, unlocked</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={22} color={Palette.inkMuted} />
            </TouchableOpacity>
          </Enter>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {FEATURES.map((feature, index) => (
              <Enter key={feature.title} order={index + 1} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <feature.icon size={20} color={Palette.accent} strokeWidth={1.75} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </Enter>
            ))}
          </ScrollView>

          <Enter order={FEATURES.length + 1} style={styles.footer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>$4.99</Text>
              <Text style={styles.priceUnit}>/ month</Text>
              <Text style={styles.priceNote}>Cancel anytime</Text>
            </View>
            <TouchableOpacity
              style={styles.primary}
              onPress={handleSubscribe}
              accessibilityRole="button"
              accessibilityLabel="Continue to Thrive Premium"
            >
              <Text style={styles.primaryText}>Continue</Text>
            </TouchableOpacity>
          </Enter>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(3, 8, 6, 0.72)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Palette.canvasRaised,
    borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
    maxHeight: '88%',
  },
  grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: Palette.lineStrong, marginTop: Space.sm },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: Space.md,
    paddingHorizontal: Space.xl, paddingTop: Space.lg, paddingBottom: Space.md,
  },
  crownWrap: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Palette.accentGlow, alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  eyebrow: { ...Type.eyebrow, color: Palette.accent },
  title: { ...Type.heading, color: Palette.ink, marginTop: Space.xs },

  body: { flexGrow: 0 },
  bodyContent: { paddingHorizontal: Space.xl, paddingTop: Space.sm, paddingBottom: Space.md, gap: Space.md },
  feature: {
    flexDirection: 'row', alignItems: 'center', gap: Space.md,
    backgroundColor: Palette.canvas, borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.line,
    padding: Space.md,
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Palette.canvasRaised, alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { ...Type.bodyStrong, color: Palette.ink },
  featureDescription: { ...Type.caption, color: Palette.inkMuted, marginTop: 2 },

  footer: { padding: Space.xl, paddingTop: Space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.line },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Space.lg },
  price: { ...Type.title, color: Palette.ink, fontVariant: Type.numeral.fontVariant },
  priceUnit: { ...Type.body, color: Palette.inkMuted, marginLeft: Space.xs },
  priceNote: { ...Type.caption, color: Palette.inkFaint, marginLeft: 'auto' },
  primary: { alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.accent, borderRadius: Radius.pill, paddingVertical: Space.lg },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
});
