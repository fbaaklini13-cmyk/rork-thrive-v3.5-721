import React, { useState } from 'react';
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
import { Mail, Lock, Eye, EyeOff, Chrome, Apple as AppleIcon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithOAuth } = useUserProfile();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const success = await signUp(emailAddress, password);
      
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Error', 'Email already exists');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      Alert.alert('Error', 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const onOAuthSignIn = async (provider: 'google' | 'apple') => {
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
            colors={[Colors.primary, Colors.secondary]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.mediumGrey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.mediumGrey}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.mediumGrey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.mediumGrey}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Colors.mediumGrey} />
                ) : (
                  <Eye size={20} color={Colors.mediumGrey} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={onSignUpPress}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.signUpGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.oauthContainer}>
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={() => onOAuthSignIn('google')}
                disabled={loading}
              >
                <Chrome size={24} color={Colors.darkGrey} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={() => onOAuthSignIn('apple')}
                disabled={loading}
              >
                <AppleIcon size={24} color={Colors.darkGrey} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signInPrompt}
              onPress={() => router.back()}
            >
              <Text style={styles.signInPromptText}>
                Already have an account?{' '}
                <Text style={styles.signInLink}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 40,
    paddingTop: 80,
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    padding: 24,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkGrey,
  },
  eyeIcon: {
    padding: 4,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  signUpGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.white,
  },
  signInPrompt: {
    alignItems: 'center',
    marginTop: 32,
  },
  signInPromptText: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  signInLink: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.mediumGrey,
  },
  tabTextActive: {
    color: Colors.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGrey,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  oauthButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
