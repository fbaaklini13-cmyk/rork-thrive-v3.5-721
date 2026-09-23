import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INTRO_SEEN_KEY } from './(auth)/welcome';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette } from '@/constants/theme';
import { useUserProfile } from '@/hooks/user-profile-store';

export default function Index() {
  const { isAuthenticated, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace('/(tabs)/home');
      return;
    }
    // First launch gets the intro; a returning signed-out user goes straight to sign-in.
    // A storage failure falls through to the intro -- the friendlier of the two defaults.
    let cancelled = false;
    AsyncStorage.getItem(INTRO_SEEN_KEY)
      .then((seen) => { if (!cancelled) router.replace(seen ? '/(auth)/sign-in' : '/(auth)/welcome'); })
      .catch(() => { if (!cancelled) router.replace('/(auth)/welcome'); });
    return () => { cancelled = true; };
  }, [isAuthenticated, isLoading, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Palette.accent} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1512',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
