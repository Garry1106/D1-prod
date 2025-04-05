// components/SuccessMessage.tsx

import React from 'react';
import { Button } from '@/components/ui/button';

interface SuccessMessageProps {
  orderNumber: string;
  name: string;
  address: string;
  paymentMethod: string;
  cardNumber: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ orderNumber, name, address, paymentMethod, cardNumber }) => {
  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <div className="flex items-center space-x-2 bg-green-600 w-4 h-4">
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold">We received your order!</h2>
      <p className="text-lg border-b-2">Your order #{orderNumber} is completed and ready to ship</p>

      <div className="flex items-center justify-start space-x-16">
        <div>
          <h3 className="font-semibold">Shipping Address</h3>
          <p>{name}</p>
          <p>{address}</p>
        </div>

        <div>
          <h3 className="font-semibold">Payment Info</h3>
          <p>{paymentMethod}</p>
          <p>{cardNumber}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="px-6 py-2">
          View invoice
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
