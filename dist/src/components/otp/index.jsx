"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OtpForm;
// components/forms/whatsapp/OtpForm.tsx
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_otp_1 = require("@/components/ui/input-otp"); // Import the OTP input components from shadcn
function OtpForm({ onSubmit }) {
    const [otp, setOtp] = (0, react_1.useState)("");
    const handleOtpChange = (value) => {
        setOtp(value);
    };
    const handleSubmit = async () => {
        if (otp.length === 6) {
            await onSubmit(otp); // Call the onSubmit function passed as a prop
        }
        else {
            alert("Please enter a valid 6-digit OTP.");
        }
    };
    return (<div>
      {/* Heading for the OTP form */}
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Verify Your Identity</h2>
      <p className="text-center text-sm text-gray-600 mb-0">
        We’ve sent a 6-digit OTP to your registered number. Please enter it below to proceed.
      </p>

      <div className="flex flex-col justify-center items-center p-6 mb-1">
        <label className="block text-2xl font-medium text-gray-700 mb-2">Enter your OTP</label>
        <input_otp_1.InputOTP maxLength={6} // Number of OTP digits
     value={otp} onChange={handleOtpChange} className="mt-2" // Apply custom styles to the OTP container
     aria-label="One-Time Password Input" // Accessibility improvement
    >
          <input_otp_1.InputOTPGroup className="flex gap-2 mb-4">
            {[...Array(6)].map((_, index) => (<input_otp_1.InputOTPSlot key={index} index={index} className="text-black border-none shadow-sm shadow-black/20 w-12 h-12 text-center text-lg"/>))}
          </input_otp_1.InputOTPGroup>
        </input_otp_1.InputOTP>
        <button_1.Button onClick={handleSubmit} className="bg-[#EB6C33] hover:bg-[#d55b2a] w-[40%]">
        Submit OTP
      </button_1.Button>
      </div>
      
    </div>);
}
