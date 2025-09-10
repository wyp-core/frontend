import { OTPRequestPayload, VerifyOTPPayload } from "@/types/user";
import axios from "axios";

const baseURL = process.env.API_BASE_URL || "http://10.0.2.2:8000/v1";

export const requestOTP = async (data: OTPRequestPayload) => {
  console.log(`${baseURL}/otp/send`);

  if (!baseURL) {
    throw new Error("API_BASE_URL is not defined.");
  }

  const response = await axios.post(`${baseURL}/otp/send`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response;
};

export const verifyOTP = async (data: VerifyOTPPayload) => {
  if (!baseURL) {
    throw new Error("API_BASE_URL is not defined.");
  }

  const response = await axios.post(`${baseURL}/otp/verify`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response;
};
