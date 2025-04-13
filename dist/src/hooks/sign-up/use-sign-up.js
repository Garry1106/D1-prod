"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomSignUp = void 0;
const nextjs_1 = require("@clerk/nextjs");
const react_1 = require("react");
const react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
const navigation_1 = require("next/navigation");
const index_1 = require("@/actions/auth/index");
const useCustomSignUp = () => {
    const [name, setName] = (0, react_1.useState)("");
    const { signUp, isLoaded } = (0, nextjs_1.useSignUp)();
    const { setActive } = (0, nextjs_1.useClerk)();
    const router = (0, navigation_1.useRouter)();
    const [step, setStep] = (0, react_1.useState)('email-password');
    const [error, setError] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleSignUp = async (email, password, username) => {
        if (!isLoaded)
            return;
        setIsLoading(true);
        setError(null);
        setName(username);
        try {
            // Create Clerk user
            const signUpResult = await signUp.create({
                emailAddress: email,
                password: password,
            });
            // Prepare OTP verification if required
            await signUp.prepareEmailAddressVerification();
            setStep('otp');
        }
        catch (err) {
            console.error("Sign-up error:", err);
            setError("Failed to create account. Please try again.");
            react_toastify_1.toast.error("Failed to create account. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleVerifyOtp = async (otpCode, username) => {
        console.log("username is", name);
        if (!isLoaded)
            return;
        setIsLoading(true);
        setError(null);
        console.log("OTP code is", otpCode);
        try {
            // Attempt to verify OTP with Clerk
            const verificationResult = await signUp.attemptEmailAddressVerification({
                code: otpCode,
            });
            console.log("verification result", verificationResult);
            console.log("verification result", verificationResult.status);
            // Check if verification is complete
            const isVerificationComplete = verificationResult.status === 'complete' &&
                verificationResult.createdSessionId &&
                verificationResult.emailAddress;
            if (isVerificationComplete) {
                const clerkId = signUp.createdUserId;
                if (!clerkId) {
                    // Handle the case where clerkId is null
                    setError("Clerk user ID is not available.");
                    react_toastify_1.toast.error("Clerk user ID is not available.");
                    return;
                }
                const emailId = verificationResult.emailAddress || "";
                // Store the user data in MongoDB after successful OTP verification
                const registered = await (0, index_1.onUserRegistration)(clerkId, emailId, name);
                if ((registered === null || registered === void 0 ? void 0 : registered.status) === 200 && registered.user) {
                    // Activate user session
                    await setActive({ session: verificationResult.createdSessionId });
                    react_toastify_1.toast.success('Account verified! Redirecting to dashboard...'); // Success toast
                    router.push('/console');
                }
                else {
                    setError("Registration failed. Please try again.");
                    react_toastify_1.toast.error("Registration failed. Please try again."); // Error toast
                }
            }
            else {
                setError("Failed to verify OTP. Please check your code and try again.");
                react_toastify_1.toast.error("Failed to verify OTP. Please check your code and try again.");
            }
        }
        catch (err) {
            console.error("OTP verification error:", err);
            setError(`Failed to verify OTP code. Error: ${err.message}`);
            react_toastify_1.toast.error(`Failed to verify OTP code. Please try again.`); // Error toast
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleGoogleSignUp = async () => {
        if (!isLoaded)
            return;
        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/auth/sso-callback',
                redirectUrlComplete: '/console',
            });
            react_toastify_1.toast.success('Redirecting to Google sign-up...'); // Success toast
        }
        catch (err) {
            console.error("Google Sign-up error:", err);
            setError("Failed to sign up with Google. Please try again.");
            react_toastify_1.toast.error("Failed to sign up with Google. Please try again."); // Error toast
        }
    };
    return {
        step,
        error,
        isLoading,
        handleSignUp,
        handleVerifyOtp,
        handleGoogleSignUp
    };
};
exports.useCustomSignUp = useCustomSignUp;
