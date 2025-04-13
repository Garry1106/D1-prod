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
exports.useWebFormContext = exports.FormProvider = void 0;
const react_1 = __importStar(require("react"));
// Create the context with default values
const FormContext = (0, react_1.createContext)({
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
    setFormData: () => { },
});
// Create a provider component
const FormProvider = ({ children }) => {
    const [formData, setFormData] = (0, react_1.useState)({
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
    return (<FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>);
};
exports.FormProvider = FormProvider;
// Custom hook to use the form context
const useWebFormContext = () => {
    return (0, react_1.useContext)(FormContext);
};
exports.useWebFormContext = useWebFormContext;
