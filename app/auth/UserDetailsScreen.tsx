import DateSelector from "@/components/ui/DateSelector";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useDefaultStyles } from "react-native-ui-datepicker";

type Gender = "Male" | "Female" | "Others";
type GenderOption = {
  label: Gender;
  icon: keyof typeof MaterialIcons.glyphMap;
};
type UserFormData = {
  name: string;
  dob: Date | null;
  gender: Gender | null;
};

export default function UserDetailsScreen() {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    dob: null,
    gender: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");
  const defaultStyles = useDefaultStyles();
  const router = useRouter();

  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const errorColor = useThemeColor({}, "error");
  const theme = useThemeColor({}, "theme");

  const genderOptions: GenderOption[] = [
    { label: "Male", icon: "male" },
    { label: "Female", icon: "female" },
    { label: "Others", icon: "transgender" },
  ];

  const handleSubmit = () => {
    if (formData.name && formData.dob && formData.gender) {
      router.push({
        pathname: "/(tabs)",
      });
    } else {
      setError("Please fill all the fields");
    }
  };

  const handleFormInputChange = (
    field: "name" | "dob" | "gender",
    value: string | Date
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { color: primary }]}>
        Complete Your Profile
      </Text>
      <Text style={[styles.subtitle, { color: secondary }]}>
        Well done. You have successfully registered. Now, please complete your
        profile.
      </Text>

      <View style={[styles.inputContainer, { borderColor: border }]}>
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder="Enter Name"
          placeholderTextColor={secondary}
          value={formData.name}
          onChangeText={(value) => handleFormInputChange("name", value)}
          cursorColor={primary}
        />
      </View>

      <Pressable
        style={[
          styles.inputContainer,
          {
            borderColor: border,
            paddingLeft: 18,
          },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: formData.dob ? text : secondary, fontSize: 16 }}>
          {formData.dob
            ? new Date(formData.dob).toLocaleDateString()
            : "Select Date of Birth"}
        </Text>
      </Pressable>

      <DateSelector
        value={
          formData.dob || new Date().setFullYear(new Date().getFullYear() - 18)
        }
        maxDate={new Date().setFullYear(new Date().getFullYear() - 18)}
        minDate={new Date().setFullYear(new Date().getFullYear() - 100)}
        onDateChange={(date: Date) => {
          handleFormInputChange("dob", date);
          setShowDatePicker(false);
        }}
        onClose={() => setShowDatePicker(false)}
        visible={showDatePicker}
      />

      <View style={[styles.genderContainer, { borderColor: border }]}>
        {genderOptions.map(({ label, icon }) => (
          <Pressable
            key={label}
            style={[
              styles.genderTab,
              {
                borderColor: formData.gender === label ? primary : border,
              },
            ]}
            onPress={() => handleFormInputChange("gender", label)}
          >
            <MaterialIcons
              name={icon}
              color={formData.gender === label ? primary : text}
              size={18}
            />
            <Text
              style={[
                styles.genderText,
                { color: formData.gender === label ? primary : text },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View>
        {error && (
          <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
        )}
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: primary }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    flexDirection: "column",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 56,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  picker: {
    flex: 1,
    fontSize: 16,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    gap: 12,
  },
  genderTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
  },
  genderText: {
    marginLeft: 8,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    paddingLeft: 4,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
