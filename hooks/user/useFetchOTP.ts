import { requestOTP, verifyOTP } from "@/api/user";
import { OTPRequestPayload, VerifyOTPPayload } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export const useFetchOTP = () => {
  return useMutation({
    mutationFn: (data: OTPRequestPayload) => requestOTP(data),
    onError: (error) => {
      console.error("Failed to request OTP:", error);
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (data: VerifyOTPPayload) => verifyOTP(data),
    onError: (error) => {
      console.error("Failed to request OTP:", error);
    },
  });
};
