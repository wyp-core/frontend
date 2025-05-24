import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";

export default function GradientScreen({
  children,
  style,
  ...props
}: ViewProps) {
  const colorScheme = useColorScheme() ?? "light";
  const background = useThemeColor({}, "background");
  const gradientStart = useThemeColor(
    { light: "#d4f7dc", dark: "#263a2e" },
    "background"
  );
  const gradientEnd = useThemeColor(
    { light: "#ffffff", dark: "#181c1f" },
    "background"
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setStyle(colorScheme === "dark" ? "light" : "dark");
    }
  }, [colorScheme]);

  return (
    <View
      style={[styles.container, { backgroundColor: background }, style]}
      {...props}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.15 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 15,
  },
});
