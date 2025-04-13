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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const SuccessPopup = ({ onClose }) => {
    const router = (0, navigation_1.useRouter)();
    const [countdown, setCountdown] = (0, react_1.useState)(5); // Start countdown from 5 seconds
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1); // Decrease the countdown by 1 every second
        }, 1000);
        return () => clearInterval(timer); // Cleanup the timer on unmount
    }, []);
    (0, react_1.useEffect)(() => {
        if (countdown === 0) {
            console.log("Countdown complete. Redirecting to /templates..."); // Debugging log
            router.push("/console/dashboard/whatsapp/templates"); // Redirect to /templates
            onClose(); // Close the popup
        }
    }, [countdown, router, onClose]);
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center">
        {/* Green Tick Icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
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
    </div>);
};
exports.default = SuccessPopup;
