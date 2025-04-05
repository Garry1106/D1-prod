import { z } from 'zod';

// Schema for the WebAdditionalForm
export const WebAdditionalFormSchema = z.object({
  logo: z.instanceof(File).optional(),
  selectedColor: z.string().min(1, 'Color is required'),
  quickButtons: z.array(z.string()).default([]), // Ensure quickButtons is always an array
  newQuickButton: z.string().optional(),
  faqs: z.array(
    z.object({
      question: z.string().min(1, 'Question is required'),
      answer: z.string().min(1, 'Answer is required'),
    })
  ).max(5, 'Maximum of 5 FAQs allowed'),
  newFaq: z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
  }).optional(),
});



// Schema for the WebForm
export const webFormSchema = z.object({
  clerkId: z.string().min(1),
  businessName: z.string().min(1, "Business name is required"),
  country: z.string().min(1, "Country is required"),
  botName: z.string().min(1, "Bot name is required"),
  websiteUrl: z.string().url("Invalid URL format").optional(), // Optional field
  orgFile: z.instanceof(File).optional(), // Optional field
  embeddedUrl: z.string().url("Invalid URL format").optional(), // New optional field
  s3Url: z.string().url("Invalid URL format").optional(), // New optional field
})
.refine(
  (data) => data.websiteUrl || data.orgFile || data.embeddedUrl || data.s3Url, // At least one of these fields is required
  {
    message: "Either a website URL, embedded URL, S3 URL, or a file upload is required",
    path: ["websiteUrl"], // Highlight the websiteUrl field if validation fails
  }
);


// Schema for the Payment Form
export const WebPaymentSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must not exceed 200 characters"),
});

// Infer the types from the schemas
export type WebAdditionalFormValues = z.infer<typeof WebAdditionalFormSchema>;
export type WebFormValues = z.infer<typeof webFormSchema>;
export type WebPaymentFormValues = z.infer<typeof WebPaymentSchema>;