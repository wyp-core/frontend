import { validateDescription } from "@/constants/ValidateAddJobForm";
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
  description: string;
  errors: { [key: string]: string };
  dispatch: React.Dispatch<any>;
};

const StepTwo = ({ description, errors, dispatch }: Props) => {
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const error = useThemeColor({}, "error");

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
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.heading,
          { color: text },
          createTranslateStyle(headingAnim),
        ]}
      >
        Describe what you need done
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subHeading,
          { color: secondary },
          createTranslateStyle(subHeadingAnim),
        ]}
      >
        Be clear and specific so others can understand your goals. Minimum{" "}
        <Text
          style={{
            fontFamily: "Montserrat_500Medium",
            textDecorationLine: "underline",
          }}
        >
          50
        </Text>{" "}
        characters required.
      </Animated.Text>

      <Animated.View style={createTranslateStyle(inputAnim)}>
        {errors.description && (
          <Text style={[styles.error, { color: error }]}>
            {errors.description}
          </Text>
        )}
        <View
          style={[
            styles.inputCard,
            { borderColor: errors.description ? error : text },
          ]}
        >
          <TextInput
            style={[styles.input]}
            value={description}
            onChangeText={(text) => {
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: text,
              });

              const error = validateDescription(text);

              if (error) {
                dispatch({
                  type: "SET_ERROR",
                  field: "description",
                  message: error,
                });
              } else {
                dispatch({ type: "CLEAR_ERROR", field: "description" });
              }
            }}
            multiline={true}
            textAlignVertical="top"
            selectionColor={text}
          />
        </View>

        <Text style={styles.count}>
          <Text style={{ color: description.length > 150 ? error : text }}>
            {description.length}
          </Text>
          <Text style={{ color: text }}>/150</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
  },
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
    minHeight: 105,
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

export default StepTwo;
