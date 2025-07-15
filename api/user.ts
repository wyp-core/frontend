import { OTPRequestPayload, VerifyOTPPayload } from "@/types/user";
import axios from "axios";

const baseURL = process.env.API_BASE_URL || "http://192.168.1.13:8000/v1";

export const requestOTP = async (data: OTPRequestPayload) => {
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
