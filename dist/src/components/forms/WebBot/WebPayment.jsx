"use strict";
// components/PaymentForm.tsx
"use client";
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
exports.WebPayment = void 0;
const react_1 = __importStar(require("react"));
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const button_1 = require("@/components/ui/button");
const FormContext_1 = require("@/context/webbot/FormContext"); // Adjust the import path accordingly
const WebPayment = ({ onPrevious, onSubmit }) => {
    const { formData, setFormData } = (0, FormContext_1.useWebFormContext)(); // Access form data and setFormData from context
    const [email, setEmail] = (0, react_1.useState)(formData.webPaymentForm.email);
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)(formData.webPaymentForm.phoneNumber);
    const [address, setAddress] = (0, react_1.useState)(formData.webPaymentForm.address);
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webPaymentForm: Object.assign(Object.assign({}, prevData.webPaymentForm), { email: value }) })));
    };
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webPaymentForm: Object.assign(Object.assign({}, prevData.webPaymentForm), { phoneNumber: value }) })));
    };
    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        setFormData((prevData) => (Object.assign(Object.assign({}, prevData), { webPaymentForm: Object.assign(Object.assign({}, prevData.webPaymentForm), { address: value }) })));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(); // Call the onSubmit function passed as a prop
    };
    return (<div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#EB6C33]">Payment Information</h2>

      {/* Email Field */}
      <div>
        <label_1.Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label_1.Label>
        <input_1.Input id="email" type="email" value={email} onChange={handleEmailChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EB6C33] focus:ring-[#EB6C33] sm:text-sm" placeholder="Enter your email" required/>
      </div>

      {/* Phone Number Field */}
      <div>
        <label_1.Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label_1.Label>
        <input_1.Input id="phoneNumber" type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EB6C33] focus:ring-[#EB6C33] sm:text-sm" placeholder="Enter your phone number" required/>
      </div>

      {/* Address Field */}
      <div>
        <label_1.Label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label_1.Label>
        <input_1.Input id="address" type="text" value={address} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EB6C33] focus:ring-[#EB6C33] sm:text-sm" placeholder="Enter your address" required/>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button_1.Button variant="outline" onClick={onPrevious}>
          Previous
        </button_1.Button>
        <button_1.Button className="bg-[#EB6C33] hover:bg-[#D45A2A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={handleSubmit} // Use handleSubmit to handle form submission
    >
          Submit
        </button_1.Button>
      </div>
    </div>);
};
exports.WebPayment = WebPayment;
