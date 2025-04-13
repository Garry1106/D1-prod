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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const UrlRenderer_1 = __importDefault(require("./UrlRenderer")); // Import the UrlRenderer component
const MessageDisplay = ({ messages }) => {
    const messagesEndRef = (0, react_1.useRef)(null);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    const isUrl = (text) => {
        try {
            new URL(text);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    return (<div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: "0.5rem", overflowX: "hidden" }}>
      {messages.length > 0 ? (<div className="space-y-3">
          {messages.map((message, index) => {
                if (message.isSystemMessage) {
                    return (<div key={index} className="flex justify-center">
                  <div className="p-3 rounded-3xl shadow-md bg-gray-800 text-white text-center max-w-xs">
                    <p className="text-sm break-words">{message.answer || message.question}</p>
                  </div>
                </div>);
                }
                return (<div key={index} className="flex flex-col space-y-2">
                {message.question && !message.isUserMessage && (<div className="flex justify-start">
                    <div className="p-3 rounded-3xl shadow-md bg-gray-200 text-gray-800 max-w-xs">
                      <p className="text-xs text-gray-500 mb-1">BOT</p>
                      {isUrl(message.question) ? (<UrlRenderer_1.default url={message.question}/>) : (<p className="text-sm break-words">{message.question}</p>)}
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {new Date(message.timestamp || "").toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>)}

                {message.answer && !message.isSystemMessage && (<div className="flex justify-end">
                    <div className="p-3 rounded-3xl shadow-md bg-blue-500 text-white max-w-xs">
                      <p className="text-xs text-gray-200 mb-1">YOU</p>
                      {isUrl(message.answer) ? (<UrlRenderer_1.default url={message.answer}/>) : (<p className="text-sm break-words">{message.answer}</p>)}
                      <p className="text-xs text-gray-200 text-right mt-1">
                        {new Date(message.timestamp || "").toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>)}
              </div>);
            })}
          <div ref={messagesEndRef} style={{ height: "1px" }}/>
        </div>) : (<div className="text-center text-gray-500">No messages available for this chat.</div>)}
    </div>);
};
exports.default = MessageDisplay;
