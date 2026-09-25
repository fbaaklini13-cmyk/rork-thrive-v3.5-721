import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Palette, Radius, Space, Type } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signInWithOAuth, signInWithApple } = useUserProfile();
  // Sign in with Apple is native-only (iOS 13+). Elsewhere the button is not shown:
  // App Review guideline 4.8 applies to the iOS app, and Apple's web flow would need a
  // Services ID and a rotating client secret that this setup deliberately avoids.
  const [appleAvailable, setAppleAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => setAppleAvailable(false));
  }, []);

  const onAppleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithApple();
      if (result.ok) {
        router.replace('/(tabs)/home');
      } else if (!result.cancelled) {
        Alert.alert('Sign in with Apple', result.reason);
      }
    } finally {
      setLoading(false);
    }
  };

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const success = await signIn(emailAddress, password);
      
      if (success) {
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onOAuthSignIn = async (provider: 'google') => {
    setLoading(true);
    try {
      const success = await signInWithOAuth(provider);
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Error', `Failed to sign in with ${provider}`);
      }
    } catch (err: any) {
      console.error('OAuth sign in error:', err);
      Alert.alert('Error', `Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={[Palette.canvas, Palette.canvas]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Palette.inkMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Palette.inkFaint}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Palette.inkMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Palette.inkFaint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Palette.inkMuted} />
                ) : (
                  <Eye size={20} color={Palette.inkMuted} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={onSignInPress}
              disabled={loading}
            >
              <LinearGradient
                colors={[Palette.accent, Palette.accentDeep]}
                style={styles.signInGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color={Palette.canvas} />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {appleAvailable && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={Radius.md}
                style={styles.appleButton}
                onPress={onAppleSignIn}
              />
            )}

            <View style={styles.oauthContainer}>
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={() => onOAuthSignIn('google')}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
              >
                <Chrome size={24} color={Palette.ink} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signUpPrompt}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={styles.signUpPromptText}>
                Don&apos;t have an account?{' '}
                <Text style={styles.signUpLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Restyled 19 Sep 2026 to the dark system in constants/theme.ts so the intro -> auth
  // transition is one screen family, not a jolt from a green-black canvas to a white form.
  // Keys are unchanged so the JSX above is untouched; only values moved.
  safeArea: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: Space.xxxl,
    paddingBottom: Space.xl,
    paddingHorizontal: Space.xl,
    alignItems: 'flex-start',
  },
  title: {
    ...Type.display,
    color: Palette.ink,
    marginBottom: Space.sm,
  },
  subtitle: {
    ...Type.body,
    color: Palette.inkMuted,
  },
  formContainer: {
    flex: 1,
    padding: Space.xl,
    paddingTop: Space.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.canvasRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.line,
    marginBottom: Space.md,
    paddingHorizontal: Space.lg,
    height: 56,
  },
  inputIcon: {
    marginRight: Space.md,
  },
  input: {
    flex: 1,
    ...Type.body,
    color: Palette.ink,
  },
  eyeIcon: {
    padding: Space.xs,
  },
  signInButton: {
    marginTop: Space.sm,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    shadowColor: Palette.accent,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  signInButtonText: {
    ...Type.bodyStrong,
    fontWeight: '800',
    color: Palette.canvas,
  },
  signUpPrompt: {
    marginTop: Space.xl,
    alignItems: 'center',
  },
  signUpPromptText: {
    ...Type.caption,
    color: Palette.inkMuted,
  },
  signUpLink: {
    color: Palette.accent,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Palette.canvasRaised,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Space.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Space.md,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Palette.accentDeep,
  },
  tabText: {
    ...Type.caption,
    color: Palette.inkMuted,
  },
  tabTextActive: {
    color: Palette.ink,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Space.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.line,
  },
  dividerText: {
    ...Type.caption,
    color: Palette.inkFaint,
    marginHorizontal: Space.md,
  },
  appleButton: {
    width: '100%',
    height: 52,
    marginBottom: Space.md,
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Space.md,
  },
  oauthButton: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Palette.canvasRaised,
    borderWidth: 1,
    borderColor: Palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
