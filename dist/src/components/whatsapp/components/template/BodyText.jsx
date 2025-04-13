"use strict";
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
const react_1 = __importStar(require("react"));
const fa_1 = require("react-icons/fa");
const BodyText = ({ bodyText, setBodyText, activeMediaTab, headerText, mediaFile, footerText, buttons, templateName, }) => {
    const editableRef = (0, react_1.useRef)(null);
    const [placeholder, setPlaceholder] = (0, react_1.useState)("Enter message body");
    // Function to replace the content of the input box
    const replaceContent = (text) => {
        const editable = editableRef.current;
        if (!editable)
            return;
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
    (0, react_1.useEffect)(() => {
        const editable = editableRef.current;
        if (!editable)
            return;
        const handleInput = () => {
            setBodyText(editable.innerText);
        };
        editable.addEventListener("input", handleInput);
        return () => editable.removeEventListener("input", handleInput);
    }, [setBodyText]);
    return (<div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Body
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={handleAddBold}>
          <fa_1.FaBold className="text-sm"/>
        </button>
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={handleAddItalic}>
          <fa_1.FaItalic className="text-sm"/>
        </button>
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={handleAddStrikethrough}>
          <s>S</s>
        </button>
      </div>
      <div ref={editableRef} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" contentEditable data-placeholder={placeholder} // Use the placeholder state
    ></div>
      <p className="text-xs text-gray-500 mt-2">
        {bodyText.length}/1024 characters
      </p>
    </div>);
};
exports.default = BodyText;
