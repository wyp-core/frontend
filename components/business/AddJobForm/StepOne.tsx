import { validateTitle } from "@/constants/ValidateAddJobForm";
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

type Props = {
  title: string;
  errors: { [key: string]: string };
  dispatch: React.Dispatch<any>;
};

const StepOne = ({ title, errors, dispatch }: Props) => {
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const error = useThemeColor({}, "error");

  const headingAnim = useRef(new Animated.Value(0)).current;
  const subHeadingAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;

  const prefix = "What's your price to ";

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
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.heading,
          { color: text },
          createTranslateStyle(headingAnim),
        ]}
      >
        Let’s start by giving your job a clear title
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subHeading,
          { color: secondary },
          createTranslateStyle(subHeadingAnim),
        ]}
      >
        It helps others quickly understand what you need — and you can update it
        anytime.
      </Animated.Text>

      <Animated.View style={createTranslateStyle(inputAnim)}>
        {errors.title && (
          <Text style={[styles.error, { color: error }]}>{errors.title}</Text>
        )}
        <View
          style={[
            styles.inputCard,
            { borderColor: errors.title ? error : text },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { color: title.length > 0 ? text : secondary },
            ]}
            value={prefix + title}
            onChangeText={(text) => {
              let userInput = text.slice(prefix.length);

              dispatch({ type: "SET_FIELD", field: "title", value: userInput });

              const error = validateTitle(userInput);
              if (error) {
                dispatch({
                  type: "SET_ERROR",
                  field: "title",
                  message: error,
                });
              } else {
                dispatch({ type: "CLEAR_ERROR", field: "title" });
              }
            }}
            multiline={true}
            textAlignVertical="top"
            selectionColor={text}
          />
        </View>

        {title.length + 5 >= 30 && (
          <Text style={styles.count}>
            <Text style={{ color: title.length > 30 ? error : text }}>
              {title.length}
            </Text>
            <Text style={{ color: text }}>/30</Text>
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
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
  inputCard: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  count: {
    fontSize: 13,
    marginBottom: 24,
    fontFamily: "Montserrat_400Regular",
  },
  input: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    height: 105,
  },
  error: {
    fontSize: 12,
    marginBottom: 8,
  },
  steps: {
    marginTop: 20,
    fontWeight: "700",
    fontSize: 13,
  },
});

export default StepOne;
