
import { useSignUp, useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { onUserRegistration } from '@/actions/auth/index';

export type SignUpStep = 'email-password' | 'otp';

export const useCustomSignUp = () => {
  const[name,setName] = useState<string |any>("")
  const { signUp, isLoaded } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const [step, setStep] = useState<SignUpStep>('email-password');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (email: string, password: string, username: string) => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    setName(username)
    try {
      // Create Clerk user
      const signUpResult = await signUp.create({
        emailAddress: email,
        password: password,
      });

      // Prepare OTP verification if required
      await signUp.prepareEmailAddressVerification();
      setStep('otp');
      
      

    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError("Failed to create account. Please try again.");
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode: string, username: string) => {

    console.log("username is",name)
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    console.log("OTP code is",otpCode)
  
    try {
      // Attempt to verify OTP with Clerk
      const verificationResult = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      console.log("verification result",verificationResult)
      console.log("verification result",verificationResult.status)
  
      // Check if verification is complete
      const isVerificationComplete =
        verificationResult.status === 'complete' &&
        verificationResult.createdSessionId &&
        verificationResult.emailAddress;
  
      if (isVerificationComplete) {
        const clerkId = signUp.createdUserId;
  
        if (!clerkId) {
          // Handle the case where clerkId is null
          setError("Clerk user ID is not available.");
          toast.error("Clerk user ID is not available.");
          return;
        }
  
        const emailId = verificationResult.emailAddress || "";
  
        // Store the user data in MongoDB after successful OTP verification
        const registered = await onUserRegistration(clerkId, emailId,name);
  
        if (registered?.status === 200 && registered.user) {
          // Activate user session
          await setActive({ session: verificationResult.createdSessionId });
          toast.success('Account verified! Redirecting to dashboard...');  // Success toast
          router.push('/console');
        } else {
          setError("Registration failed. Please try again.");
          toast.error("Registration failed. Please try again.");  // Error toast
        }
      } else {
        setError("Failed to verify OTP. Please check your code and try again.");
        toast.error("Failed to verify OTP. Please check your code and try again.");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(`Failed to verify OTP code. Error: ${err.message}`);
      toast.error(`Failed to verify OTP code. Please try again.`);  // Error toast
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/sso-callback',
        redirectUrlComplete: '/console',
      });
      toast.success('Redirecting to Google sign-up...'); // Success toast
    } catch (err) {
      console.error("Google Sign-up error:", err);
      setError("Failed to sign up with Google. Please try again.");
      toast.error("Failed to sign up with Google. Please try again.");  // Error toast
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
