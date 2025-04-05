import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useClerk } from '@clerk/nextjs';
import { onUserVerification } from '@/actions/auth/index';
import { toast } from 'react-toastify';  // Import toast from React-Toastify

export const useCustomSignIn = () => {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  const { setActive, signOut, user } = useClerk();
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (email: string, password: string) => {
    console.log("Sign-in email:", email);
    console.log("Is sign-in loaded:", isLoaded);
  
    if (!isLoaded) return;
  
    try {
      // Check if the user exists in your database
      // const userExists = await onUserVerification(email);
      // if (!userExists) {
      //   setError("User does not exist. Please sign up first.");
      //   return;
      // }
      // console.log("User Exists:",userExists)
  
      // // Sign out any existing session if active
      // if (user) {
      //   await signOut();
      // }
  
      // Attempt sign-in with email and password
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
        strategy: 'password',
      });
  
      console.log("SignInAttempt:", signInAttempt.status);
  
      // Check if sign-in was successful and session was created
      if (signInAttempt.status == 'complete') {
        console.log("hello world")
        await setActive({ session: signInAttempt.createdSessionId });
        toast.success("Login Successfully!!")
        router.push("/console")
        
      } else {
        // Instead of using setError, show the toast
        toast.error("Invalid credentials. Please check your email and password.");
      }
    } catch (err: any) {
      // Handle Clerk-specific error with a custom message
      if (err.clerkError && err.status === 422 && err.errors?.[0]?.message) {
        const errorMessage = err.errors[0].message;
        toast.error(errorMessage);  // Show error using React-Toastify
        console.error(errorMessage);
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/sso-callback',
        redirectUrlComplete: '/console',
      });
    } catch (err) {
      console.error("Google Sign-in error:", err);
      toast.error("Failed to sign in with Google. Please try again.");  // Show error toast
    }
  };

  return {
    handleEmailSignIn,
    handleGoogleSignIn,
    error,
  };
};
