import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

type ModeType = "remote" | "onsite" | "both";

export default function AddJobForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<ModeType>("both");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const handleUseCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let currentLoc = await Location.getCurrentPositionAsync({});
    const coords = currentLoc.coords;
    setLocation(
      `Lat: ${coords.latitude.toFixed(2)}, Lon: ${coords.longitude.toFixed(2)}`
    );
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDeadline(selectedDate);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Job title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (hasDeadline && !deadline)
      newErrors.deadline = "Deadline date is required";
    if (!budget.trim()) newErrors.budget = "Budget is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Form submitted successfully!");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.header, { color: text }]}>
        What's your{" "}
        <Text style={[styles.headerHighlight, { color: primary }]}>price</Text>{" "}
        to
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            marginBottom: 5,
            color: text,
            backgroundColor: background,
            borderColor: border,
          },
        ]}
        maxLength={50}
        placeholder="Short description (e.g., do my taxes?)"
        placeholderTextColor={secondary}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setErrors({ ...errors, title: "" });
        }}
      />
      <Text style={[styles.charCount, { color: secondary }]}>
        {title.length}/50
      </Text>
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}
      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          {
            marginBottom: 5,
            color: text,
            backgroundColor: background,
            borderColor: border,
          },
        ]}
        multiline
        maxLength={500}
        placeholder="Describe what needs to be done"
        placeholderTextColor={secondary}
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setErrors({ ...errors, description: "" });
        }}
      />
      <Text style={[styles.charCount, { color: secondary }]}>
        {description.length}/500
      </Text>
      {errors.description && (
        <Text style={styles.error}>{errors.description}</Text>
      )}
      <View style={styles.row}>
        <Text style={[styles.label, { fontWeight: "600", color: text }]}>
          Is there a deadline?
        </Text>
        <Switch
          value={hasDeadline}
          onValueChange={(val) => {
            setHasDeadline(val);
            if (!val) {
              setDeadline(null);
              setErrors({ ...errors, deadline: "" });
            }
          }}
          trackColor={{ true: primary, false: border }}
          thumbColor={text}
        />
      </View>
      {hasDeadline && (
        <>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.datePickerButton,
              { borderColor: border, backgroundColor: background },
            ]}
          >
            <MaterialIcons name="calendar-today" size={18} color={primary} />
            <Text style={[styles.dateText, { color: primary }]}>
              {" "}
              {deadline
                ? deadline.toLocaleDateString() +
                  " " +
                  deadline.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Pick a date & time"}
            </Text>
          </Pressable>
          {errors.deadline && (
            <Text style={styles.error}>{errors.deadline}</Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={deadline || new Date()}
              mode="datetime"
              display={"default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </>
      )}
      <View style={styles.optionsRow}>
        {["remote", "onsite", "both"].map((item) => (
          <Pressable
            key={item}
            style={[
              styles.optionButton,
              { borderColor: border, backgroundColor: background },
              mode === item && {
                borderColor: primary,
                backgroundColor: background,
              },
            ]}
            onPress={() => setMode(item as ModeType)}
          >
            {item === "onsite" ? (
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color={mode === item ? primary : text}
              />
            ) : (
              <MaterialIcons
                name={
                  item === "remote"
                    ? "wifi"
                    : item === "onsite"
                    ? "location-on"
                    : "public"
                }
                size={16}
                color={mode === item ? primary : text}
              />
            )}
            <Text
              style={[
                styles.optionText,
                { color: text },
                mode === item && { color: primary },
              ]}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.budgetRow}>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              color: text,
              backgroundColor: background,
              borderColor: border,
            },
          ]}
          keyboardType="numeric"
          placeholder="Estimated budget (e.g., 5000)"
          placeholderTextColor={secondary}
          value={budget}
          onChangeText={(text) => {
            setBudget(text);
            setErrors({ ...errors, budget: "" });
          }}
        />
        <Text style={[styles.inr, { color: primary }]}>INR</Text>
      </View>
      {errors.budget && <Text style={styles.error}>{errors.budget}</Text>}
      <TextInput
        style={[
          styles.input,
          { color: text, backgroundColor: background, borderColor: border },
        ]}
        placeholder="Estimated duration (e.g., 2 weeks)"
        placeholderTextColor={secondary}
        value={duration}
        onChangeText={(text) => {
          setDuration(text);
          setErrors({ ...errors, duration: "" });
        }}
      />
      {errors.duration && <Text style={styles.error}>{errors.duration}</Text>}
      <TextInput
        style={[
          styles.input,
          { color: text, backgroundColor: background, borderColor: border },
        ]}
        placeholder="Location or use current location"
        placeholderTextColor={secondary}
        value={location}
        onChangeText={(text) => {
          setLocation(text);
          setErrors({ ...errors, location: "" });
        }}
      />
      {errors.location && <Text style={styles.error}>{errors.location}</Text>}
      <Pressable
        onPress={handleUseCurrentLocation}
        style={styles.locationButton}
      >
        <MaterialCommunityIcons
          name="navigation-variant-outline"
          size={20}
          color={primary}
        />
        <Text style={[styles.useLocationText, { color: primary }]}>
          Use Current Location
        </Text>
      </Pressable>
      <Pressable
        style={[styles.submitButton, { backgroundColor: primary }]}
        onPress={handleSubmit}
      >
        <Text
          style={[
            styles.submitText,
            { color: background === "#1b1b1b" ? "#111" : "#fff" },
          ]}
        >
          Post Job
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    marginTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  headerHighlight: {},
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  dateText: {
    fontWeight: "600",
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    gap: 8,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 6,
    gap: 8,
  },
  optionSelected: {},
  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextSelected: {},
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  inr: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 24,
  },
  useLocationText: {
    fontSize: 15,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  submitText: {
    color: "#fff", // Will be overridden inline with theme color
    fontWeight: "700",
    fontSize: 17,
  },
});
