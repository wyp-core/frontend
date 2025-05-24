import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
      <Text style={[styles.header, { color: text }]}>
        What's your{" "}
        <Text style={[styles.headerHighlight, { color: primary }]}>price</Text>{" "}
        to
      </Text>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={[
            styles.input,
            { color: text, borderColor: border, marginBottom: 4 },
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
        <View style={styles.infoRow}>
          <Text style={[styles.charCount, { color: secondary }]}>
            {title.length}/50
          </Text>
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}
        </View>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            { color: text, borderColor: border, marginBottom: 4 },
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
        <View style={styles.infoRow}>
          <Text style={[styles.charCount, { color: secondary }]}>
            {description.length}/500
          </Text>
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}
        </View>

        {/* Deadline Toggle */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: text }]}>
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
                display="default"
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
                { borderColor: border },
                mode === item && {
                  borderColor: primary,
                  borderWidth: 1,
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
                  mode === item && {
                    color: primary,
                  },
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.budgetDurationRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: text }]}>
              Budget (INR)
            </Text>
            <TextInput
              style={[styles.input, { color: text, borderColor: border }]}
              keyboardType="numeric"
              placeholder="e.g., 5000"
              placeholderTextColor={secondary}
              value={budget}
              onChangeText={(text) => {
                setBudget(text);
                setErrors({ ...errors, budget: "" });
              }}
            />
            {errors.budget && <Text style={styles.error}>{errors.budget}</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.inputLabel, { color: text }]}>Duration</Text>
            <TextInput
              style={[styles.input, { color: text, borderColor: border }]}
              placeholder="e.g., 2 weeks"
              placeholderTextColor={secondary}
              value={duration}
              onChangeText={(text) => {
                setDuration(text);
                setErrors({ ...errors, duration: "" });
              }}
            />
            {errors.duration && (
              <Text style={styles.error}>{errors.duration}</Text>
            )}
          </View>
        </View>

        <View style={styles.locationRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 1, color: text, borderColor: border },
            ]}
            placeholder="Location"
            placeholderTextColor={secondary}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              setErrors({ ...errors, location: "" });
            }}
          />
          <Pressable
            onPress={handleUseCurrentLocation}
            style={[styles.locationButton]}
          >
            <MaterialCommunityIcons
              name="navigation-variant-outline"
              size={20}
              color={primary}
            />
          </Pressable>
        </View>
        {errors.location && <Text style={styles.error}>{errors.location}</Text>}

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: "800",
    padding: 24,
    paddingTop: 40,
  },
  headerHighlight: {
    fontWeight: "900",
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 4,
  },
  multilineInput: {
    height: 130,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
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
    marginBottom: 16,
    gap: 16,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    gap: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  inr: {
    fontSize: 14,
    fontWeight: "600",
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderRadius: 12,
  },
  useLocationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    fontWeight: "700",
    fontSize: 16,
  },
  rowLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  inputLabel: {
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
    textAlign: "left",
    marginBottom: 6,
    marginLeft: 2,
  },
  budgetDurationRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});
