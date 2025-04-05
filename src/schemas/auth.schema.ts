import { z } from 'zod';

// Define props types for the SignUp, OTP, and SignIn forms
// Define props types for the SignUp form with username field
export type SignUpFormProps = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;  // Added username field
};


export type OtpFormProps = {
  otpCode: string;
  username:string
};

export type SignInFormProps = {
  email: string;
  password: string;
};

// Sign-up schema validation
// Sign-up schema validation with username field
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),  // Added username validation
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


// OTP schema validation
export const otpSchema = z.object({
  otpCode: z.string().length(6, "OTP code must be 6 characters"),
});

// Sign-in schema validation
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});