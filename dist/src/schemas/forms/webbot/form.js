"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPaymentSchema = exports.webFormSchema = exports.WebAdditionalFormSchema = void 0;
const zod_1 = require("zod");
// Schema for the WebAdditionalForm
exports.WebAdditionalFormSchema = zod_1.z.object({
    logo: zod_1.z.instanceof(File).optional(),
    selectedColor: zod_1.z.string().min(1, 'Color is required'),
    quickButtons: zod_1.z.array(zod_1.z.string()).default([]), // Ensure quickButtons is always an array
    newQuickButton: zod_1.z.string().optional(),
    faqs: zod_1.z.array(zod_1.z.object({
        question: zod_1.z.string().min(1, 'Question is required'),
        answer: zod_1.z.string().min(1, 'Answer is required'),
    })).max(5, 'Maximum of 5 FAQs allowed'),
    newFaq: zod_1.z.object({
        question: zod_1.z.string().optional(),
        answer: zod_1.z.string().optional(),
    }).optional(),
});
// Schema for the WebForm
exports.webFormSchema = zod_1.z.object({
    clerkId: zod_1.z.string().min(1),
    businessName: zod_1.z.string().min(1, "Business name is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    botName: zod_1.z.string().min(1, "Bot name is required"),
    websiteUrl: zod_1.z.string().url("Invalid URL format").optional(), // Optional field
    orgFile: zod_1.z.instanceof(File).optional(), // Optional field
    embeddedUrl: zod_1.z.string().url("Invalid URL format").optional(), // New optional field
    s3Url: zod_1.z.string().url("Invalid URL format").optional(), // New optional field
})
    .refine((data) => data.websiteUrl || data.orgFile || data.embeddedUrl || data.s3Url, // At least one of these fields is required
{
    message: "Either a website URL, embedded URL, S3 URL, or a file upload is required",
    path: ["websiteUrl"], // Highlight the websiteUrl field if validation fails
});
// Schema for the Payment Form
exports.WebPaymentSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    phoneNumber: zod_1.z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    address: zod_1.z
        .string()
        .min(1, "Address is required")
        .max(200, "Address must not exceed 200 characters"),
});
