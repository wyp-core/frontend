import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

import AddJobForm from "@/components/business/AddJobForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StatusBar } from "expo-status-bar";

export default function Create() {
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
        end={{ x: 0, y: 0.25 }}
      >
        <AddJobForm />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  gradient: {
    paddingTop: 25,
  },
});
