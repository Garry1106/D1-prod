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
const MessageInput = ({ selectedUuid, tenantId, onSendMessage, }) => {
    const [message, setMessage] = (0, react_1.useState)("");
    const [file, setFile] = (0, react_1.useState)(null);
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const [filePreview, setFilePreview] = (0, react_1.useState)(null);
    const handleSendMessage = async () => {
        if ((!message.trim() && !file) || !selectedUuid || !tenantId) {
            console.warn("Cannot send message. Missing required fields.");
            return;
        }
        setIsUploading(true);
        try {
            let fileUrl = "";
            // Upload file if it exists
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/api/sendfile", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error("Failed to upload file");
                }
                const result = await response.json();
                fileUrl = result.fileUrl;
            }
            // Send the message (text or file URL)
            onSendMessage(fileUrl || message);
            // Clear inputs
            setMessage("");
            setFile(null);
            setFilePreview(null);
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
        finally {
            setIsUploading(false);
        }
    };
    const handleFileChange = (event) => {
        var _a;
        const selectedFile = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!selectedFile)
            return;
        // Set file preview details
        setFile(selectedFile);
        setFilePreview({
            name: selectedFile.name,
            size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
            type: selectedFile.type,
        });
    };
    const handleCancelUpload = () => {
        setFile(null);
        setFilePreview(null);
    };
    return (<div className="flex flex-col mt-4">
      {/* File Preview Section */}
      {filePreview && (<div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{filePreview.name}</p>
              <p className="text-xs text-gray-500">
                {filePreview.size} - {filePreview.type}
              </p>
            </div>
            <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs" onClick={handleCancelUpload}>
              Cancel
            </button>
          </div>
        </div>)}

      {/* Input Section */}
      <div className="flex">
        {/* File Upload Button */}
        <label className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
          <input type="file" onChange={handleFileChange} className="hidden" disabled={isUploading}/>
          📁
        </label>

        {/* Message Input */}
        <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 ml-2"/>

        {/* Send Button */}
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSendMessage} disabled={!selectedUuid || !tenantId || (!message.trim() && !file) || isUploading}>
          {isUploading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>);
};
exports.default = MessageInput;
