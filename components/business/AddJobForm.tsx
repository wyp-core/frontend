import DurationPickerModal from "@/components/ui/DurationPickerModal";
import { LocationType, useLocation } from "@/context/LocationContext";

import { useAddJob } from "@/hooks/jobApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ConfirmationModal from "../ui/ConfirmationModal";
import DateSelector from "../ui/DateSelector";
import Geolocation from "./Geolocation";

type ModeType = "remote" | "onsite" | "both";

export default function AddJobForm() {
  const { selectedLocation } = useLocation();
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [mode, setMode] = useState<ModeType>("both");
  const [budget, setBudget] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [location, setLocation] = useState<LocationType | null>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedDurationUnit, setSelectedDurationUnit] = useState("days");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showGeolocationModal, setShowGeolocationModal] = useState(false);

  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const error = useThemeColor({}, "error");

  const { mutate: addJob, isPending } = useAddJob();
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setHasDeadline(false);
    setDeadline(new Date());
    setMode("both");
    setBudget("");
    setDurationValue("");
    setErrors({});
  };

  const confirmHandler = () => {
    setShowConfirmationModal(false);
  };
  const cancelHandler = () => {
    setShowConfirmationModal(false);
    navigation.navigate("index");
  };

  const handleDateChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
    setErrors({ ...errors, deadline: "" });
    setHasDeadline(true);
  };

  const handleToggleDeadline = (val: boolean) => {
    if (val) {
      setIsDatePickerVisible(true);
    } else {
      setHasDeadline(false);
      setErrors({ ...errors, deadline: "" });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Job title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (hasDeadline && !deadline)
      newErrors.deadline = "Deadline date is required";
    if (!budget.trim()) newErrors.budget = "Budget is required";
    if (!durationValue.trim()) newErrors.duration = "Duration is required";
    if (!location) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const duration = `${durationValue} ${selectedDurationUnit}`;
      const payload = {
        createdBy: "b27c70a3-4575-4ed5-a52e-1ee9d07dbc4b",
        title,
        description,
        lat: location?.lat,
        lng: location?.lng,
        price: parseFloat(budget),
        category: "Web Development",
        mode: mode.toLowerCase(),
        duration,
      };

      if (hasDeadline) {
        payload.deadline = deadline;
      }

      addJob(payload, {
        onSuccess: () => {
          resetForm();
          setShowConfirmationModal(true);
        },
        onError: () => {
          Alert.alert(
            "Error",
            "Could not save the job. Please try again later.",
            [{ text: "OK" }]
          );
        },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      resetForm();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setLocation(selectedLocation);
  }, [selectedLocation]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={"height"}
      keyboardVerticalOffset={0}
    >
      <Text style={[styles.header, { color: text }]}>
        What's your{" "}
        <Text style={[styles.headerHighlight, { color: primary }]}>price</Text>{" "}
        to
      </Text>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { flexGrow: 1, justifyContent: "space-between" },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View>
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
            {errors.title && <Text style={styles.error}>{errors.title}</Text>}
            <Text
              style={[
                styles.charCount,
                { color: title.length >= 45 ? "red" : secondary },
              ]}
            >
              {title.length}/50
            </Text>
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
            {errors.description && (
              <Text style={styles.error}>{errors.description}</Text>
            )}
            <Text
              style={[
                styles.charCount,
                { color: description.length >= 495 ? error : secondary },
              ]}
            >
              {description.length}/500
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: text }]}>
              {hasDeadline && deadline
                ? `Deadline: ${deadline.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`
                : "Is there a deadline?"}
            </Text>
            <Switch
              value={hasDeadline}
              onValueChange={handleToggleDeadline}
              trackColor={{ true: primary, false: border }}
              thumbColor={"#f4f4f4"}
            />
          </View>

          <DateSelector
            value={deadline}
            maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
            minDate={new Date()}
            onDateChange={(date: Date) => handleDateChange(date)}
            onClose={() => setIsDatePickerVisible(false)}
            visible={isDatePickerVisible}
          />

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
            <View style={{ flex: 1, flexDirection: "column" }}>
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
            </View>
            <View style={{ flex: 1, flexDirection: "column", marginLeft: 12 }}>
              <Text style={[styles.inputLabel, { color: text }]}>Duration</Text>
              <View style={styles.durationRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.durationInput,
                    { color: text, borderColor: border },
                  ]}
                  keyboardType="numeric"
                  placeholder="2"
                  placeholderTextColor={secondary}
                  value={durationValue}
                  onChangeText={(text) => {
                    setDurationValue(text);
                    setErrors({ ...errors, duration: "" });
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    styles.durationSelector,
                    { borderColor: border },
                  ]}
                  onPress={() => setShowDurationModal(true)}
                >
                  <Text style={[styles.dropdownText, { color: text }]}>
                    {selectedDurationUnit}
                  </Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={20}
                    color={secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.budgetDurationRow}>
            <View style={{ flex: 1 }}>
              {errors.budget && (
                <Text style={styles.error}>{errors.budget}</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              {errors.duration && (
                <Text style={styles.error}>{errors.duration}</Text>
              )}
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: text, marginTop: 4 }]}>
            Location
          </Text>
          <View style={styles.locationRow}>
            <Pressable
              style={[
                styles.input,
                {
                  borderColor: border,
                  paddingVertical: 12,
                  width: "100%",
                },
              ]}
              onPress={() => {
                setShowGeolocationModal(true);
                setErrors({ ...errors, location: "" });
              }}
            >
              <Text
                style={{
                  color: text,
                  flex: 1,
                  fontSize: 14,
                  overflow: "hidden",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {location?.address || "Select location"}
              </Text>
            </Pressable>
          </View>
          {errors.location && (
            <Text style={styles.error}>{errors.location}</Text>
          )}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text style={[styles.submitText, { color: "#fff", opacity: 1 }]}>
            Post Job
          </Text>
          {isPending && <ActivityIndicator size="small" color="#fff" />}
        </Pressable>
      </ScrollView>

      <DurationPickerModal
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        selectedUnit={selectedDurationUnit}
        onSelect={(unit) => {
          setSelectedDurationUnit(unit);
          setShowDurationModal(false);
        }}
      />
      <ConfirmationModal
        visible={showConfirmationModal}
        message={
          "Your job has been successfully posted and will be live shortly!"
        }
        title={"Job Posted Successfully"}
        onConfirm={confirmHandler}
        onCancel={cancelHandler}
        confirmButtonText="Create new"
        cancelButtonText="Return to home"
      />

      <Geolocation
        visible={showGeolocationModal}
        onClose={() => setShowGeolocationModal(false)}
      />
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
    paddingBottom: 16,
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
    flex: 1,
    textAlignVertical: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 10,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
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
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  submitText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
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
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dropdownText: {
    fontSize: 13,
    textAlign: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 12,
  },
  durationInput: {
    width: "40%",
    height: 40,
    marginRight: 8,
    textAlign: "center",
  },
  durationSelector: {
    flex: 1,
    height: 40,
    justifyContent: "center",
  },
  errorBorder: {
    borderColor: "red",
  },
});
