import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface ButtonsSectionProps {
  buttons: {
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }[];
  setButtons: (
    buttons: {
      type: string;
      text: string;
      url?: string;
      phone_number?: string;
    }[]
  ) => void;
}

const ButtonsSection: React.FC<ButtonsSectionProps> = ({
  buttons,
  setButtons,
}) => {
  const [showButtonForm, setShowButtonForm] = useState(false);
  const [buttonForm, setButtonForm] = useState({
    type: "",
    text: "",
    url: "",
    phone_number: "",
  });
  const [websiteError, setWebsiteError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleAddButton = () => {
    // Validate URL for "url" type
    if (buttonForm.type === "url" && !isValidUrl(buttonForm.url)) {
      setWebsiteError("Please enter a valid URL (e.g., https://example.com).");
      return;
    }

    // Validate phone number for "phone_number" type
    if (buttonForm.type === "phone_number") {
      if (!buttonForm.phone_number) {
        setPhoneError("Phone number is required.");
        return;
      }
      if (!isValidPhoneNumber(buttonForm.phone_number)) {
        setPhoneError("Please enter a valid phone number.");
        return;
      }
    }

    // Create a new button object with only the necessary fields
    const newButton = {
      type: buttonForm.type,
      text: buttonForm.text,
      ...(buttonForm.type === "url" && { url: buttonForm.url }), // Include URL only for "url" type
      ...(buttonForm.type === "phone_number" && {
        phone_number: buttonForm.phone_number, // Include phone_number only for "phone_number" type
      }),
    };

    // Add the new button to the list
    setButtons([...buttons, newButton]);

    // Reset the form
    setButtonForm({
      type: "",
      text: "",
      url: "",
      phone_number: "",
    });
    setShowButtonForm(false);
    setWebsiteError("");
    setPhoneError("");
  };

  const handleRemoveButton = (index: number) => {
    const newButtons = buttons.filter((_, i) => i !== index);
    setButtons(newButtons);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    // Simple validation for phone number (e.g., +1234567890)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phoneNumber);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buttons
      </label>
      <button
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        onClick={() => setShowButtonForm(!showButtonForm)}
      >
        <FaPlus className="mr-2 text-sm" />
        <span>Add Button</span>
      </button>
      {showButtonForm && (
        <div className="mt-4 space-y-4">
          {/* Button Type Selection */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={buttonForm.type}
            onChange={(e) =>
              setButtonForm({
                ...buttonForm,
                type: e.target.value,
                url: "",
                phone_number: "",
              })
            }
          >
            <option value="">Select Type</option>
            <option value="quick_reply">Quick Reply</option>
            <option value="url">Website URL</option>
            <option value="phone_number">Phone Number</option>
          </select>

          {/* Button Text Input */}
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Button Text"
            value={buttonForm.text}
            onChange={(e) =>
              setButtonForm({ ...buttonForm, text: e.target.value })
            }
          />

          {/* URL Input (for Website URL buttons) */}
          {buttonForm.type === "url" && (
            <>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Website URL"
                value={buttonForm.url}
                onChange={(e) => {
                  setButtonForm({ ...buttonForm, url: e.target.value });
                  setWebsiteError("");
                }}
              />
              {websiteError && (
                <p className="text-xs text-red-500 mt-2">{websiteError}</p>
              )}
            </>
          )}

          {/* Phone Number Input (for Phone Number buttons) */}
          {buttonForm.type === "phone_number" && (
            <>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Phone Number (e.g., +1234567890)"
                value={buttonForm.phone_number}
                onChange={(e) => {
                  setButtonForm({
                    ...buttonForm,
                    phone_number: e.target.value,
                  });
                  setPhoneError("");
                }}
              />
              {phoneError && (
                <p className="text-xs text-red-500 mt-2">{phoneError}</p>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              onClick={() => setShowButtonForm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              onClick={handleAddButton}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="mt-4">
        {buttons.map((button, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200 mb-2 text-sm flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Type:</strong> {button.type}
              </p>
              <p>
                <strong>Text:</strong> {button.text}
              </p>
              {button.type === "url" && (
                <p>
                  <strong>URL:</strong> {button.url}
                </p>
              )}
              {button.type === "phone_number" && (
                <p>
                  <strong>Phone Number:</strong> {button.phone_number}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => handleRemoveButton(index)}
              >
                <FaTrash className="text-sm text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonsSection;
