"use strict";
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
exports.paymentFormSchema = exports.subscriptionFormSchema = exports.businessFormSchema = void 0;
const z = __importStar(require("zod"));
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.businessFormSchema = z.object({
    clerkId: z.string(),
    businessName: z.string().min(1, "Business Name is required"),
    waba_id: z.string().min(1, "WABA_Id required"),
    botName: z.string().min(1, "Botname is required"),
    country: z.string().min(1, "Country is required"),
    language: z.string().min(1, "Language is required"),
    ttsGender: z.string().min(1, "Gender is Required"),
    displayPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    phoneNumberId: z.string().min(1, "Phone Number ID is required"),
    accessToken: z.string().min(1, "Access Token is required"),
    appId: z.string().min(1, "App ID is required"),
    appSecret: z.string().min(1, "App Secret is required"),
    role: z.string().min(1, "Please select an option"),
    currency: z.string().min(1, "Currency is required"), // Add the currency field
});
exports.subscriptionFormSchema = z.object({
    subscriptionLevel: z.enum(["Basic", "Standard", "Premium"], {
        required_error: "Please select a subscription level",
    }),
    subscriptionExpiry: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, "Subscription expiry must be in the format 'YYYY-MM-DDTHH:mm:ss.sssZ'"),
    price: z.string().optional(), // Optional, as price is derived from the subscription level
    features: z
        .object({
        text: z.boolean(),
        tts: z.boolean(),
        aiResponse: z.boolean(),
        image: z.boolean(),
        audio: z.boolean(),
        document: z.boolean(),
        video: z.boolean().optional(),
        sticker: z.boolean().optional(),
        interactive: z.boolean().optional(),
        retrieval: z.boolean().optional(),
    })
        .optional(),
    limits: z
        .object({
        messagesCount: z.union([z.number(), z.literal("Unlimited")]),
        ttsCount: z.union([z.number(), z.literal("Unlimited")]),
        imagesCount: z.union([z.number(), z.literal("Unlimited")]),
        audiosCount: z.union([z.number(), z.literal("Unlimited")]),
        documentsCount: z.union([z.number(), z.literal("Unlimited")]),
        videosCount: z.union([z.number(), z.literal("Unlimited")]).optional(),
    })
        .optional(),
});
exports.paymentFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    billingAddress: z.string().min(1, "Billing address is required"),
    paymentPhone: z.string().min(10, "Phone number must be at least 10 digits"),
});
