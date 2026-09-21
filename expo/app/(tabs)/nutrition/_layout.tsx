import { Stack } from "expo-router";
import { Palette } from '@/constants/theme';

export default function NutritionLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: Palette.canvas } }}>
      {/* The screen opens with the date and the day's numbers; a green bar with the
          words "Nutrition Tracker" above them was the old light system's header and
          said nothing the tab bar does not already say. */}
      <Stack.Screen name="index" options={{ headerShown: false, title: "Nutrition" }} />
    </Stack>
  );
}
