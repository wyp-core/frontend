import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateSelector from "../../ui/DateSelector";
import { validateDuration } from "@/constants/ValidateAddJobForm";

type Props = {
  hasDeadline: boolean;
  deadline: Date | null;
  duration: string;
  durationUnit: string;
  errors: { [key: string]: string };
  dispatch: React.Dispatch<any>;
};

const StepThree = ({
  hasDeadline,
  deadline,
  duration,
  durationUnit,
  errors,
  dispatch,
}: Props) => {
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const error = useThemeColor({}, "error");

  const headingAnim = useRef(new Animated.Value(0)).current;
  const subHeadingAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [openDur, setOpenDur] = useState(false);

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

  const handleDateChange = (selectedDate: Date) => {
    dispatch({ type: "SET_FIELD", field: "deadline", value: selectedDate });
    dispatch({ type: "SET_FIELD", field: "hasDeadline", value: true });
    setIsDatePickerVisible(false);
  };

  return (
    <View>
      <Animated.Text
        style={[
          styles.heading,
          { color: text },
          createTranslateStyle(headingAnim),
        ]}
      >
        Set duration
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subHeading,
          { color: secondary },
          createTranslateStyle(subHeadingAnim),
        ]}
      >
        Let others know how long this job will take, and whether there's a
        deadline.
      </Animated.Text>

      <Animated.View style={createTranslateStyle(inputAnim)}>
        {errors.duration && (
          <Text style={[styles.error, { color: error }]}>
            {errors.duration}
          </Text>
        )}
        <View style={styles.row}>
          <View
            style={[
              styles.flexInput,
              {
                borderColor: errors.duration ? error : text,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="3"
              placeholderTextColor={secondary}
              keyboardType="numeric"
              value={duration}
              onChangeText={(val) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "duration",
                  value: val,
                });

                const error = validateDuration(val);
                if (error) {
                  dispatch({
                    type: "SET_ERROR",
                    field: "duration",
                    message: error,
                  });
                } else {
                  dispatch({ type: "CLEAR_ERROR", field: "duration" });
                }
              }}
              selectionColor={text}
            />
          </View>

          <View style={styles.flexPicker}>
            <DropDownPicker
              open={openDur}
              value={durationUnit}
              items={[
                { label: "Hours", value: "hours" },
                { label: "Days", value: "days" },
                { label: "Weeks", value: "weeks" },
                { label: "Months", value: "months" },
              ]}
              setOpen={setOpenDur}
              setValue={(callback) => {
                const unit = callback(durationUnit);
                dispatch({
                  type: "SET_FIELD",
                  field: "durationUnit",
                  value: unit,
                });
              }}
              style={{
                backgroundColor: "transparent",
                borderColor: "black",
                zIndex: 5000,
              }}
              dropDownContainerStyle={{
                borderColor: "#ccc",
                zIndex: 4000,
              }}
              textStyle={{
                fontSize: 14,
                fontFamily: "Montserrat_500Medium",
              }}
              listItemLabelStyle={{
                fontFamily: "Montserrat_400Regular",
              }}
              placeholder="Select unit"
              containerStyle={{ height: 48 }}
              autoScroll={true}
              mode="BADGE"
            />
          </View>
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: text }]}>
            Has a deadline?
          </Text>
          <Switch
            value={hasDeadline}
            onValueChange={(value) => {
              dispatch({ type: "SET_FIELD", field: "hasDeadline", value });
              if (!value) {
                dispatch({
                  type: "SET_FIELD",
                  field: "deadline",
                  value: null,
                });
              }
            }}
            thumbColor={hasDeadline ? text : "#ccc"}
            trackColor={{ true: secondary, false: "#ccc" }}
          />
        </View>

        {hasDeadline && (
          <TouchableOpacity
            onPress={() => setIsDatePickerVisible(true)}
            style={styles.deadlineButton}
          >
            <Text style={[styles.deadlineText, { color: text }]}>
              {deadline ? deadline.toDateString() : "Select a deadline"}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <DateSelector
        value={deadline || new Date()}
        maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
        minDate={new Date()}
        onDateChange={handleDateChange}
        onClose={() => setIsDatePickerVisible(false)}
        visible={isDatePickerVisible}
      />
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
  input: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1000,
    gap: 10,
  },

  flexInput: {
    flex: 0.6,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 48,
  },

  flexPicker: {
    flex: 1,
    zIndex: 1000,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  deadlineButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: "#ccc",
    marginBottom: 24,
  },
  deadlineText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  error: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "Montserrat_400Regular",
  },
});

export default StepThree;
