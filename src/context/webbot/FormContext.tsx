'use client';

import { WebAdditionalFormValues, WebFormValues, WebPaymentFormValues } from "@/schemas/forms/webbot/form";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for form values
interface FormValues {
  webForm: WebFormValues;
  webAdditionalForm: WebAdditionalFormValues;
  webPaymentForm: WebPaymentFormValues;
}

// Update the context type
interface FormContextType {
  formData: FormValues;
  setFormData: React.Dispatch<React.SetStateAction<FormValues>>;
}

// Create the context with default values
const FormContext = createContext<FormContextType>({
  formData: {
    webForm: {
      clerkId: "",
      businessName: "",
      country: "",
      botName: "",
      websiteUrl: "",
      orgFile: undefined,
      embeddedUrl: "", // New field
      s3Url: "", // New field
    },
    webAdditionalForm: {
      logo: undefined,
      selectedColor: "",
      quickButtons: [],
      newQuickButton: "",
      faqs: [],
      newFaq: undefined,
    },
    webPaymentForm: {
      email: "",
      phoneNumber: "",
      address: "",
    },
  },
  setFormData: () => {},
});

interface FormProviderProps {
  children: ReactNode;
}

// Create a provider component
export const FormProvider = ({ children }: FormProviderProps) => {
  const [formData, setFormData] = useState<FormValues>({
    webForm: {
      clerkId: "",
      businessName: "",
      country: "",
      botName: "",
      websiteUrl: "",
      orgFile: undefined,
      embeddedUrl: "", // New field
      s3Url: "", // New field
    },
    webAdditionalForm: {
      logo: undefined,
      selectedColor: "",
      quickButtons: [],
      newQuickButton: "",
      faqs: [],
      newFaq: undefined,
    },
    webPaymentForm: {
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useWebFormContext = () => {
  return useContext(FormContext);
};