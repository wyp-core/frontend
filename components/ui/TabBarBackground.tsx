import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View } from "react-native";

export function useBottomTabOverflow() {
  return 0;
}

export default function TabBarBackground() {
  const background = useThemeColor({}, "background");
  return <View style={{ flex: 1, backgroundColor: background }} />;
}
