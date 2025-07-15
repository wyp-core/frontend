import { validateBudget } from "@/constants/ValidateAddJobForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const StepFive = ({
  budget,
  errors,
  dispatch,
}: {
  budget: string;
  errors: { [key: string]: string };
  dispatch: React.Dispatch<any>;
}) => {
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const border = useThemeColor({}, "border");
  const errorColor = useThemeColor({}, "error");

  const headingAnim = useRef(new Animated.Value(0)).current;
  const subHeadingAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headingAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(subHeadingAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
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
        Finally, set a budget
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subHeading,
          { color: secondary },
          createTranslateStyle(subHeadingAnim),
        ]}
      >
        Specify the total budget you're willing to pay for this job.
      </Animated.Text>

      <Animated.View style={createTranslateStyle(inputAnim)}>
        <Text style={[styles.inputLabel, { color: text }]}>Budget</Text>

        <View
          style={[
            styles.budgetWrapper,
            { borderColor: errors.budget ? errorColor : text },
          ]}
        >
          <Text style={[styles.currency, { color: text }]}>INR</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={secondary}
            value={budget}
            onChangeText={(val) => {
              dispatch({
                type: "SET_FIELD",
                field: "budget",
                value: val,
              });

              const error = validateBudget(val);
              if (error) {
                dispatch({
                  type: "SET_ERROR",
                  field: "budget",
                  message: error,
                });
              } else {
                dispatch({ type: "CLEAR_ERROR", field: "budget" });
              }
            }}
            style={[styles.budgetInput, { color: text }]}
          />
        </View>
        {errors.budget && (
          <Text style={[styles.error, { color: errorColor }]}>
            {errors.budget}
          </Text>
        )}
      </Animated.View>
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
  inputLabel: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 8,
  },
  budgetWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  currency: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginRight: 8,
    flexShrink: 0,
  },
  budgetInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    padding: 0,
    marginLeft: 20,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Montserrat_400Regular",
  },
});

export default StepFive;
