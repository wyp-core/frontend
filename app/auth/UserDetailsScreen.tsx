import DateSelector from "@/components/ui/DateSelector";
import OptionButton from "@/components/ui/OptionButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";

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
  const router = useRouter();

  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const errorColor = useThemeColor({}, "error");

  const genderOptions: GenderOption[] = [
    { label: "Male", icon: "male" },
    { label: "Female", icon: "female" },
    { label: "Others", icon: "transgender" },
  ];

  // Animation refs
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const nameInputAnim = useRef(new Animated.Value(0)).current;
  const dobAnim = useRef(new Animated.Value(0)).current;
  const genderAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nameInputAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dobAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(genderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
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

  const handleSubmit = () => {
    if (formData.name && formData.dob && formData.gender) {
      router.push({ pathname: "/(tabs)" });
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
    <ScrollView contentContainerStyle={styles.scroll}>
      <Animated.Text
        style={[
          styles.title,
          { color: primary },
          createTranslateStyle(titleAnim),
        ]}
      >
        Complete Your Profile
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          { color: secondary },
          createTranslateStyle(subtitleAnim),
        ]}
      >
        Well done. You have successfully registered. Now, please complete your
        profile.
      </Animated.Text>

      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor: border },
          createTranslateStyle(nameInputAnim),
        ]}
      >
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder="Enter Name"
          placeholderTextColor={secondary}
          value={formData.name}
          onChangeText={(value) => handleFormInputChange("name", value)}
          cursorColor={primary}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor: border, paddingLeft: 18 },
          createTranslateStyle(dobAnim),
        ]}
      >
        <Pressable onPress={() => setShowDatePicker(true)} style={{ flex: 1 }}>
          <Text
            style={{
              color: formData.dob ? text : secondary,
              fontSize: 14,
              fontFamily: "Montserrat_400Regular",
            }}
          >
            {formData.dob
              ? new Date(formData.dob).toLocaleDateString()
              : "Select Date of Birth"}
          </Text>
        </Pressable>
      </Animated.View>

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

      <Animated.View
        style={[
          styles.genderContainer,
          { borderColor: border },
          createTranslateStyle(genderAnim),
        ]}
      >
        {genderOptions.map(({ label, icon }) => (
          <OptionButton
            key={label}
            item={label}
            selected={formData.gender === label}
            iconName={icon}
            onPress={(val) => handleFormInputChange("gender", val)}
          />
        ))}
      </Animated.View>

      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}

      <Animated.View style={createTranslateStyle(buttonAnim)}>
        <Pressable
          style={[styles.button, { backgroundColor: primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Submit</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 100,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    gap: 12,
  },
  errorText: {
    fontSize: 12,
    paddingLeft: 4,
    fontFamily: "Montserrat_400Regular",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
  },
});
