import { useThemeColor } from "@/hooks/useThemeColor";
import { ModeType } from "@/types/job";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ModeOption = {
  key: ModeType;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const modeOptions: ModeOption[] = [
  {
    key: "remote",
    icon: "laptop-outline",
    title: "Remote",
    description:
      "Work entirely online, no need to be physically present at any location.",
  },
  {
    key: "onsite",
    icon: "business-outline",
    title: "Onsite",
    description:
      "Requires full physical presence at the job location during working hours.",
  },
  {
    key: "hybrid",
    icon: "swap-horizontal-outline",
    title: "Hybrid",
    description:
      "Mix of remote and onsite work, depending on the task or schedule.",
  },
];

const StepFour = ({
  mode,
  location,
  errors,
  dispatch,
  setShowGeolocationModal,
}: {
  mode: ModeType;
  location: { lat: number; lon: number; address?: string } | null;
  errors: { [key: string]: string };
  dispatch: React.Dispatch<any>;
  setShowGeolocationModal: (val: boolean) => void;
}) => {
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const border = useThemeColor({}, "border");

  const headingAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const locationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headingAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(optionsAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(locationAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const createTranslateStyle = (anim: Animated.Value) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
    opacity: anim,
  });

  return (
    <View>
      <Animated.Text
        style={[
          styles.heading,
          { color: text },
          createTranslateStyle(headingAnim),
        ]}
      >
        Work preferences
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subHeading,
          { color: secondary },
          createTranslateStyle(headingAnim),
        ]}
      >
        Choose how this job will be carried out and where.
      </Animated.Text>

      <Animated.View
        style={[styles.optionsWrapper, createTranslateStyle(optionsAnim)]}
      >
        {modeOptions.map(({ key, icon, title, description }) => {
          const isSelected = mode === key;
          return (
            <Pressable
              key={key}
              onPress={() =>
                dispatch({ type: "SET_FIELD", field: "mode", value: key })
              }
              style={[
                styles.optionContainer,
                {
                  borderColor: isSelected ? text : border,
                  backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                },
              ]}
            >
              <View style={styles.iconTitleRow}>
                <Ionicons name={icon} size={20} color={text} />
                <Text style={[styles.optionTitle, { color: text }]}>
                  {title}
                </Text>
              </View>
              <Text style={[styles.optionDescription, { color: secondary }]}>
                {description}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {mode !== "remote" && (
        <Animated.View style={createTranslateStyle(locationAnim)}>
          <Text style={[styles.inputLabel, { color: text, marginTop: 24 }]}>
            Location
          </Text>
          <Pressable
            style={[styles.locationInput, { borderColor: border }]}
            onPress={() => {
              setShowGeolocationModal(true);
            }}
          >
            <Text
              style={{
                color: text,
                fontSize: 14,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {location?.address || "Select location"}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    marginBottom: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
  subHeading: {
    fontSize: 13,
    marginBottom: 18,
    fontFamily: "Montserrat_400Regular",
  },
  optionsWrapper: {
    gap: 12,
    marginBottom: 20,
  },
  optionContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 8,
  },
  locationInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Montserrat_400Regular",
  },
});

export default StepFour;
