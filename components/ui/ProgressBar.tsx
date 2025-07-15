import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

type Props = {
  currentStep: number;
  totalSteps?: number;
};

const ProgressBar = ({ currentStep, totalSteps = 3 }: Props) => {
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "background");
  const theme = useThemeColor({}, "theme");

  const progress = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 24 * 2;
  const circleSize = 16;
  const numberOfLines = totalSteps - 1;

  const totalCircleWidth = totalSteps * circleSize;
  const availableLineSpace = screenWidth - horizontalPadding - totalCircleWidth;
  const lineWidth = availableLineSpace / numberOfLines;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentStep - 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = currentStep > index + 1;
        const isCurrent = currentStep === index + 1;

        const animatedLineWidth = progress.interpolate({
          inputRange: [index, index + 1],
          outputRange: [0, lineWidth],
          extrapolate: "clamp",
        });

        return (
          <View style={styles.stepContainer} key={index}>
            <View
              style={[
                styles.circle,
                {
                  borderColor: isCurrent || isCompleted ? primary : border,
                  backgroundColor: isCompleted ? primary : background,
                },
              ]}
            >
              {isCompleted && (
                <MaterialIcons
                  name="check"
                  size={12}
                  style={{
                    color: theme === "dark" ? "black" : "white",
                  }}
                />
              )}
            </View>

            {index + 1 !== totalSteps && (
              <View
                style={{
                  width: lineWidth,
                  height: 2,
                  backgroundColor: border,
                  overflow: "hidden",
                }}
              >
                <Animated.View
                  style={{
                    height: 2,
                    backgroundColor: primary,
                    width: animatedLineWidth,
                  }}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    width: "100%",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProgressBar;
