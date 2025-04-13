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
const fi_1 = require("react-icons/fi");
const image_1 = __importDefault(require("next/image"));
const emoji_picker_react_1 = __importDefault(require("emoji-picker-react"));
const Modal_1 = __importDefault(require("./Modal"));
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const Chat = ({ messages, userName, waId, businessPhoneNumber, onToggleRealTime, }) => {
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [isRealTime, setIsRealTime] = (0, react_1.useState)(false);
    const [newMessage, setNewMessage] = (0, react_1.useState)("");
    const [showEmojiPicker, setShowEmojiPicker] = (0, react_1.useState)(false);
    const [modalContent, setModalContent] = (0, react_1.useState)(null);
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [filePreview, setFilePreview] = (0, react_1.useState)(null);
    const [selectedEmployee, setSelectedEmployee] = (0, react_1.useState)(""); // State for selected employee
    const { tenantConfig } = (0, TenantConfigContext_1.useTenantConfig)();
    const fileInputRef = (0, react_1.useRef)(null);
    const chatContainerRef = (0, react_1.useRef)(null);
    // Hardcoded values (replace with actual data)
    const [waIdState] = (0, react_1.useState)("");
    const [phoneNumberId] = (0, react_1.useState)(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.phoneNumberId);
    const [businessPhoneNumberState] = (0, react_1.useState)(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.displayPhoneNumber);
    (0, react_1.useEffect)(() => {
        setIsClient(true);
        console.log("Initial waId:", waId);
        console.log("Initial phoneNumberId:", phoneNumberId);
        console.log("Initial businessPhoneNumberState:", businessPhoneNumberState);
    }, []);
    (0, react_1.useEffect)(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);
    const handleFileChange = (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file)); // Generate a preview URL
        }
    };
    const handleEmojiClick = (emojiData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };
    // const updateResponseMode = async (mode: "manual" | "auto") => {
    //   try {
    //     const response = await fetch("/api/Whatsapp/update-response-mode", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         waId: waIdState,
    //         responseMode: mode,
    //         businessPhoneNumber: businessPhoneNumberState,
    //       }),
    //     });
    //     if (!response.ok) {
    //       const errorDetails = await response.json();
    //       console.error("Error updating response mode:", errorDetails);
    //       return;
    //     }
    //     // Define the agent message based on the mode
    //     const agentMessage =
    //       mode === "manual"
    //         ? "Agent at your service...."
    //         : "Continue with our AI";
    //     const msg = await fetch("/api/Whatsapp/send-message", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         waId: waId,
    //         phoneNumberId,
    //         businessPhoneNumber: businessPhoneNumberState,
    //         message: agentMessage,
    //       }),
    //     });
    //     if (!msg.ok) {
    //       const errorDetails = await msg.json();
    //       console.error("Error sending message:", errorDetails);
    //       return;
    //     }
    //     console.log(`Response mode updated to ${mode} for user ${waIdState}`);
    //   } catch (error) {
    //     console.error("Error updating response mode:", error);
    //   }
    // };
    const handleToggle = async () => {
        setIsRealTime(!isRealTime);
        // Notify parent component if onToggleRealTime is provided
        if (onToggleRealTime) {
            await onToggleRealTime(!isRealTime);
        }
    };
    const handleSendMessage = async () => {
        if (!newMessage.trim() && !selectedFile)
            return;
        try {
            let mediaUrl = null;
            let mediaID = null;
            // Upload the file to Google Drive if a file is selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("fileName", selectedFile.name);
                const uploadResponse = await fetch("/api/Whatsapp/drive", {
                    method: "POST",
                    body: formData,
                });
                if (!uploadResponse.ok) {
                    console.error("Failed to upload file to Google Drive");
                    return;
                }
                const { publicUrl, mediaId, fileName } = await uploadResponse.json();
                mediaUrl = publicUrl;
                mediaID = mediaId;
            }
            // Prepare the request body
            const requestBody = {
                waId: waId,
                phoneNumberId,
                businessPhoneNumber: businessPhoneNumberState,
                message: newMessage.trim(), // Include the text message
            };
            console.log("body in send message", requestBody);
            // Add media details if a file is selected
            if (selectedFile) {
                requestBody.mediaType = selectedFile.type; // Include the media type
                requestBody.mediaUrl = mediaUrl; // Include the media URL
                requestBody.mediaId = mediaID;
                requestBody.filename = selectedFile.name;
                if (newMessage.trim()) {
                    requestBody.caption = newMessage.trim(); // Include the caption if it exists
                }
            }
            // Send the message (text or media) to the API
            const response = await fetch("/api/Whatsapp/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
            console.log(response);
            if (!response.ok) {
                console.error("Failed to send message");
                return;
            }
            const data = await response.json();
            console.log("Message sent successfully:", data);
            // Reset state
            setNewMessage("");
            setSelectedFile(null);
            setFilePreview(null);
            if (fileInputRef.current)
                fileInputRef.current.value = ""; // Clear file input
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    };
    const openModal = (content) => {
        setModalContent(content);
    };
    const closeModal = () => {
        setModalContent(null);
    };
    const removeDriveLinkFromText = (text) => {
        // Match the drive link plus anything else right after "preview"
        // until the next space (or end of the string).
        const driveLinkRegex = /https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/preview[^ ]*/g;
        return text.replace(driveLinkRegex, "").trim();
    };
    const extractDriveLink = (text) => {
        const driveLinkRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/preview,type:([a-zA-Z]+)/;
        const match = text.match(driveLinkRegex);
        if (match) {
            return {
                driveLink: `https://drive.google.com/file/d/${match[1]}/preview`,
                type: match[2].toLowerCase(), // Normalize type to lowercase
            };
        }
        return null;
    };
    const renderMedia = (text) => {
        const driveInfo = extractDriveLink(text);
        if (driveInfo) {
            const { driveLink, type } = driveInfo;
            switch (type) {
                case "image":
                    return (<iframe src={driveLink} width="100%" height="300px" frameBorder="0" allowFullScreen/>);
                case "video":
                    return (<iframe src={driveLink} width="100%" height="300px" frameBorder="0" allowFullScreen/>);
                case "audio":
                    return (<iframe src={driveLink} width="100%" height="50px" style={{ border: "none", borderRadius: "20px" }}/>);
                case "file":
                default:
                    return (<iframe src={driveLink} width="100%" height="300px" frameBorder="0" allowFullScreen/>);
            }
        }
        return null;
    };
    return (<div className="flex-1 h-screen flex flex-col relative">
      {userName ? (<>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white shadow-lg">
            <div className="flex items-center space-x-2 animate-fadeIn">
              <div className="relative w-10 h-10">
                <image_1.default src="https://via.placeholder.com/32" alt="User Avatar" fill className="rounded-full border-2 border-white shadow-lg"/>
              </div>
              <span className="text-lg font-bold text-black drop-shadow-sm">
                {userName}
              </span>
            </div>
            <div className="flex items-center space-x-2 animate-fadeIn">
              

              {/* Real-time toggle button */}
              <label className="flex items-center cursor-pointer space-x-2">
                <span className="text-black font-medium">Go RealTime</span>
                <div className="relative">
                  <input type="checkbox" checked={isRealTime} onChange={handleToggle} className="sr-only"/>
                  <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${isRealTime ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <div className={`absolute top-0 left-0 w-5 h-5 rounded-full shadow transform transition-transform ${isRealTime ? "translate-x-5 bg-white" : "bg-gray-500"}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Message Container */}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 custom-scrollbar relative" style={{
                backgroundImage: `linear-gradient(to bottom right, #ece9e6, #ffffff)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
            {messages.map((msg) => msg.text.trim() ? (<div key={msg.id} className={`my-4 flex ${msg.fromSelf ? "justify-start" : "justify-end"} transition-all duration-200 animate-slideUp`}>
                  <div className="flex flex-col max-w-[80%]">
                    {msg.forwarded && (<p className="text-xs text-gray-500 mb-1 italic">
                        Forwarded
                      </p>)}
                    <div className={`inline-block px-4 py-2 rounded-3xl shadow-xl relative overflow-hidden ${msg.fromSelf
                    ? "bg-white text-gray-900"
                    : "bg-green-100 text-gray-900"}`} style={{
                    borderTopRightRadius: msg.fromSelf
                        ? "1.5rem"
                        : "0.5rem",
                    borderTopLeftRadius: msg.fromSelf ? "0.5rem" : "1.5rem",
                }}>
                      {/* 5. Show the sanitized text: */}
                      <p className="whitespace-pre-wrap break-words">
                        {removeDriveLinkFromText(msg.text)}
                      </p>

                      {renderMedia(msg.text)}
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className="text-xs text-gray-600 opacity-80">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors rounded-3xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>) : null)}
          </div>

          {/* Input Field */}
          <div className={`flex items-center p-3 border-t border-gray-300 bg-white ${isRealTime ? "" : "opacity-60 pointer-events-none"}`}>
            <button className="w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShowEmojiPicker((prev) => !prev)} disabled={!isRealTime}>
              😀
            </button>
            {showEmojiPicker && (<div className="absolute bottom-16 left-3 z-50 animate-fadeIn">
                <emoji_picker_react_1.default onEmojiClick={handleEmojiClick}/>
              </div>)}

            {/* File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*, video/*, audio/*, application/pdf"/>
            <button className="w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors" onClick={() => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={!isRealTime}>
              <fi_1.FiPaperclip size={20}/>
            </button>

            {/* File Preview */}
            {filePreview && (<div className="ml-2">
                {(selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.type.startsWith("image/")) ? (<img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded"/>) : (<span className="text-sm text-gray-600">
                    {selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name}
                  </span>)}
              </div>)}

            {/* Input Field with Enter to Send */}
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevents adding a new line
                    handleSendMessage();
                }
            }} className="flex-grow mx-2 p-2 rounded-full outline-none border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-shadow" disabled={!isRealTime}/>

            {/* Send Button */}
            <button className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors" onClick={handleSendMessage} disabled={!isRealTime}>
              <fi_1.FiSend size={20}/>
            </button>
          </div>

          {/* Modal for full-screen media */}
          {modalContent && <Modal_1.default onClose={closeModal}>{modalContent}</Modal_1.default>}
        </>) : (<div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 via-white to-pink-100 text-black relative animate-fadeIn">
          <h2 className="text-4xl font-extrabold text-gray-800 drop-shadow-md">
            DuneFox
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Send and receive messages without keeping your phone online.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
          <div className="absolute bottom-4 text-xs text-gray-500 flex items-center space-x-1 animate-pulse">
            <span>🔒</span>
            <span>End-to-end encrypted</span>
          </div>
        </div>)}
    </div>);
};
exports.default = Chat;
