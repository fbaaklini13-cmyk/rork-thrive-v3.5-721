import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Palette, Space, Type } from "@/constants/theme";

// 25 Sep: the last light screen in the app (white header, blue link). Reached by any
// dead deep link, e.g. /premium, which has child routes but no index.
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Not found",
          headerStyle: { backgroundColor: Palette.canvas },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn&apos;t exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to the home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Space.xl,
    backgroundColor: Palette.canvas,
  },
  title: {
    ...Type.heading,
    color: Palette.ink,
  },
  link: {
    marginTop: Space.lg,
    paddingVertical: Space.lg,
  },
  linkText: {
    ...Type.bodyStrong,
    color: Palette.accent,
  },
});
