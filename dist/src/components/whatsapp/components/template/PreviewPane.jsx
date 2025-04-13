"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react"); // Assuming you're using Lucide icons
const input_1 = require("@/components/ui/input"); // Assuming you're using a custom Input component
const button_1 = require("@/components/ui/button"); // Assuming you're using a custom Button component
const PreviewPane = ({ activeMediaTab, headerText, bodyText, mediaFile, footerText, buttons, templateName = "", }) => {
    // Function to replace * with <strong> and _ with <em>
    const renderFormattedText = (text) => {
        return text
            .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
            .replace(/_(.*?)_/g, "<em>$1</em>");
    };
    // Function to format phone number for display
    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = phoneNumber.replace(/\D/g, "");
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        else if (cleaned.length === 11 && cleaned[0] === "1") {
            return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        }
        return phoneNumber;
    };
    return (<div className="relative mx-auto border-4 border-black rounded-[40px] w-[300px] h-[550px] overflow-hidden bg-white shadow-gray-400 shadow-lg">
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
          {/* Incoming Message */}
          <div className="flex items-start gap-2">
            <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-sm border border-gray-200">
              {/* Header Section */}
              {activeMediaTab === "text" && headerText && (<p className="text-gray-800 text-sm font-semibold mb-2">
                  {headerText}
                </p>)}
              {activeMediaTab === "image" && mediaFile && (<div className="w-full aspect-[1.91/1] rounded-lg mb-2 overflow-hidden" style={{
                backgroundImage: `url(${URL.createObjectURL(mediaFile)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}/>)}
              {activeMediaTab === "video" && mediaFile && (<video src={URL.createObjectURL(mediaFile)} controls className="w-full rounded-lg mb-2"/>)}
              {activeMediaTab === "document" && mediaFile && (<div className="flex items-center p-2 bg-gray-100 rounded-lg mb-2">
                  <span className="text-gray-700 text-sm break-all">
                    {mediaFile.name}
                  </span>
                </div>)}

              {/* Body Text */}
              <p className="text-gray-800 text-sm mb-4" dangerouslySetInnerHTML={{
            __html: renderFormattedText(bodyText),
        }}></p>

              {/* Footer Text */}
              {footerText && (<div className="text-xs text-gray-600 italic mb-4">
                  {footerText}
                </div>)}

              {/* Buttons */}
              {buttons.length > 0 && (<div className="space-y-2">
                  {buttons.map((button, index) => (<div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg text-sm">
                      <span className="text-gray-700">{button.text}</span>
                      {button.type === "url" && button.url && (<a href={button.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                          Open
                        </a>)}
                      {button.type === "phone_number" && button.phone_number && (<a href={`tel:${button.phone_number}`} className="text-blue-500 hover:underline text-sm">
                          {formatPhoneNumber(button.phone_number)}
                        </a>)}
                      {button.type === "quick_reply" && (<span className="text-gray-500 text-sm">Quick Reply</span>)}
                    </div>))}
                </div>)}
            </div>
          </div>
        </div>

        {/* Chat Input (Placeholder) */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <lucide_react_1.Smile className="text-gray-500 w-5 h-5"/>
            <input_1.Input className="flex-1 bg-[#f0f2f5] border-none text-black placeholder-gray-500" placeholder="Type a message"/>
            <button_1.Button className="bg-[#25d366] hover:bg-[#128c7e]">
              <lucide_react_1.Send className="w-4 h-4 text-white"/>
            </button_1.Button>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = PreviewPane;
