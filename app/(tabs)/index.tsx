import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import ControlPanel from "@/components/business/ControlPanel";
import JobList from "@/components/business/JobList";
import LocationHeader from "@/components/business/LocationHeader";
import { LocationProvider } from "@/context/LocationContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  useEffect(() => {
    NavigationBar.setStyle(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme]);

  const background = useThemeColor({}, "background");
  const gradientStart = useThemeColor(
    { light: "#d4f7dc", dark: "#263a2e" },
    "background"
  );
  const gradientEnd = useThemeColor(
    { light: "#ffffff", dark: "#181c1f" },
    "background"
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.75 }}
      >
        <LocationProvider>
          <LocationHeader />
        </LocationProvider>
        <ControlPanel />
      </LinearGradient>

      <JobList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    paddingTop: 25,
  },
});
