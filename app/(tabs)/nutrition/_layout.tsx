import { Stack } from "expo-router";

export default function NutritionLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Nutrition Tracker",
          headerStyle: {
            backgroundColor: "#10b981",
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