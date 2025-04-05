import React from "react";

interface FooterInputProps {
  footerText: string;
  setFooterText: (text: string) => void;
}

const FooterInput: React.FC<FooterInputProps> = ({
  footerText,
  setFooterText,
}) => {
  const maxLength = 60; // Maximum allowed characters

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove emojis using a regular expression
    const textWithoutEmojis = inputValue.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/gu,
      ""
    );

    // Ensure the text does not exceed the maximum length
    if (textWithoutEmojis.length <= maxLength) {
      setFooterText(textWithoutEmojis);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Footer (Optional)
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Enter footer text"
        value={footerText}
        onChange={handleInputChange}
        maxLength={maxLength} // Enforces the maximum length in the input field
      />
      <p className="text-xs text-gray-500 mt-2">
        {footerText.length}/{maxLength} characters
      </p>
      <p className="text-xs text-gray-500 mt-2 italic">{footerText}</p>
    </div>
  );
};

export default FooterInput;
