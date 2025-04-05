"use client"
// components/forms/whatsapp/OtpForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"; // Import the OTP input components from shadcn

interface OtpFormProps {
  onSubmit: (otp: string) => Promise<void>;
}

export default function OtpForm({ onSubmit }: OtpFormProps) {
  const [otp, setOtp] = useState<string>("");

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = async () => {
    if (otp.length === 6) {
      await onSubmit(otp); // Call the onSubmit function passed as a prop
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <div>
      {/* Heading for the OTP form */}
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Verify Your Identity</h2>
      <p className="text-center text-sm text-gray-600 mb-0">
        We’ve sent a 6-digit OTP to your registered number. Please enter it below to proceed.
      </p>

      <div className="flex flex-col justify-center items-center p-6 mb-1">
        <label className="block text-2xl font-medium text-gray-700 mb-2">Enter your OTP</label>
        <InputOTP
          maxLength={6} // Number of OTP digits
          value={otp}
          onChange={handleOtpChange}
          className="mt-2" // Apply custom styles to the OTP container
          aria-label="One-Time Password Input" // Accessibility improvement
        >
          <InputOTPGroup className="flex gap-2 mb-4">
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot key={index} index={index} className="text-black border-none shadow-sm shadow-black/20 w-12 h-12 text-center text-lg"/>
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={handleSubmit} className="bg-[#EB6C33] hover:bg-[#d55b2a] w-[40%]">
        Submit OTP
      </Button>
      </div>
      
    </div>
  );
}