"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fa_1 = require("react-icons/fa");
const TemplateName_1 = __importDefault(require("@/components/whatsapp/components/template/TemplateName")); // Import the TemplateNameInput component
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const Step1 = ({ onNext, selectedCategory, setSelectedCategory, templateLanguage, setTemplateLanguage, templateName, // Destructure templateName
setTemplateName, // Destructure setTemplateName
 }) => {
    return (<div className="flex flex-col lg:flex-row gap-6">
      {/* Left Pane - Form (70% on PCs, 100% on smaller screens) */}
      <div className="w-full lg:w-[60%]">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Set up your template
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          Configure your message template settings.{" "}
          <a href="#" className="text-[#41b658] hover:underline">
            Learn more about templates
          </a>
        </p>

        {/* Template Category Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Category
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className={`flex items-center justify-center w-full sm:w-1/2 p-3 border rounded-lg transition-colors ${selectedCategory === "Marketing"
            ? "border-[#41b658] bg-[#41b658]/10"
            : "border-gray-300 bg-white"}`} onClick={() => setSelectedCategory("Marketing")}>
              <fa_1.FaBullhorn className={`text-lg md:text-xl mr-2 ${selectedCategory === "Marketing"
            ? "text-[#41b658]"
            : "text-gray-700"}`}/>
              <span className={`text-sm font-medium ${selectedCategory === "Marketing"
            ? "text-[#41b658]"
            : "text-gray-700"}`}>
                Marketing
              </span>
            </button>
            <button className={`flex items-center justify-center w-full sm:w-1/2 p-3 border rounded-lg transition-colors ${selectedCategory === "Utility"
            ? "border-[#41b658] bg-[#41b658]/10"
            : "border-gray-300 bg-white"}`} onClick={() => setSelectedCategory("Utility")}>
              <fa_1.FaTools className={`text-lg md:text-xl mr-2 ${selectedCategory === "Utility"
            ? "text-[#41b658]"
            : "text-gray-700"}`}/>
              <span className={`text-sm font-medium ${selectedCategory === "Utility"
            ? "text-[#41b658]"
            : "text-gray-700"}`}>
                Utility
              </span>
            </button>
          </div>
        </div>

        {/* Template Language Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Language
          </label>
          <select className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41b658]" value={templateLanguage} onChange={(e) => setTemplateLanguage(e.target.value)}>
            <option value="en_US">English (US)</option>
            <option value="en_GB">English (UK)</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Template Name Input */}
        <TemplateName_1.default templateName={templateName} setTemplateName={setTemplateName}/>

        {/* Next Button */}
        <div className="flex justify-end">
          <button onClick={onNext} className="bg-[#41b658] text-white px-5 py-2 rounded-lg hover:bg-[#36934d] transition-colors text-sm md:text-base">
            Next
          </button>
        </div>
      </div>

      {/* Right Pane - Preview Panel (30% on PCs, 100% on smaller screens) */}
      <div className="w-full lg:w-[40%]  rounded-lg">
        <div className="relative mx-auto border-4 border-black rounded-[40px] w-[280px] h-[500px] overflow-hidden bg-white shadow-gray-400 shadow-lg">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black rounded-b-2xl z-10"></div>

          {/* Screen Content */}
          <div className="relative h-full flex flex-col bg-[#f0f2f5] mt-1">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#ffffff] border-b border-gray-200 bt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-600">WA</span>
                </div>
                <div>
                  <p className="text-black font-medium">Template Preview</p>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <lucide_react_1.Phone className="text-gray-500 w-5 h-5"/>
                <lucide_react_1.MoreVertical className="text-gray-500 w-5 h-5"/>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto scrollbar-hide">
              {/* Hardcoded Incoming Message */}
              <div className="flex items-start gap-2">
                <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-sm border border-gray-200">
                  <p className="text-black text-sm break-words">
                    This is a preview of your WhatsApp template. The actual content will
                    appear here once configured.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Input (Placeholder) */}
            <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <lucide_react_1.Smile className="text-gray-500 w-5 h-5"/>
              <input_1.Input className="flex-1 bg-[#f0f2f5] border-none text-black placeholder-gray-500" placeholder="Type a message"/>
              <button_1.Button className="bg-[#25d366] hover:bg-[#32b150]">
                <lucide_react_1.Send className="w-4 h-4 text-white"/>
              </button_1.Button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = Step1;
