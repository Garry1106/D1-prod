'use client'
import { useClerk } from "@clerk/clerk-react"; // Clerk SDK
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection after success
import { toast } from "react-toastify";

// Custom hook for OTP logic
export const useOtp = () => {
  const { user } = useClerk(); // Access the currently logged-in user
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  // Start OTP verification (send OTP to the phone number)
  const startPhoneVerification = async (phoneNumber: string) => {
    if (!user) {
      alert("User is not authenticated.");
      return;
    }

    console.log("Phone number passed to hook is: ", phoneNumber);
    console.log("Clerk user: ", user);

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Create phone number for the user (if not already associated)
      const userPhone = await user.createPhoneNumber({ phoneNumber });

      // Start the verification process using the phone's prepareVerification method
      await userPhone.prepareVerification(); // Sends OTP to the phone number

      console.log("OTP sent to phone number.");
      setVerifying(true); // Show the second form to enter OTP
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending OTP:", error);
      setErrorMessage("Error sending OTP. Please try again.");
    }
  };

  // Verify OTP entered by the user
  const verifyOtp = async (otp: string) => {
    if (!user || !user.phoneNumbers?.length) {
      alert("User or phone number is not available.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Assuming the user has at least one phone number
      const phone = user.phoneNumbers[0]; // Access the first phone number

      // Verify OTP entered by the user
      await phone.attemptVerification({ code: otp });

      setIsOtpVerified(true);
      console.log("OTP verified successfully.");
      toast.success("OTP has been verified Successfully.")
      setIsLoading(false);
    } 
    catch (error)
    {
      setIsLoading(false);
      console.error("Error verifying OTP:", error);
      setErrorMessage("An error occurred while verifying OTP. Please check the code and try again.");
    }
  };

  return {
    isOtpVerified,
    startPhoneVerification,
    verifyOtp,
    isLoading,
    errorMessage
  };
};
