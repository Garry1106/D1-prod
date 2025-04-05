"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/forms/Whatsapp/ui/form";
import { Mail, Phone, MapPin } from "lucide-react";
import type { PaymentFormValues } from "@/schemas/forms/whatsapp/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormContext } from "@/context/whatsapp/FormContext";

interface PaymentFormProps {
  form: UseFormReturn<PaymentFormValues>;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentForm({ form }: PaymentFormProps) {
  const router = useRouter();
  const { formData } = useFormContext(); // Access formData from context
 
  return (
    <Form {...form}>
      <form
       
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Billing Address
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter billing address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
}