import { Stack } from "expo-router";
import { Palette } from '@/constants/theme';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: Palette.canvas } }}>
      {/* The screen draws its own greeting under the safe area; a bar on top of it
          would be a second header. */}
      <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
    </Stack>
  );
}
