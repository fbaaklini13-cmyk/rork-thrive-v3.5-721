/**
 * The one-screen consent step for AI features (App Review 5.1.2(i)).
 *
 *   const requestAIConsent = useAIConsent();
 *   if (!(await requestAIConsent())) return;   // before any AI call
 *
 * Resolves true at once if consent is already on record (current version); otherwise
 * shows the disclosure and resolves with the user's answer. "Allow" records a versioned
 * consent on the profile; "Not now" changes nothing. See lib/ai-consent.ts.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useUserProfile } from '@/hooks/user-profile-store';
import { AI_DATA_USES, AI_SERVICE, consentGrant, hasAIConsent, setAIConsentGate } from '@/lib/ai-consent';
import { Palette, Radius, Space, Type } from '@/constants/theme';

type Request = () => Promise<boolean>;
const Ctx = createContext<Request>(async () => false);
export const useAIConsent = () => useContext(Ctx);

export function AIConsentProvider({ children }: { children: React.ReactNode }) {
  const { profile, updateProfile } = useUserProfile();
  const [visible, setVisible] = useState(false);
  const pending = useRef<((ok: boolean) => void) | null>(null);
  const consented = hasAIConsent(profile);

  // Keep the service-layer backstop in step with what is on record.
  useEffect(() => { setAIConsentGate(consented); }, [consented]);

  const request = useCallback<Request>(() => {
    if (consented) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      pending.current?.(false);          // a second request supersedes an open one
      pending.current = resolve;
      setVisible(true);
    });
  }, [consented]);

  const answer = async (ok: boolean) => {
    if (ok) {
      await updateProfile(consentGrant());
      setAIConsentGate(true);            // before the caller's AI request runs
    }
    setVisible(false);
    pending.current?.(ok);
    pending.current = null;
  };

  return (
    <Ctx.Provider value={request}>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => answer(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet} accessibilityViewIsModal>
            <ScrollView contentContainerStyle={styles.content}>
              <ShieldCheck color={Palette.accent} size={28} />
              <Text style={styles.title}>Use AI features?</Text>
              <Text style={styles.body}>
                AI features work by sending some of your information to {AI_SERVICE.name} ({AI_SERVICE.host}),
                an outside service. Nothing is sent unless you tap Allow, and only when you use one of
                these features:
              </Text>
              {AI_DATA_USES.map((u) => (
                <View key={u.feature} style={styles.row}>
                  <Text style={styles.feature}>{u.feature}</Text>
                  <Text style={styles.sends}>sends {u.sends}</Text>
                </View>
              ))}
              <Text style={styles.body}>
                Everything else (your workouts, meals, measurements and progress photos) stays on this
                phone. You can turn AI off any time in Profile → AI Assistant.
              </Text>
            </ScrollView>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => answer(false)}
                accessibilityRole="button" accessibilityLabel="Not now">
                <Text style={styles.secondaryText}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.primary]} onPress={() => answer(true)}
                accessibilityRole="button" accessibilityLabel="Allow AI features">
                <Text style={styles.primaryText}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Ctx.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#000000B3', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Palette.canvasRaised, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    borderWidth: 1, borderColor: Palette.line, maxHeight: '88%',
  },
  content: { padding: Space.xl, gap: Space.md },
  title: { ...Type.heading, color: Palette.ink },
  body: { ...Type.body, color: Palette.inkMuted },
  row: { paddingVertical: Space.sm, borderTopWidth: 1, borderTopColor: Palette.line },
  feature: { ...Type.bodyStrong, color: Palette.ink },
  sends: { ...Type.caption, color: Palette.inkMuted, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Space.md, padding: Space.xl, paddingTop: Space.md },
  button: { flex: 1, paddingVertical: Space.lg, borderRadius: Radius.pill, alignItems: 'center' },
  primary: { backgroundColor: Palette.accent },
  primaryText: { ...Type.bodyStrong, color: Palette.canvas },
  secondary: { borderWidth: 1, borderColor: Palette.lineStrong },
  secondaryText: { ...Type.bodyStrong, color: Palette.ink },
});
