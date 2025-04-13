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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormContext = exports.FormProvider = void 0;
const react_1 = __importStar(require("react"));
// Create the context with default values, including `updateSubscription`
const FormContext = (0, react_1.createContext)({
    formData: {
        business: {
            clerkId: "",
            businessName: "",
            waba_id: "",
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
    setFormData: () => { },
    updateSubscription: () => { },
});
// Create a provider component
const FormProvider = ({ children }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        business: {
            clerkId: "",
            businessName: "",
            waba_id: "",
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
    const updateSubscription = (subscriptionLevel, subscriptionExpiry // Add subscription expiry as an optional parameter
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
        setFormData((prevState) => (Object.assign(Object.assign({}, prevState), { subscription: Object.assign(Object.assign({}, prevState.subscription), { subscriptionLevel,
                price,
                subscriptionExpiry, // Update subscription expiry
                features, // Update features
                limits }) })));
    };
    // Function to get the price based on subscription level
    const getPrice = (subscriptionLevel) => {
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
    const getFeatures = (subscriptionLevel) => {
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
    const getLimits = (subscriptionLevel) => {
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
    return (<FormContext.Provider value={{ formData, setFormData, updateSubscription }}>
      {children}
    </FormContext.Provider>);
};
exports.FormProvider = FormProvider;
// Custom hook to use the form context
const useFormContext = () => {
    return (0, react_1.useContext)(FormContext);
};
exports.useFormContext = useFormContext;
