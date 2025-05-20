import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Platform,
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
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>
        What's your <Text style={styles.headerHighlight}>price</Text> to
      </Text>

      <TextInput
        style={[styles.input, { marginBottom: 5 }]}
        maxLength={50}
        placeholder="Short description (e.g.,                                                                                                  do my taxes?)"
        placeholderTextColor="#888"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setErrors({ ...errors, title: "" });
        }}
      />
      <Text style={styles.charCount}>{title.length}/50</Text>
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}

      <TextInput
        style={[styles.input, styles.multilineInput, { marginBottom: 5 }]}
        multiline
        maxLength={500}
        placeholder="Describe what needs to be done"
        placeholderTextColor="#888"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setErrors({ ...errors, description: "" });
        }}
      />
      <Text style={styles.charCount}>{description.length}/500</Text>
      {errors.description && (
        <Text style={styles.error}>{errors.description}</Text>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { fontWeight: "600" }]}>
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
          trackColor={{ true: "#5CB338", false: "#ccc" }}
          thumbColor="#fff"
        />
      </View>

      {hasDeadline && (
        <>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <FontAwesome name="calendar-o" size={18} color="#5CB338" />
            <Text style={styles.dateText}>
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
              display={Platform.OS === "ios" ? "inline" : "default"}
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
              mode === item && styles.optionSelected,
            ]}
            onPress={() => setMode(item as ModeType)}
          >
            <FontAwesome6
              name={
                item === "remote"
                  ? "wifi"
                  : item === "onsite"
                  ? "location-dot"
                  : "globe"
              }
              size={13}
              color={mode === item ? "#5CB338" : "#555"}
            />
            <Text
              style={[
                styles.optionText,
                mode === item && styles.optionTextSelected,
              ]}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.budgetRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          keyboardType="numeric"
          placeholder="Estimated budget (e.g., 5000)"
          placeholderTextColor="#888"
          value={budget}
          onChangeText={(text) => {
            setBudget(text);
            setErrors({ ...errors, budget: "" });
          }}
        />
        <Text style={styles.inr}>INR</Text>
      </View>
      {errors.budget && <Text style={styles.error}>{errors.budget}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Estimated duration (e.g., 2 weeks)"
        placeholderTextColor="#888"
        value={duration}
        onChangeText={(text) => {
          setDuration(text);
          setErrors({ ...errors, duration: "" });
        }}
      />
      {errors.duration && <Text style={styles.error}>{errors.duration}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Location or use current location"
        placeholderTextColor="#888"
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
        <FontAwesome name="location-arrow" size={16} color="#5CB338" />
        <Text style={styles.useLocationText}>Use Current Location</Text>
      </Pressable>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Post Job</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
    color: "#000",
  },
  headerHighlight: {
    color: "#5CB338",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fefefe",
    marginBottom: 12,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#888",
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
    color: "#000",
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
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  dateText: {
    color: "#5CB338",
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
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
    gap: 8,
  },
  optionSelected: {
    borderColor: "#5CB338",
    backgroundColor: "#eaf8e8",
  },
  optionText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#5CB338",
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  inr: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5CB338",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 24,
  },
  useLocationText: {
    color: "#5CB338",
    fontSize: 15,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: "#5CB338",
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
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
