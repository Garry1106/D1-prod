"use strict";
// components/SuccessMessage.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const button_1 = require("@/components/ui/button");
const SuccessMessage = ({ orderNumber, name, address, paymentMethod, cardNumber }) => {
    return (<div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <div className="flex items-center space-x-2 bg-green-600 w-4 h-4">
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
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
        <button_1.Button variant="outline" className="px-6 py-2">
          View invoice
        </button_1.Button>
      </div>
    </div>);
};
exports.default = SuccessMessage;
