import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProfileProvider } from "@/hooks/user-profile-store";
import { HealthDevicesProvider } from "@/hooks/use-health-devices";
import { AIConsentProvider } from "@/components/AIConsentProvider";
import { Palette } from "@/constants/theme";
import { trpc, trpcClient } from "@/lib/trpc";
import { whoopService } from "@/services/whoop-service";
import { garminService } from "@/services/garmin-service";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// The four premium screens also set these from inside themselves; setting them
// here too means the first frame, before the screen mounts, is already dark
// rather than the old green header (26 Sep).
const premiumHeader = {
  headerStyle: { backgroundColor: Palette.canvas },
  headerTintColor: Palette.ink,
  headerShadowVisible: false,
} as const;

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="premium/body-scanner" options={{ title: "AI Body Scanner", ...premiumHeader }} />
      <Stack.Screen name="premium/macros" options={{ title: "Macros Breakdown", ...premiumHeader }} />
      <Stack.Screen name="premium/recipes" options={{ title: "Recipe Generator", ...premiumHeader }} />
      <Stack.Screen name="premium/supplements" options={{ title: "Supplement Guide", ...premiumHeader }} />
    </Stack>
  );
}

export default function RootLayout() {
  const hasHandledInitial = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const onUrl = async ({ url }: { url: string }) => {
      try {
        console.log("[Linking] URL received:", url);
        const parsed = Linking.parse(url);
        const path = parsed.path ?? "";
        const qp = parsed.queryParams ?? {} as Record<string, unknown>;

        if (path?.includes("strava-callback")) {
          const code = (qp.code as string) ?? "";
          if (code) {
            console.log("Strava auth code received", code);
            router.replace("/(tabs)/profile/devices");
          }
          return;
        }
        if (path?.includes("oura-callback")) {
          const code = (qp.code as string) ?? "";
          if (code) {
            console.log("Oura auth code received", code);
            router.replace("/(tabs)/profile/devices");
          }
          return;
        }
        if (path?.includes("fitbit-callback")) {
          const code = (qp.code as string) ?? "";
          if (code) {
            console.log("Fitbit auth code received", code);
            router.replace("/(tabs)/profile/devices");
          }
          return;
        }
        if (path?.includes("whoop-callback")) {
          const code = (qp.code as string) ?? "";
          if (code) {
            const ok = await whoopService.handleCallback(code);
            console.log("WHOOP callback handled:", ok);
            router.replace("/(tabs)/profile/devices");
          }
          return;
        }
        if (path?.includes("garmin-callback")) {
          const oauthToken = (qp.oauth_token as string) ?? "";
          const oauthVerifier = (qp.oauth_verifier as string) ?? "";
          if (oauthToken && oauthVerifier) {
            const ok = await garminService.handleCallback(oauthToken, oauthVerifier);
            console.log("Garmin callback handled:", ok);
            router.replace("/(tabs)/profile/devices");
          }
          return;
        }
      } catch (e) {
        console.log("[Linking] Error handling URL:", e);
      }
    };

    const sub = Linking.addEventListener("url", onUrl);

    const checkInitial = async () => {
      if (hasHandledInitial.current) return;
      hasHandledInitial.current = true;
      const initial = await Linking.getInitialURL();
      if (initial) {
        await onUrl({ url: initial });
      }
    };
    checkInitial();

    return () => {
      sub.remove();
    };
  }, [router]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserProfileProvider>
          <HealthDevicesProvider>
            <AIConsentProvider>
              <GestureHandlerRootView>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </AIConsentProvider>
          </HealthDevicesProvider>
        </UserProfileProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
