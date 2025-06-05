import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function OTPScreen() {
  const { number, countryCode } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');
  const secondary = useThemeColor({}, 'secondary');
  const errorColor = useThemeColor({}, 'error');
  const background = useThemeColor({}, 'background');
  const theme = useThemeColor({}, 'theme');

  useEffect(() => {
    const initializeResendAttempts = async () => {
      const key = `resendAttempts_${countryCode}${number}`;
      const storedTimestamp = await AsyncStorage.getItem(`${key}_timestamp`);
      const currentTime = Date.now();

      if (storedTimestamp) {
        const elapsedTime = currentTime - parseInt(storedTimestamp, 10);

        if (elapsedTime >= 3600000) {
          await AsyncStorage.setItem(key, '0');
        }
      }
    };

    initializeResendAttempts();
  }, [countryCode, number]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleVerify = () => {
    if (otp.join('').length !== 6) {
      setError('Please enter a complete OTP');
    } else {
      setError('');

      const otpValue = otp.join('');
      if (otpValue === '123456') {
        router.push({
          pathname: '/auth/UserDetailsScreen',
        });
      }
    }
  };

  const handleChange = () => {
    router.back();
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 1);

    if (sanitizedValue) {
      newOtp[index] = sanitizedValue;
      setOtp(newOtp);

      if (index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        otpRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = otp[index];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    const key = `resendAttempts_${countryCode}${number}`;
    const currentTime = Date.now();
    const storedAttempts = await AsyncStorage.getItem(key);
    const resendAttempts = storedAttempts ? parseInt(storedAttempts, 10) : 0;

    if (resendAttempts < 3) {
      let nextTimer = 30;
      if (resendAttempts === 1) nextTimer = 60;
      if (resendAttempts === 2) nextTimer = 300;

      setTimer(nextTimer);
      setResendEnabled(false);

      await AsyncStorage.setItem(key, (resendAttempts + 1).toString());
      await AsyncStorage.setItem(`${key}_timestamp`, currentTime.toString());
    } else {
      setError(
        'You have reached the maximum resend attempts. Please try again after 1 hour.'
      );
    }
  };

  const otpCode = otp.reduce((acc, digit) => acc + digit, '');

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { color: primary }]}>Enter OTP</Text>

      <View style={styles.verificationMessageContainer}>
        <Text style={[styles.subtitle, { color: secondary }]}>
          sent to {countryCode} {number}
        </Text>
        <Text
          style={[
            styles.changeMobile,
            { color: primary, textDecorationColor: primary },
          ]}
          onPress={handleChange}
        >
          Change
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpRefs.current[index] = ref)}
            style={[styles.otpBox, { borderColor: border, color: text }]}
            keyboardType='number-pad'
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            selectionColor='green'
          />
        ))}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      ) : null}

      <Pressable
        style={[
          styles.confirmButton,
          {
            backgroundColor: primary,
            opacity: otpCode.length === 6 ? 1 : 0.8,
          },
        ]}
        disabled={otpCode.length < 6}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>Confirm OTP</Text>
      </Pressable>

      {resendEnabled ? (
        <Text
          style={[styles.resendLink, { color: 'green' }]}
          onPress={handleResend}
        >
          Resend OTP
        </Text>
      ) : (
        <Text style={[styles.timerText, { color: secondary }]}>
          Resend OTP in {timer}s
        </Text>
      )}
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpBox: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    textAlign: 'center',
    fontSize: 18,
    width: 45,
    height: 45,
  },
  confirmButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  verificationMessageContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  changeMobile: {
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  resendLink: {
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  timerText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});
