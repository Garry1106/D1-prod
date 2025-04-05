import React, { useState, useRef, useEffect } from "react";
import { FaBold, FaItalic } from "react-icons/fa";
import PreviewPane from "./PreviewPane"; // Import the PreviewPane component

interface BodyTextProps {
  bodyText: string;
  setBodyText: (text: string) => void;
  activeMediaTab: "none" | "text" | "image" | "video" | "document";
  headerText: string;
  mediaFile: File | null;
  footerText: string;
  buttons: { type: string; text: string; url?: string; offerCode?: string }[];
  templateName: string;
}

const BodyText: React.FC<BodyTextProps> = ({
  bodyText,
  setBodyText,
  activeMediaTab,
  headerText,
  mediaFile,
  footerText,
  buttons,
  templateName,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const [placeholder, setPlaceholder] = useState("Enter message body");

  // Function to replace the content of the input box
  const replaceContent = (text: string) => {
    const editable = editableRef.current;
    if (!editable) return;

    // Replace the content of the input box
    editable.innerText = text;

    // Update the body text state
    setBodyText(text);
  };

  // Handle adding bold text
  const handleAddBold = () => {
    replaceContent("*Enter your bold text here*");
  };

  // Handle adding italic text
  const handleAddItalic = () => {
    replaceContent("_Enter your italic text here_");
  };

  // Handle adding strikethrough text
  const handleAddStrikethrough = () => {
    replaceContent("~Enter your strikethrough text here~");
  };

  // Update the body text state when the contenteditable div changes
  useEffect(() => {
    const editable = editableRef.current;
    if (!editable) return;

    const handleInput = () => {
      setBodyText(editable.innerText);
    };

    editable.addEventListener("input", handleInput);
    return () => editable.removeEventListener("input", handleInput);
  }, [setBodyText]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Body
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <button
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={handleAddBold}
        >
          <FaBold className="text-sm" />
        </button>
        <button
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={handleAddItalic}
        >
          <FaItalic className="text-sm" />
        </button>
        <button
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={handleAddStrikethrough}
        >
          <s>S</s>
        </button>
      </div>
      <div
        ref={editableRef}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        contentEditable
        data-placeholder={placeholder} // Use the placeholder state
      ></div>
      <p className="text-xs text-gray-500 mt-2">
        {bodyText.length}/1024 characters
      </p>
    </div>
  );
};

export default BodyText;
