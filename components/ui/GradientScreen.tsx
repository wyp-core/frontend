import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";

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

  const navigation = useNavigation();
  const lastOffsetY = useRef(0);
  const currentVisibility = useRef<"shown" | "hidden">("shown");

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setStyle(colorScheme === "dark" ? "light" : "dark");
    }
  }, [colorScheme]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    console.log(y);
    const parent = navigation.getParent();

    if (y > lastOffsetY.current + 10 && currentVisibility.current === "shown") {
      parent?.setOptions({
        tabBarStyle: {
          transform: [{ translateY: 100 }],
          height: 0,
        },
      });
      currentVisibility.current = "hidden";
    } else if (
      y < lastOffsetY.current - 10 &&
      currentVisibility.current === "hidden"
    ) {
      parent?.setOptions({
        tabBarStyle: {
          transform: [{ translateY: 0 }],
          height: 60, // Your default height
        },
      });
      currentVisibility.current = "shown";
    }

    lastOffsetY.current = y;
  };

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
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {children}
        </ScrollView>
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
