import { language } from "googleapis/build/src/apis/language";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


export const businessFormSchema = z.object({
  clerkId:z.string(),
  businessName: z.string().min(1, "Business Name is required"),
  waba_id:z.string().min(1,"WABA_Id required"),
  botName: z.string().min(1, "Botname is required"),
  country: z.string().min(1, "Country is required"),
  language:z.string().min(1, "Language is required"),
  ttsGender:z.string().min(1, "Gender is Required"),
  displayPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  phoneNumberId: z.string().min(1, "Phone Number ID is required"),
  accessToken: z.string().min(1, "Access Token is required"),
  appId: z.string().min(1, "App ID is required"),
  appSecret: z.string().min(1, "App Secret is required"),
  role: z.string().min(1, "Please select an option"),
  currency: z.string().min(1, "Currency is required"), // Add the currency field
});



export const subscriptionFormSchema = z.object({
  subscriptionLevel: z.enum(["Basic", "Standard", "Premium"], {
    required_error: "Please select a subscription level",
  }),
  subscriptionExpiry: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      "Subscription expiry must be in the format 'YYYY-MM-DDTHH:mm:ss.sssZ'"
    ),
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

export const paymentFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  billingAddress: z.string().min(1, "Billing address is required"),
  paymentPhone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;
export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;