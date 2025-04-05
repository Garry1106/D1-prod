"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SuccessPopup = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // Start countdown from 5 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1); // Decrease the countdown by 1 every second
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      console.log("Countdown complete. Redirecting to /templates..."); // Debugging log
      router.push("/console/dashboard/whatsapp/templates"); // Redirect to /templates
      onClose(); // Close the popup
    }
  }, [countdown, router, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center">
        {/* Green Tick Icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <p className="text-lg font-semibold mb-4">
          Template successfully created!
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to templates page in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default SuccessPopup;
