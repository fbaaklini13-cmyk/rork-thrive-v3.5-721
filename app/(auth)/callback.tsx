import { useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import * as Linking from 'expo-linking';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback params:', params);
        
        const url = await Linking.getInitialURL();
        console.log('Initial URL:', url);

        if (url) {
          const parsedUrl = Linking.parse(url);
          console.log('Parsed URL:', parsedUrl);
          
          if (parsedUrl.queryParams?.access_token) {
            const accessToken = parsedUrl.queryParams.access_token as string;
            const refreshToken = parsedUrl.queryParams.refresh_token as string;
            
            console.log('Setting session from URL params');
            
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error('Error setting session:', error);
              router.replace('/(auth)/sign-in');
              return;
            }
            
            if (data.session) {
              console.log('Session set successfully, redirecting to home');
              router.replace('/(tabs)/home');
              return;
            }
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.replace('/(auth)/sign-in');
          return;
        }

        if (session) {
          console.log('Session found, redirecting to home');
          router.replace('/(tabs)/home');
        } else {
          console.log('No session found, redirecting to sign-in');
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/sign-in');
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Completing sign in...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: Colors.darkGrey,
  },
});
