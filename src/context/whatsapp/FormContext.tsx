'use client';

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for form values
interface FormValues {
  business: {
    clerkId: string;
    businessName: string;
    waba_id:string,
    displayPhoneNumber: string;
    phoneNumberId: string;
    accessToken: string;
    appId: string;
    appSecret: string;
    role: string;
    country: string;
    currency: string;
    botName: string;
    language: string;
    ttsGender: string;
  };
  subscription: {
    subscriptionLevel: "Basic" | "Standard" | "Premium" | undefined;
    price?: string;
    subscriptionExpiry?: string; // Add subscription expiry field
    features?: {
      text: boolean;
      tts: boolean;
      aiResponse: boolean;
      image: boolean;
      audio: boolean;
      document: boolean;
      video?: boolean;
      sticker?: boolean;
      interactive?: boolean;
      retrieval?: boolean;
    };
    limits?: {
      messagesCount: number | "Unlimited";
      ttsCount: number | "Unlimited";
      imagesCount: number | "Unlimited";
      audiosCount: number | "Unlimited";
      documentsCount: number | "Unlimited";
      videosCount?: number | "Unlimited";
    };
  };
  payment: {
    email: string;
    billingAddress: string;
    paymentPhone: string;
  };
}

// Update the context type to include `updateSubscription`
interface FormContextType {
  formData: FormValues;
  setFormData: React.Dispatch<React.SetStateAction<FormValues>>;
  updateSubscription: (
    subscriptionLevel: "Basic" | "Standard" | "Premium" | undefined,
    subscriptionExpiry?: string // Add subscription expiry as an optional parameter
  ) => void;
}

// Create the context with default values, including `updateSubscription`
const FormContext = createContext<FormContextType>({
  formData: {
    business: {
      clerkId: "",
      businessName: "",
      waba_id:"",
      displayPhoneNumber: "",
      phoneNumberId: "",
      accessToken: "",
      appId: "",
      appSecret: "",
      role: "",
      country: "",
      currency: "",
      botName: "",
      language: "",
      ttsGender: "",
    },
    subscription: {
      subscriptionLevel: undefined,
      price: undefined,
      subscriptionExpiry: undefined, // Add subscription expiry field
      features: undefined,
      limits: undefined,
    },
    payment: {
      email: "",
      billingAddress: "",
      paymentPhone: "",
    },
  },
  setFormData: () => {},
  updateSubscription: () => {},
});

interface FormProviderProps {
  children: ReactNode;
}

// Create a provider component
export const FormProvider = ({ children }: FormProviderProps) => {
  const [formData, setFormData] = useState<FormValues>({
    business: {
      clerkId: "",
      businessName: "",
      waba_id:"",
      displayPhoneNumber: "",
      phoneNumberId: "",
      accessToken: "",
      appId: "",
      appSecret: "",
      role: "",
      country: "",
      currency: "",
      botName: "",
      language: "",
      ttsGender: "",
    },
    subscription: {
      subscriptionLevel: undefined,
      price: undefined,
      subscriptionExpiry: undefined, // Add subscription expiry field
      features: undefined,
      limits: undefined,
    },
    payment: {
      email: "",
      billingAddress: "",
      paymentPhone: "",
    },
  });

  // Function to update subscription level, price, features, limits, and expiry
  const updateSubscription = (
    subscriptionLevel: 'Basic' | 'Standard' | 'Premium' | undefined,
    subscriptionExpiry?: string // Add subscription expiry as an optional parameter
  ) => {
    const price = getPrice(subscriptionLevel); // Get price based on subscription level
    const features = getFeatures(subscriptionLevel); // Get features based on subscription level
    const limits = getLimits(subscriptionLevel); // Get limits based on subscription level

    // Validate subscriptionExpiry format
    if (subscriptionExpiry && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(subscriptionExpiry)) {
      console.error("Invalid subscriptionExpiry format:", subscriptionExpiry);
      return;
    }

    // Update the form data context with features, limits, subscription level, and expiry
    setFormData((prevState) => ({
      ...prevState,
      subscription: {
        ...prevState.subscription,
        subscriptionLevel,
        price,
        subscriptionExpiry, // Update subscription expiry
        features, // Update features
        limits, // Update limits
      },
    }));
  };

  // Function to get the price based on subscription level
  const getPrice = (subscriptionLevel: "Basic" | "Standard" | "Premium" | undefined): string | undefined => {
    switch (subscriptionLevel) {
      case "Basic":
        return "₹749/month";
      case "Standard":
        return "₹1499/month";
      case "Premium":
        return "₹2499/month";
      default:
        return undefined;
    }
  };

  // Function to get the features based on subscription level
  const getFeatures = (subscriptionLevel: "Basic" | "Standard" | "Premium" | undefined) => {
    switch (subscriptionLevel) {
      case "Basic":
        return {
          text: true,
          tts: true,
          aiResponse: true,
          image: true,
          audio: true,
          document: true,
          video: false,
          sticker: false,
          interactive: false,
          retrieval: false,
        };
      case "Standard":
        return {
          text: true,
          tts: true,
          aiResponse: true,
          image: true,
          audio: true,
          document: true,
          video: true,
          sticker: true,
          interactive: false,
          retrieval: false,
        };
      case "Premium":
        return {
          text: true,
          tts: true,
          aiResponse: true,
          image: true,
          audio: true,
          document: true,
          video: true,
          sticker: true,
          interactive: true,
          retrieval: true,
        };
      default:
        return undefined;
    }
  };

  // Function to get the limits based on subscription level
  const getLimits = (
    subscriptionLevel: "Basic" | "Standard" | "Premium" | undefined
  ): {
    messagesCount: number | "Unlimited";
    ttsCount: number | "Unlimited";
    imagesCount: number | "Unlimited";
    audiosCount: number | "Unlimited";
    documentsCount: number | "Unlimited";
    videosCount?: number | "Unlimited";
  } | undefined => {
    switch (subscriptionLevel) {
      case "Basic":
        return {
          messagesCount: 200,
          ttsCount: 50,
          imagesCount: 100,
          audiosCount: 50,
          documentsCount: 50,
          videosCount: 0,
        };
      case "Standard":
        return {
          messagesCount: 500,
          ttsCount: 100,
          imagesCount: 300,
          audiosCount: 100,
          documentsCount: 100,
          videosCount: 50,
        };
      case "Premium":
        return {
          messagesCount: "Unlimited",
          ttsCount: "Unlimited",
          imagesCount: "Unlimited",
          audiosCount: "Unlimited",
          documentsCount: "Unlimited",
          videosCount: "Unlimited",
        };
      default:
        return undefined;
    }
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, updateSubscription }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = () => {
  return useContext(FormContext);
};