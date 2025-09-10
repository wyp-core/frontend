import { useFetchOTP } from "@/hooks/user/useFetchOTP";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState({
    countryCode: "91",
    number: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const errorColor = useThemeColor({}, "error");

  const { mutateAsync: requestOTP, isPending } = useFetchOTP();

  const handleNext = async () => {
    if (mobileNumber.number.length !== 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setError("");

    try {
      const res = await requestOTP({
        phone: mobileNumber.number,
        countryCode: mobileNumber.countryCode,
      });

      if (res?.status === 200) {
        router.push({
          pathname: "/auth/OTPScreen",
          params: {
            number: mobileNumber.number,
            countryCode: mobileNumber.countryCode,
          },
        });
      } else {
        setError(res.error || "OTP request failed");
      }
    } catch (error: any) {
      setError(error.message || "OTP request failed");
      console.error("OTP request failed:", error);
    }
  };

  const mobileNumberChangeHandler = (text: string) => {
    setMobileNumber((prev) => ({
      ...prev,
      number: text.replace(/[^0-9]/g, ""),
    }));
    setError("");
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centeredContent}>
            <View style={[styles.logo, { backgroundColor: primary }]}>
              <Text style={styles.logoText}>WYP</Text>
            </View>
            <Text style={[styles.title, { color: primary }]}>
              Glad to see you here!
            </Text>
            <Text style={[styles.subtitle, { color: secondary }]}>
              Verify your mobile number to see what's next
            </Text>
          </View>

          <View>
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.countryCode,
                  { borderColor: border, color: text },
                ]}
              >
                +{mobileNumber.countryCode}
              </Text>
              <View
                style={[styles.mobileInputContainer, { borderColor: border }]}
              >
                <TextInput
                  style={[
                    styles.mobileInput,
                    { borderColor: border, color: text },
                  ]}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={secondary}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobileNumber.number}
                  onChangeText={mobileNumberChangeHandler}
                />
                {mobileNumber.number && (
                  <Pressable
                    style={[styles.crossIcon]}
                    onPress={() =>
                      setMobileNumber((prev) => ({ ...prev, number: "" }))
                    }
                  >
                    <FontAwesome name="close" size={14} color={primary} />
                  </Pressable>
                )}
              </View>
            </View>
            {error ? (
              <Text style={[styles.errorText, { color: errorColor }]}>
                {error}
              </Text>
            ) : null}
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor:
                    mobileNumber.number.length === 10 ? primary : border,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={handleNext}
              disabled={isPending}
            >
              <Text style={styles.buttonText}>Verify using OTP</Text>
              {isPending && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              )}
            </Pressable>
          </View>

          <Text style={[styles.termsText, { color: secondary }]}>
            By continuing, you agree to our{" "}
            <Text
              style={{ color: primary }}
              onPress={() => console.log("Terms")}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={{ color: primary }}
              onPress={() => console.log("Privacy")}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginVertical: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 24,
    fontFamily: "Montserrat_500Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
    gap: 5,
  },
  countryCode: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  mobileInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  mobileInput: {
    padding: 12,
    fontSize: 16,
    flex: 1,
    fontFamily: "Montserrat_500Medium",
  },
  crossIcon: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    fontFamily: "Montserrat_500Medium",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "Montserrat_500Medium",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Montserrat_500Medium",
  },
});

export default LoginScreen;
