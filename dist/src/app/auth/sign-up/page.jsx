"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_1 = __importStar(require("react")); // Import useState for loader state
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const auth_schema_1 = require("@/schemas/auth.schema");
const use_sign_up_1 = require("@/hooks/sign-up/use-sign-up");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const alert_1 = require("@/components/ui/alert");
const error_message_1 = require("@hookform/error-message");
const fa_1 = require("react-icons/fa");
const input_otp_1 = require("@/components/ui/input-otp"); // Import shadcn InputOTP components
const SignUp = (0, dynamic_1.default)(() => Promise.resolve(() => {
    const { step, error, handleSignUp, handleVerifyOtp, handleGoogleSignUp } = (0, use_sign_up_1.useCustomSignUp)();
    const [isVerifying, setIsVerifying] = (0, react_1.useState)(false); // State for loader
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_schema_1.signUpSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
        mode: 'onChange',
    });
    const otpMethods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_schema_1.otpSchema),
        mode: 'onChange',
    });
    const onSubmitEmailPassword = (data) => {
        handleSignUp(data.email, data.password, data.username);
    };
    const onSubmitOtp = async (data) => {
        setIsVerifying(true); // Show loader
        await handleVerifyOtp(data.otpCode, data.username); // Call verify OTP
        setIsVerifying(false); // Hide loader
    };
    return (<div className="w-full max-h-screen flex items-center justify-center p-5 sm:p-8 lg:p-16">
      <div className="w-full max-w-md bg-white px-6 py-4 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-2xl font-bold text-center mb-2">Create an Account</h2>
        <p className="text-gray-600 text-center mb-2 sm:text-sm">
          Start your journey to smarter productivity today.
        </p>

        {error && (<alert_1.Alert variant="destructive">
            {error}
          </alert_1.Alert>)}

        {step === 'email-password' ? (<react_hook_form_1.FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitEmailPassword)} className="space-y-1">
              {/* Username Field */}
              <div>
                <label_1.Label htmlFor="username" className="text-gray-700 font-medium">Username</label_1.Label>
                <input_1.Input {...methods.register('username')} id="username" type="text" placeholder="Enter your username" className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none"/>
                <error_message_1.ErrorMessage errors={methods.formState.errors} name="username" render={({ message }) => (<p className="text-sm text-red-500 ">{message}</p>)}/>
              </div>

              {/* Email Field */}
              <div>
                <label_1.Label htmlFor="email" className="text-gray-700 font-medium">Email</label_1.Label>
                <input_1.Input {...methods.register('email')} id="email" type="email" placeholder="Enter your email" className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none"/>
                <error_message_1.ErrorMessage errors={methods.formState.errors} name="email" render={({ message }) => (<p className="text-sm text-red-500">{message}</p>)}/>
              </div>

              {/* Password Fields */}
              <div>
                <label_1.Label htmlFor="password" className="text-gray-700 font-medium">Password</label_1.Label>
                <input_1.Input {...methods.register('password')} id="password" type="password" placeholder="Enter your password" className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none"/>
                <error_message_1.ErrorMessage errors={methods.formState.errors} name="password" render={({ message }) => (<p className="text-sm text-red-500">{message}</p>)}/>
              </div>

              <div>
                <label_1.Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </label_1.Label>
                <input_1.Input {...methods.register('confirmPassword')} id="confirmPassword" type="password" placeholder="Confirm your password" className="mt-1 w-full border border-gray-300 p-3 rounded-md focus:outline-none mb-2"/>
                <error_message_1.ErrorMessage errors={methods.formState.errors} name="confirmPassword" render={({ message }) => (<p className="text-sm text-red-500">{message}</p>)}/>
              </div>

              <button_1.Button type="submit" className="w-full bg-[#EB6C33] hover:bg-[#f78858] text-white py-3 rounded-md">
                Create Account
              </button_1.Button>
            </form>
          </react_hook_form_1.FormProvider>) : (<form onSubmit={otpMethods.handleSubmit(onSubmitOtp)} className="space-y-6">
            {/* Title and Subtitle */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
              <p className="text-gray-600 mt-2 sm:text-lg">
                Enter the one-time password that was sent to your email.
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center">
              <react_hook_form_1.FormProvider {...otpMethods}>
                <input_otp_1.InputOTP maxLength={6} {...otpMethods.register('otpCode')} onChange={(value) => otpMethods.setValue('otpCode', value)}>
                  <input_otp_1.InputOTPGroup className="gap-2"> {/* Add gap between slots */}
                    {Array.from({ length: 6 }).map((_, index) => (<input_otp_1.InputOTPSlot key={index} index={index} className="w-12 h-12"/> // Adjust size if needed
            ))}
                  </input_otp_1.InputOTPGroup>
                </input_otp_1.InputOTP>
              </react_hook_form_1.FormProvider>
            </div>

            {/* Submit Button with Loader */}
            <button_1.Button type="submit" className="w-full bg-[#EB6C33] text-white py-3 rounded-md font-semibold hover:bg-[#f78858] transition flex items-center justify-center" disabled={isVerifying} // Disable button while verifying
        >
              {isVerifying ? (<div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Verifying...
                </div>) : ("Verify and Complete Sign Up")}
            </button_1.Button>

            {/* Footer Link */}
            <p className="text-center text-gray-600 mt-2">
              Already have an account?{' '}
              <a href="/auth/sign-in" className="font-medium text-black hover:underline">
                Sign In
              </a>
            </p>
          </form>)}

        <div className=" text-center">
          <p className="text-gray-600 mt-1">Or sign up with</p>
          <div className="flex gap-2 justify-center mt-1">
            <button_1.Button onClick={handleGoogleSignUp} className="w-full text-base bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-3 hover:bg-gray-200">
              <fa_1.FaGoogle className="w-5 h-5 mx-2"/>
              Google
            </button_1.Button>
          </div>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="font-medium text-black hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>);
}), { ssr: false });
exports.default = SignUp;
