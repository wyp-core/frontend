import { requestOTP, verifyOTP } from "@/api/user";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPScreen() {
  const { number, countryCode } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const hiddenInputRef = useRef<TextInput | null>(null);

  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const errorColor = useThemeColor({}, "error");

  // Animation Refs
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

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (otp: string) => {
    if (otp.length !== 4) return;

    setError("");
    setLoading(true);

    try {
      const res = await verifyOTP({
        phone: number as string,
        countryCode: countryCode as string,
        otp: Number(otp) as number,
      });

      if (res?.status === 200 && res.data.data === "matched") {
        router.push({
          pathname: "/auth/UserDetailsScreen",
          params: {
            number: number,
            countryCode: countryCode,
            status: "VERIFIED",
          },
        });
      } else {
        setError("Incorrect OTP");
      }
    } catch (error: any) {
      setError(error.message || "Maximum attempts reached");
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = () => {
    router.back();
  };

  const handleOtpChange = (value: string) => {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 4);
    setOtp(clean);
    setError("");
    if (clean.length === 4) {
      handleVerify(clean);
    }
  };

  const handleResendOtp = async () => {
    setOtp("");
    setTimer(30);
    setError("");

    try {
      const res = await requestOTP({
        phone: number as string,
        countryCode: countryCode as string,
      });

      if (res?.status !== 200) {
        setError(res?.error || "Failed to resend OTP");
      }
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP");
      console.error("Resend OTP error:", error);
    }
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          { color: primary },
          createTranslateStyle(headingAnim),
        ]}
      >
        Enter OTP
      </Animated.Text>

      <Animated.View
        style={[
          styles.verificationMessageContainer,
          createTranslateStyle(subHeadingAnim),
        ]}
      >
        <Text style={[styles.subtitle, { color: secondary }]}>
          sent to {countryCode} {number}
        </Text>
        <Text
          style={[styles.changeMobile, { color: primary }]}
          onPress={handleChange}
        >
          Change
        </Text>
      </Animated.View>

      <Animated.View style={createTranslateStyle(inputAnim)}>
        <TouchableOpacity onPress={focusHiddenInput} activeOpacity={1}>
          <View style={styles.otpRow}>
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3].map((index) => (
                <Pressable
                  key={index}
                  onPress={focusHiddenInput}
                  style={[
                    styles.otpBox,
                    {
                      borderColor: otp.length >= index ? text : border,
                    },
                  ]}
                >
                  <Text style={[styles.otpText, { color: text }]}>
                    {otp[index] || ""}
                  </Text>
                </Pressable>
              ))}
            </View>
            {loading && (
              <ActivityIndicator
                size="small"
                color={primary}
                style={{ marginLeft: 10 }}
              />
            )}
          </View>
          {error ? (
            <Text style={[styles.errorText, { color: errorColor }]}>
              {error}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TextInput
          ref={hiddenInputRef}
          style={{ height: 0, width: 0, opacity: 0 }}
          keyboardType="number-pad"
          value={otp}
          onChangeText={handleOtpChange}
          autoFocus
        />

        <View style={styles.resend}>
          <Text style={[styles.timerText, { color: text }]}>
            Didn't get the OTP?
          </Text>
          {timer > 0 ? (
            <Text style={[styles.timerText, { color: secondary }]}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <Text
              onPress={handleResendOtp}
              style={[
                styles.timerText,
                styles.resendOtpText,
                { color: primary },
              ]}
            >
              Resend OTP
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 150,
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 16,
  },
  verificationMessageContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 16,
  },
  changeMobile: {
    textDecorationLine: "underline",
    fontFamily: "Montserrat_500Medium",
  },
  otpRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  otpContainer: {
    flexDirection: "row",
    gap: 10,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1.2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  otpText: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "Montserrat_400Regular",
  },
  resend: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 8,
  },
  timerText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  resendOtpText: {
    textDecorationLine: "underline",
    fontFamily: "Montserrat_500Medium",
  },
});
