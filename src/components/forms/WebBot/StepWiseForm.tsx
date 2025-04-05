'use client';

import React, { useState, useEffect } from 'react';
import { WebForm } from './WebForm';
import { WebPayment } from './WebPayment';
import { WebAdditionalForm } from './WebAdditionalForm'; // Import the new form component
import { FaCheck, FaFileAlt, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import Cart from './Cart'; // Import the Cart component
import { SubscriptionName } from '@/constants/pricing'; // Import the SubscriptionTier type
import { useWebFormContext } from '@/context/webbot/FormContext'; // Adjust the import path accordingly
import { useUserDetails } from '@/hooks/user/use-user'; // Adjust the import path accordingly
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const StepwiseForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subscriptionLevel, setSubscriptionLevel] = useState<SubscriptionName | undefined>(undefined);
  const { formData, setFormData } = useWebFormContext(); // Access form data and setFormData from context
  const { updateUserAndProduct, userDetails } = useUserDetails(); // Access user details

  // Add Clerk ID to formData when step is 1 and userDetails is available
  useEffect(() => {
    if (step === 1 && userDetails?.clerkId) {
      setFormData((prevData) => ({
        ...prevData,
        webForm: {
          ...prevData.webForm,
          clerkId: userDetails.clerkId, // Update clerkId in webForm
        },
      }));
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

        toast.success("WhatsappBot is Successfully created!");
        router.push("/console/dashboard/webbot");
      } else {
        toast.error("Failed to save business data");
      }
    } catch (error) {
      console.error("Error submitting business data:", error);
      toast.error("An error occurred while creating WhatsappBot");
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
    { id: 1, label: 'Form Details', icon: <FaFileAlt /> },
    { id: 2, label: 'Additional Info', icon: <FaInfoCircle /> }, // New step for additional form
    { id: 3, label: 'Payment', icon: <FaCreditCard /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Centered Heading and Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#EB6C33]">Website Chatbot Setup</h1>
          <p className="text-gray-600">Please fill out the form to set up your Website Chatbot.</p>
        </div>

        {/* Centered Step Counter */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center max-w-3xl w-full">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.id}>
                <div className="flex flex-col items-center gap-1">
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step === stepItem.id
                        ? 'bg-[#EB6C33] text-white'
                        : step > stepItem.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {step > stepItem.id ? <FaCheck /> : stepItem.icon}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-sm font-medium ${step === stepItem.id ? 'text-[#EB6C33]' : 'text-gray-600'
                      }`}
                  >
                    {stepItem.label}
                  </span>
                </div>
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${step > stepItem.id ? 'bg-[#EB6C33]' : 'bg-gray-200'
                      }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Steps and Cart */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Steps */}
          <div className={step === 1 || step === 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
            {step === 1 && <WebForm onNext={handleNext} />}
            {step === 2 && (
              <WebAdditionalForm
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            {step === 3 && <WebPayment onSubmit={handleSubmit} onPrevious={handlePrevious} />}
          </div>

          {/* Cart Component (Visible when step > 2) */}
          {step > 2 && ( // Updated condition to render Cart only after step 2
            <div className="lg:col-span-1">
              <Cart subscriptionLevel={subscriptionLevel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};