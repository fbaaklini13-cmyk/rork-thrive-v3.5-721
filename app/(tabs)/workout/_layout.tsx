import { Stack } from "expo-router";
import { Colors } from '@/constants/colors';

export default function WorkoutLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Workout",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: "#fff",
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
            backgroundColor: Colors.primary,
          },
          headerTintColor: "#fff",
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
            backgroundColor: Colors.primary,
          },
          headerTintColor: "#fff",
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
            backgroundColor: Colors.primary,
          },
          headerTintColor: "#fff",
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
            backgroundColor: Colors.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
    </Stack>
  );
}