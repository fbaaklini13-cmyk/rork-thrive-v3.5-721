import { Stack } from "expo-router";
import { Palette, Type } from '@/constants/theme';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: Palette.canvas },
        headerStyle: { backgroundColor: Palette.canvas },
        headerTintColor: Palette.ink,
        headerTitleStyle: { ...Type.heading, color: Palette.ink },
        headerShadowVisible: false,
      }}
    >
      {/* index draws its own header: avatar, name, age. Sub-screens keep a bar so
          there is something to go back from, on the canvas rather than on #333. */}
      <Stack.Screen name="index" options={{ headerShown: false, title: "Profile" }} />
      <Stack.Screen name="devices" options={{ title: "Connected Devices" }} />
    </Stack>
  );
}
