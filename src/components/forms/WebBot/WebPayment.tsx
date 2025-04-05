// components/PaymentForm.tsx
"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useWebFormContext } from '@/context/webbot/FormContext'; // Adjust the import path accordingly

type PaymentFormProps = {
  onPrevious: () => void;
  onSubmit: () => Promise<void>;
};

export const WebPayment = ({ onPrevious, onSubmit }: PaymentFormProps) => {
  const { formData, setFormData } = useWebFormContext(); // Access form data and setFormData from context

  const [email, setEmail] = useState<string>(formData.webPaymentForm.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(formData.webPaymentForm.phoneNumber);
  const [address, setAddress] = useState<string>(formData.webPaymentForm.address);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setFormData((prevData) => ({
      ...prevData,
      webPaymentForm: {
        ...prevData.webPaymentForm,
        email: value,
      },
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setFormData((prevData) => ({
      ...prevData,
      webPaymentForm: {
        ...prevData.webPaymentForm,
        phoneNumber: value,
      },
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setFormData((prevData) => ({
      ...prevData,
      webPaymentForm: {
        ...prevData.webPaymentForm,
        address: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(); // Call the onSubmit function passed as a prop
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#EB6C33]">Payment Information</h2>

      {/* Email Field */}
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EB6C33] focus:ring-[#EB6C33] sm:text-sm"
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EB6C33] focus:ring-[#EB6C33] sm:text-sm"
          placeholder="Enter your phone number"
          required
        />
      </div>

      {/* Address Field */}
      <div>
        <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={handleAddressChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EB6C33] focus:ring-[#EB6C33] sm:text-sm"
          placeholder="Enter your address"
          required
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          className="bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={handleSubmit} // Use handleSubmit to handle form submission
        >
          Submit
        </Button>
      </div>
    </div>
  );
};