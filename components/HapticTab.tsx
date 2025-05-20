import * as Haptics from "expo-haptics";
import React from "react";
import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

interface HapticTabProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

export function HapticTab({ children, onPress }: HapticTabProps) {
  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) onPress(event);
  };

  if (Platform.OS === "android") {
    return (
      <View style={styles.flexWrapper}>
        <TouchableNativeFeedback
          onPress={handlePress}
          background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.05)", true)}
          useForeground={true}
        >
          <View style={styles.circularInner}>{children}</View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.flexWrapper}
    >
      <View style={styles.circularInner}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flexWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circularInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
