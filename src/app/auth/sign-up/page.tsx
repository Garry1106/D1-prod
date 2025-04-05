"use client";

import dynamic from 'next/dynamic';
import React, { useState } from 'react'; // Import useState for loader state
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, otpSchema, SignUpFormProps, OtpFormProps } from '@/schemas/auth.schema';
import { useCustomSignUp } from '@/hooks/sign-up/use-sign-up';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { ErrorMessage } from '@hookform/error-message';
import { FaGoogle } from 'react-icons/fa';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'; // Import shadcn InputOTP components

const SignUp = dynamic(() => Promise.resolve(() => {
  const { step, error, handleSignUp, handleVerifyOtp, handleGoogleSignUp } = useCustomSignUp();
  const [isVerifying, setIsVerifying] = useState(false); // State for loader

  const methods = useForm<SignUpFormProps>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const otpMethods = useForm<OtpFormProps>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
  });

  const onSubmitEmailPassword = (data: SignUpFormProps) => {
    handleSignUp(data.email, data.password, data.username);
  };

  const onSubmitOtp = async (data: OtpFormProps) => {
    setIsVerifying(true); // Show loader
    await handleVerifyOtp(data.otpCode, data.username); // Call verify OTP
    setIsVerifying(false); // Hide loader
  };

  return (
    <div className="w-full max-h-screen flex items-center justify-center p-5 sm:p-8 lg:p-16">
      <div className="w-full max-w-md bg-white px-6 py-4 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-2xl font-bold text-center mb-2">Create an Account</h2>
        <p className="text-gray-600 text-center mb-2 sm:text-sm">
          Start your journey to smarter productivity today.
        </p>

        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        {step === 'email-password' ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitEmailPassword)} className="space-y-1">
              {/* Username Field */}
              <div>
                <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                <Input
                  {...methods.register('username')}
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none"
                />
                <ErrorMessage
                  errors={methods.formState.errors}
                  name="username"
                  render={({ message }) => (
                    <p className="text-sm text-red-500 ">{message}</p>
                  )}
                />
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  {...methods.register('email')}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none"
                />
                <ErrorMessage
                  errors={methods.formState.errors}
                  name="email"
                  render={({ message }) => (
                    <p className="text-sm text-red-500">{message}</p>
                  )}
                />
              </div>

              {/* Password Fields */}
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  {...methods.register('password')}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none"
                />
                <ErrorMessage
                  errors={methods.formState.errors}
                  name="password"
                  render={({ message }) => (
                    <p className="text-sm text-red-500">{message}</p>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  {...methods.register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none mb-2"
                />
                <ErrorMessage
                  errors={methods.formState.errors}
                  name="confirmPassword"
                  render={({ message }) => (
                    <p className="text-sm text-red-500">{message}</p>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-[#EB6C33] hover:bg-[#f78858] text-white py-3 rounded-md">
                Create Account
              </Button>
            </form>
          </FormProvider>

        ) : (
          <form onSubmit={otpMethods.handleSubmit(onSubmitOtp)} className="space-y-6">
            {/* Title and Subtitle */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
              <p className="text-gray-600 mt-2 sm:text-lg">
                Enter the one-time password that was sent to your email.
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center">
              <FormProvider {...otpMethods}>
                <InputOTP
                  maxLength={6}
                  {...otpMethods.register('otpCode')}
                  onChange={(value) => otpMethods.setValue('otpCode', value)}
                >
                  <InputOTPGroup className="gap-2"> {/* Add gap between slots */}
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} className="w-12 h-12" /> // Adjust size if needed
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormProvider>
            </div>

            {/* Submit Button with Loader */}
            <Button
              type="submit"
              className="w-full bg-[#EB6C33] text-white py-3 rounded-md font-semibold hover:bg-[#f78858] transition flex items-center justify-center"
              disabled={isVerifying} // Disable button while verifying
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </div>
              ) : (
                "Verify and Complete Sign Up"
              )}
            </Button>

            {/* Footer Link */}
            <p className="text-center text-gray-600 mt-2">
              Already have an account?{' '}
              <a href="/auth/sign-in" className="font-medium text-black hover:underline">
                Sign In
              </a>
            </p>
          </form>
        )}

        <div className=" text-center">
          <p className="text-gray-600 mt-1">Or sign up with</p>
          <div className="flex gap-2 justify-center mt-1">
            <Button
              onClick={handleGoogleSignUp}
              className="w-full text-base bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-3 hover:bg-gray-200"
            >
              <FaGoogle className="w-5 h-5 mx-2" />
              Google
            </Button>
          </div>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="font-medium text-black hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}), { ssr: false });

export default SignUp;