import { Stack } from "expo-router";
import { Palette } from '@/constants/theme';

export default function WorkoutLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Workout",
          headerStyle: {
            backgroundColor: Palette.canvas,
          },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
      <Stack.Screen 
        name="programs" 
        options={{ 
          title: "Training Programs",
          headerStyle: {
            backgroundColor: Palette.canvas,
          },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
      <Stack.Screen 
        name="exercises" 
        options={{ 
          title: "Exercises",
          headerStyle: {
            backgroundColor: Palette.canvas,
          },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
      <Stack.Screen 
        name="exercise-detail" 
        options={{ 
          title: "Exercise Details",
          headerStyle: {
            backgroundColor: Palette.canvas,
          },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
      <Stack.Screen 
        name="progress" 
        options={{ 
          title: "Progress",
          headerStyle: {
            backgroundColor: Palette.canvas,
          },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
      <Stack.Screen 
        name="exercise-library" 
        options={{ 
          title: "Exercise Library",
          headerStyle: {
            backgroundColor: Palette.canvas,
          },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
    </Stack>
  );
}