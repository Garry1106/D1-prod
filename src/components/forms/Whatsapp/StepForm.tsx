'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

// Imports for Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/forms/Whatsapp/ui/progress";
import BusinessForm from "@/components/forms/Whatsapp/BusinessForm";
import SubscriptionForm from "@/components/forms/Whatsapp/SubscriptionForm";
import PaymentForm from "@/components/forms/Whatsapp/PaymentForm";
import Cart from "@/components/forms/Whatsapp/Cart";
import OtpForm from "@/components/otp/index";

// Import for Schemas
import {
  businessFormSchema,
  subscriptionFormSchema,
  paymentFormSchema,
  type BusinessFormValues,
  type SubscriptionFormValues,
  type PaymentFormValues,
} from "@/schemas/forms/whatsapp/form";

// Import for Context API
import { useFormContext } from "@/context/whatsapp/FormContext";
import { useUserContext } from "@/context/user/UserContext";
import { useUserDetails } from "@/hooks/user/use-user";
import { useOtp } from "@/hooks/auth/use-auth";

const STEPS = [
  "Whatsapp Business Setup",
  "OTP Verification",
  "Plan Selection",
  "Confirmation",
] as const;

export default function StepForm() {
  const { formData, setFormData } = useFormContext();
  const { productType, setProductType } = useUserContext();
  const [step, setStep] = useState<number>(0);
  const [subscriptionLevel, setSubscriptionLevel] = useState<
    "Basic" | "Standard" | "Premium" | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const router = useRouter();

  const { updateUserAndProduct, userDetails } = useUserDetails();
  const { isOtpVerified, startPhoneVerification, verifyOtp } = useOtp();

  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      ...formData.business,
      currency: formData.business.currency, // Include the currency field
    },
  });

  const subscriptionForm = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: formData.subscription,
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
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
            setFormData((prev) => ({
              ...prev,
              business: {
                ...businessForm.getValues(), // Include all fields from the form
                currency: prev.business.currency, // Preserve the currency field
                clerkId: userDetails!.clerkId, // Assert that clerkId is not undefined
              },
            }));
  
            console.log("FormData in StepForm 1", formData);
            const phoneNumber = businessForm.getValues().displayPhoneNumber;
            console.log(phoneNumber)
            await startPhoneVerification(phoneNumber);
          }
          break;
        case 1:
          console.log("FormData in StepForm 2", formData);
          if (isOtpVerified) {
            setStep((prev) => prev + 1);
          } else {
            toast.error("Please verify OTP first.");
            return;
          }
          break;
        case 2:
          console.log("Hello world from 3")
          isValid = await subscriptionForm.trigger();
          if (!isValid) {
            console.log("Subscription Form Errors:", subscriptionForm.formState.errors);
          }
          console.log(isValid)
          if (isValid) {
            setFormData((prev) => ({
              ...prev,
              subscription: subscriptionForm.getValues(),
            }));
            console.log("FormData in Stepform 3", formData);
          }
          break;
        case 3:
          isValid = await paymentForm.trigger();
          if (isValid) {
            setFormData((prev) => ({
              ...prev,
              payment: paymentForm.getValues(),
            }));
            console.log("FormData in stepform 4", formData);
            await handleSubmit();
          }
          break;
      }
  
      if (isValid && step < STEPS.length - 1) {
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
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
    const combinedFormData = {
      ...formData.business,
      subscription: formData.subscription, // Ensure subscription includes features and limits
    };

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
        await updateUserAndProduct(formData, productType, userDetails?.clerkId);
        toast.success("WhatsappBot is Successfully created!");
        router.push("/console/dashboard/whatsapp");
      } else {
        toast.error("Failed to save business data");
      }
    } catch (error) {
      console.error("Error submitting business data:", error);
      toast.error("An error occurred while creating WhatsappBot");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{STEPS[step]}</h2>
          <div className="mt-4">
            <Progress value={progress} className="w-full h-2" />
          </div>
        </div>

        {/* Render Cart for steps 2 and 3 */}
        {step >= 2 ? (
          // Subscription and Payment steps with cart
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-6">
                {step === 2 && (
                  <SubscriptionForm
                    form={subscriptionForm}
                    setSubscriptionLevel={setSubscriptionLevel}
                  />
                )}
                {step === 3 && <PaymentForm form={paymentForm} />}
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-[#EB6C33] hover:bg-[#d55b2a]"
                    disabled={isLoading} // Disable button when loading
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="mr-2">Loading...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      step === STEPS.length - 1 ? "Submit" : "Next"
                    )}
                  </Button>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Cart subscriptionLevel={subscriptionLevel} />
            </div>
          </div>
        ) : (
          // Steps 0 and 1 - full width
          <Card className="w-full mx-auto p-6">
            {step === 0 && <BusinessForm form={businessForm} />}
            {step === 1 && (
              <div className="space-y-6">
                <OtpForm onSubmit={verifyOtp} />
              </div>
            )}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[#EB6C33] hover:bg-[#d55b2a]"
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="mr-2">Loading...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}