"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StepForm;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const navigation_1 = require("next/navigation");
const react_toastify_1 = require("react-toastify");
const zod_1 = require("@hookform/resolvers/zod");
// Imports for Components
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const progress_1 = require("@/components/forms/Whatsapp/ui/progress");
const BusinessForm_1 = __importDefault(require("@/components/forms/Whatsapp/BusinessForm"));
const SubscriptionForm_1 = __importDefault(require("@/components/forms/Whatsapp/SubscriptionForm"));
const PaymentForm_1 = __importDefault(require("@/components/forms/Whatsapp/PaymentForm"));
const Cart_1 = __importDefault(require("@/components/forms/Whatsapp/Cart"));
const index_1 = __importDefault(require("@/components/otp/index"));
// Import for Schemas
const form_1 = require("@/schemas/forms/whatsapp/form");
// Import for Context API
const FormContext_1 = require("@/context/whatsapp/FormContext");
const UserContext_1 = require("@/context/user/UserContext");
const use_user_1 = require("@/hooks/user/use-user");
const use_auth_1 = require("@/hooks/auth/use-auth");
const STEPS = [
    "Whatsapp Business Setup",
    "OTP Verification",
    "Plan Selection",
    "Confirmation",
];
function StepForm() {
    const { formData, setFormData } = (0, FormContext_1.useFormContext)();
    const { productType, setProductType } = (0, UserContext_1.useUserContext)();
    const [step, setStep] = (0, react_1.useState)(0);
    const [subscriptionLevel, setSubscriptionLevel] = (0, react_1.useState)(undefined);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false); // Add loading state
    const router = (0, navigation_1.useRouter)();
    const { updateUserAndProduct, userDetails } = (0, use_user_1.useUserDetails)();
    const { isOtpVerified, startPhoneVerification, verifyOtp } = (0, use_auth_1.useOtp)();
    const businessForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(form_1.businessFormSchema),
        defaultValues: Object.assign(Object.assign({}, formData.business), { currency: formData.business.currency }),
    });
    const subscriptionForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(form_1.subscriptionFormSchema),
        defaultValues: formData.subscription,
    });
    const paymentForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(form_1.paymentFormSchema),
        defaultValues: formData.payment,
    });
    const progress = ((step + 1) / STEPS.length) * 100;
    const handleNext = async () => {
        let isValid = false;
        setIsLoading(true); // Set loading state to true
        try {
            switch (step) {
                case 0:
                    isValid = await businessForm.trigger();
                    if (isValid) {
                        setFormData((prev) => (Object.assign(Object.assign({}, prev), { business: Object.assign(Object.assign({}, businessForm.getValues()), { currency: prev.business.currency, clerkId: userDetails.clerkId }) })));
                        console.log("FormData in StepForm 1", formData);
                        const phoneNumber = businessForm.getValues().displayPhoneNumber;
                        console.log(phoneNumber);
                        await startPhoneVerification(phoneNumber);
                    }
                    break;
                case 1:
                    console.log("FormData in StepForm 2", formData);
                    if (isOtpVerified) {
                        setStep((prev) => prev + 1);
                    }
                    else {
                        react_toastify_1.toast.error("Please verify OTP first.");
                        return;
                    }
                    break;
                case 2:
                    console.log("Hello world from 3");
                    isValid = await subscriptionForm.trigger();
                    if (!isValid) {
                        console.log("Subscription Form Errors:", subscriptionForm.formState.errors);
                    }
                    console.log(isValid);
                    if (isValid) {
                        setFormData((prev) => (Object.assign(Object.assign({}, prev), { subscription: subscriptionForm.getValues() })));
                        console.log("FormData in Stepform 3", formData);
                    }
                    break;
                case 3:
                    isValid = await paymentForm.trigger();
                    if (isValid) {
                        setFormData((prev) => (Object.assign(Object.assign({}, prev), { payment: paymentForm.getValues() })));
                        console.log("FormData in stepform 4", formData);
                        await handleSubmit();
                    }
                    break;
            }
            if (isValid && step < STEPS.length - 1) {
                setStep((prev) => prev + 1);
            }
        }
        catch (error) {
            console.error("Error in handleNext:", error);
            react_toastify_1.toast.error("An error occurred while processing your request.");
        }
        finally {
            setIsLoading(false); // Reset loading state
        }
    };
    const handlePrevious = () => {
        if (step > 0) {
            setStep((prev) => prev - 1);
        }
    };
    const handleSubmit = async () => {
        // Combine business and subscription data
        const combinedFormData = Object.assign(Object.assign({}, formData.business), { subscription: formData.subscription });
        console.log("Final Subscription Data with Features and Limits:", formData.subscription);
        console.log("Final Combined Form Data:", combinedFormData);
        try {
            const response = await fetch("/api/Whatsapp/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(combinedFormData), // Send combined data including subscription details
            });
            if (response.ok) {
                await updateUserAndProduct(formData, productType, userDetails === null || userDetails === void 0 ? void 0 : userDetails.clerkId);
                react_toastify_1.toast.success("WhatsappBot is Successfully created!");
                router.push("/console/dashboard/whatsapp");
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
    return (<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{STEPS[step]}</h2>
          <div className="mt-4">
            <progress_1.Progress value={progress} className="w-full h-2"/>
          </div>
        </div>

        {/* Render Cart for steps 2 and 3 */}
        {step >= 2 ? (
        // Subscription and Payment steps with cart
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <card_1.Card className="p-6">
                {step === 2 && (<SubscriptionForm_1.default form={subscriptionForm} setSubscriptionLevel={setSubscriptionLevel}/>)}
                {step === 3 && <PaymentForm_1.default form={paymentForm}/>}
                <div className="mt-8 flex justify-between">
                  <button_1.Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </button_1.Button>
                  <button_1.Button onClick={handleNext} className="bg-[#EB6C33] hover:bg-[#d55b2a]" disabled={isLoading} // Disable button when loading
        >
                    {isLoading ? (<div className="flex items-center">
                        <span className="mr-2">Loading...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>) : (step === STEPS.length - 1 ? "Submit" : "Next")}
                  </button_1.Button>
                </div>
              </card_1.Card>
            </div>
            <div className="lg:col-span-1">
              <Cart_1.default subscriptionLevel={subscriptionLevel}/>
            </div>
          </div>) : (
        // Steps 0 and 1 - full width
        <card_1.Card className="w-full mx-auto p-6">
            {step === 0 && <BusinessForm_1.default form={businessForm}/>}
            {step === 1 && (<div className="space-y-6">
                <index_1.default onSubmit={verifyOtp}/>
              </div>)}
            <div className="mt-8 flex justify-between">
              <button_1.Button variant="outline" onClick={handlePrevious} disabled={step === 0}>
                Previous
              </button_1.Button>
              <button_1.Button onClick={handleNext} className="bg-[#EB6C33] hover:bg-[#d55b2a]" disabled={isLoading} // Disable button when loading
        >
                {isLoading ? (<div className="flex items-center">
                    <span className="mr-2">Loading...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>) : ("Next")}
              </button_1.Button>
            </div>
          </card_1.Card>)}
      </div>
    </div>);
}
