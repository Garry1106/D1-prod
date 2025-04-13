"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOtp = void 0;
const clerk_react_1 = require("@clerk/clerk-react"); // Clerk SDK
const react_1 = require("react");
const navigation_1 = require("next/navigation"); // For redirection after success
const react_toastify_1 = require("react-toastify");
// Custom hook for OTP logic
const useOtp = () => {
    const { user } = (0, clerk_react_1.useClerk)(); // Access the currently logged-in user
    const [isOtpVerified, setIsOtpVerified] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(null);
    const [verifying, setVerifying] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    // Start OTP verification (send OTP to the phone number)
    const startPhoneVerification = async (phoneNumber) => {
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
        }
        catch (error) {
            setIsLoading(false);
            console.error("Error sending OTP:", error);
            setErrorMessage("Error sending OTP. Please try again.");
        }
    };
    // Verify OTP entered by the user
    const verifyOtp = async (otp) => {
        var _a;
        if (!user || !((_a = user.phoneNumbers) === null || _a === void 0 ? void 0 : _a.length)) {
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
            react_toastify_1.toast.success("OTP has been verified Successfully.");
            setIsLoading(false);
        }
        catch (error) {
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
exports.useOtp = useOtp;
