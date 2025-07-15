export type OTPRequestPayload {
  phone: string;
  countryCode: string;
}

export type VerifyOTPPayload {
  phone: string;
  countryCode: string;
  otp: number;
}