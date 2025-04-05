"use client"

import { useState } from "react"; // Import useState to manage button click state
import { useFormContext } from "@/context/whatsapp/FormContext"; // Import the context hook
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/forms/Whatsapp/ui/form";
import { Phone, Key, File, Building2 } from "lucide-react";
import type { BusinessFormValues } from "@/schemas/forms/whatsapp/form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface BusinessFormProps {
  form: UseFormReturn<BusinessFormValues>;
}

// Country data with phone codes
const countries = [
  { code: "US", name: "United States", phoneCode: "+1", currency: "USD" },
  { code: "IN", name: "India", phoneCode: "+91", currency: "INR" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44", currency: "GBP" },
  { code: "CA", name: "Canada", phoneCode: "+1", currency: "CAD" },
  { code: "AU", name: "Australia", phoneCode: "+61", currency: "AUD" },
  // Add more countries as needed
];

// Language options
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  // Add more languages as needed
];

// Gender options
const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function BusinessForm({ form }: BusinessFormProps) {
  const { formData, setFormData } = useFormContext(); // Get form data and setter from context
  const [isButtonClicked, setIsButtonClicked] = useState(false); // Track if the button was clicked
  const [phoneCode, setPhoneCode] = useState(""); // Track the selected country's phone code

  // Handle button click to enable inputs and make API call
  const handleCreateWebhook = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent page refresh
    setIsButtonClicked(true); // Enable the inputs when the button is clicked

    // Extract the required fields from formData
    const { phoneNumberId, appId, appSecret, accessToken } = formData.business;
    console.log(phoneNumberId);
    console.log(appId);
    console.log(appSecret);

    try {
      // Make the API call
      const response = await fetch("/api/Whatsapp/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumberId,
          appId,
          appSecret,
          accessToken,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to configure webhook");
      }

      const data = await response.json();
      console.log("Webhook Created:", data);
      toast.success("Webhook Created Successfully");
    } catch (error) {
      console.error("Error creating webhook:", error);
      toast.error("Failed to create webhook");
    }
  };

  // Handle country selection
  const handleCountryChange = (value: string) => {
    const selectedCountry = countries.find((country) => country.code === value);
    if (selectedCountry) {
      setPhoneCode(selectedCountry.phoneCode);
      form.setValue("displayPhoneNumber", selectedCountry.phoneCode); // Prefill phone number with country code
      form.setValue("currency", selectedCountry.currency); // Update the currency field in the form
      setFormData((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          country: selectedCountry.code, // Update the country field
          currency: selectedCountry.currency, // Update the currency field
        },
      }));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Business Name Field */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Business Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter business name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          businessName: e.target.value,
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bot Name Field */}
          <FormField
            control={form.control}
            name="botName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter bot name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          botName: e.target.value,
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country Select Field */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCountryChange(value); // Call the updated handler
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.phoneCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="displayPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: +919999999999"
                    {...field}
                    value={field.value || phoneCode} // Prefill with phone code
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ensure the phone number starts with the selected country code
                      if (value.startsWith(phoneCode)) {
                        field.onChange(value);
                        setFormData((prev) => ({
                          ...prev,
                          business: {
                            ...prev.business,
                            phoneNumber: value,
                          },
                        }));
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender Select Field */}
          <FormField
            control={form.control}
            name="ttsGender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot's Gender</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData((prev) => ({
                      ...prev,
                      business: {
                        ...prev.business,
                        ttsGender: value, // Update the gender field in FormContext
                      },
                    }));
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Language Select Field */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData((prev) => ({
                      ...prev,
                      business: {
                        ...prev.business,
                        language: value, // Update the language field in FormContext
                      },
                    }));
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number ID Field */}
          <FormField
            control={form.control}
            name="phoneNumberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number ID"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          phoneNumberId: e.target.value,
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Access Token Field */}
          <FormField
            control={form.control}
            name="accessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Access Token
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter access token"
                    type="password"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          accessToken: e.target.value,
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* App Secret Field */}
          <FormField
            control={form.control}
            name="appSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Secret</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter App secret"
                    type="password"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          appSecret: e.target.value,
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* App ID Field */}
          <FormField
            control={form.control}
            name="appId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter app ID"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          appId: e.target.value,
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* WABA ID Field */}
          <FormField
            control={form.control}
            name="waba_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WaBa ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter WaBa ID"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        business: {
                          ...prev.business,
                          waba_id: e.target.value, // Update the WABA_id field in FormContext
                        },
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button to Create Webhook */}
          <Button
            type="button"
            onClick={handleCreateWebhook} // Handle button click
            className="bg-[#EB6C33] hover:bg-[#d55b2a] text-white rounded-md"
          >
            Create Webhook
          </Button>

          {/* Select Option Field (Disabled until button is clicked) */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role of Bot</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value); // Update the form control
                    setFormData((prev) => ({
                      ...prev,
                      business: {
                        ...prev.business,
                        role: value, // Update the selectOption field in FormContext
                      },
                    }));
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Assitant">Assitant</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}