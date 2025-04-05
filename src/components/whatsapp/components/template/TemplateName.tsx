import React from "react";

interface TemplateNameInputProps {
  templateName: string;
  setTemplateName: (name: string) => void;
}

const TemplateNameInput: React.FC<TemplateNameInputProps> = ({
  templateName,
  setTemplateName,
}) => {
  const maxLength = 100; // Maximum allowed characters for the template name

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.toLowerCase(); // Convert input to lowercase

    // Replace spaces with underscores
    inputValue = inputValue.replace(/\s+/g, "_");

    // Ensure the input does not exceed the maximum length
    if (inputValue.length <= maxLength) {
      setTemplateName(inputValue);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Template Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Enter template name (use _ instead of spaces)"
        value={templateName}
        onChange={handleInputChange}
        maxLength={maxLength} // Enforces the maximum length in the input field
        required // Makes the input field required
      />
      <p className="text-xs text-gray-500 mt-2">
        {templateName.length}/{maxLength} characters
      </p>
      <p className="text-xs text-gray-500 mt-2 italic">{templateName}</p>
    </div>
  );
};

export default TemplateNameInput;
