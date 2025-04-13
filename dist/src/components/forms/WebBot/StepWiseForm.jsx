"use strict";
'use client';
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
exports.StepwiseForm = void 0;
const react_1 = __importStar(require("react"));
const WebForm_1 = require("./WebForm");
const WebPayment_1 = require("./WebPayment");
const WebAdditionalForm_1 = require("./WebAdditionalForm"); // Import the new form component
const fa_1 = require("react-icons/fa");
const Cart_1 = __importDefault(require("./Cart")); // Import the Cart component
const FormContext_1 = require("@/context/webbot/FormContext"); // Adjust the import path accordingly
const use_user_1 = require("@/hooks/user/use-user"); // Adjust the import path accordingly
const react_toastify_1 = require("react-toastify");
const navigation_1 = require("next/navigation");
const StepwiseForm = () => {
    const router = (0, navigation_1.useRouter)();
    const [step, setStep] = (0, react_1.useState)(1);
    const [subscriptionLevel, setSubscriptionLevel] = (0, react_1.useState)(undefined);
    const { formData, setFormData } = (0, FormContext_1.useWebFormContext)(); // Access form data and setFormData from context
    const { updateUserAndProduct, userDetails } = (0, use_user_1.useUserDetails)(); // Access user details
    // Add Clerk ID to formData when step is 1 and userDetails is available
    (0, react_1.useEffect)(() => {
        if (step === 1 && (userDetails === null || userDetails === void 0 ? void 0 : userDetails.clerkId)) {
            setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webForm: Object.assign(Object.assign({}, prevData.webForm), { clerkId: userDetails.clerkId }) })));
        }
    }, [step, userDetails, setFormData]);
    const handleNext = () => {
        console.log('Form Data after Step', step, ':', formData); // Log form data after each step
        setStep(step + 1);
    };
    const handlePrevious = () => {
        setStep(step - 1);
    };
    const handleSubmit = async () => {
        console.log('Final Form Data:', formData); // Log final form data on submission
        try {
            const response = await fetch("/api/webbot/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // Send combined data including subscription details
            });
            if (response.ok) {
                react_toastify_1.toast.success("WhatsappBot is Successfully created!");
                router.push("/console/dashboard/webbot");
            }
            else {
                react_toastify_1.toast.error("Failed to save business data");
            }
        }
        catch (error) {
            console.error("Error submitting business data:", error);
            react_toastify_1.toast.error("An error occurred while creating WhatsappBot");
        }
    };
    // Static cart items
    const cartItems = [
        { id: 'form-item', name: 'Form Setup', price: 50 },
        { id: 'subscription-item', name: 'Monthly Subscription', price: 20 },
    ];
    // Calculate total price
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    // Step labels and icons
    const steps = [
        { id: 1, label: 'Form Details', icon: <fa_1.FaFileAlt /> },
        { id: 2, label: 'Additional Info', icon: <fa_1.FaInfoCircle /> }, // New step for additional form
        { id: 3, label: 'Payment', icon: <fa_1.FaCreditCard /> },
    ];
    return (<div className="min-h-screen bg-gray-50 py-6 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Centered Heading and Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#EB6C33]">Website Chatbot Setup</h1>
          <p className="text-gray-600">Please fill out the form to set up your Website Chatbot.</p>
        </div>

        {/* Centered Step Counter */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center max-w-3xl w-full">
            {steps.map((stepItem, index) => (<react_1.default.Fragment key={stepItem.id}>
                <div className="flex flex-col items-center gap-1">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === stepItem.id
                ? 'bg-[#EB6C33] text-white'
                : step > stepItem.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'}`}>
                    {step > stepItem.id ? <fa_1.FaCheck /> : stepItem.icon}
                  </div>
                  {/* Label */}
                  <span className={`text-sm font-medium ${step === stepItem.id ? 'text-[#EB6C33]' : 'text-gray-600'}`}>
                    {stepItem.label}
                  </span>
                </div>
                {/* Connecting Line */}
                {index < steps.length - 1 && (<div className={`flex-1 h-0.5 mx-2 ${step > stepItem.id ? 'bg-[#EB6C33]' : 'bg-gray-200'}`}></div>)}
              </react_1.default.Fragment>))}
          </div>
        </div>

        {/* Form Steps and Cart */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Steps */}
          <div className={step === 1 || step === 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
            {step === 1 && <WebForm_1.WebForm onNext={handleNext}/>}
            {step === 2 && (<WebAdditionalForm_1.WebAdditionalForm onNext={handleNext} onPrevious={handlePrevious}/>)}
            {step === 3 && <WebPayment_1.WebPayment onSubmit={handleSubmit} onPrevious={handlePrevious}/>}
          </div>

          {/* Cart Component (Visible when step > 2) */}
          {step > 2 && ( // Updated condition to render Cart only after step 2
        <div className="lg:col-span-1">
              <Cart_1.default subscriptionLevel={subscriptionLevel}/>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.StepwiseForm = StepwiseForm;
