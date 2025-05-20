import React from "react";
import { View } from "react-native";

export function useBottomTabOverflow() {
  return 0;
}

export default function TabBarBackground() {
  return <View style={{ flex: 1, backgroundColor: "white" }} />;
}
