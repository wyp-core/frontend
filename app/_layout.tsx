import AppGate from "@/components/ui/AppGate";
import GradientScreen from "@/components/ui/GradientScreen";
import { LocationProvider } from "@/context/LocationContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Roboto_400Regular,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const [isNew, setIsNew] = useState(false);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LocationProvider>
          <AppGate>
            <View style={StyleSheet.absoluteFill}>
              <GradientScreen />
            </View>

            <Stack
              initialRouteName={isNew ? "auth/LoginScreen" : "(tabs)"}
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                animation: "fade",
              }}
            >
              <Stack.Screen name="auth/LoginScreen" />
              <Stack.Screen name="auth/OTPScreen" />
              <Stack.Screen name="auth/UserDetailsScreen" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AppGate>
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
