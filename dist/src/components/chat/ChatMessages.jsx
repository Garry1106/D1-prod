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
// ChatMessages.tsx
const socketClient_1 = require("@/lib/socketClient");
const react_1 = __importStar(require("react"));
const MessageDisplay_1 = __importDefault(require("./MessageDisplay"));
const MessageInput_1 = __importDefault(require("./MessageInput"));
const ChatMessages = ({ filteredChats, selectedUuid, tenantId, chatCache, onNewMessage, setUniqueUuids, setUnreadMessages, allUuids, }) => {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [realTimeMode, setRealTimeMode] = (0, react_1.useState)(false);
    const messagesEndRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (selectedUuid) {
            const selectedChat = filteredChats.find((chat) => chat.uuid === selectedUuid);
            setMessages((selectedChat === null || selectedChat === void 0 ? void 0 : selectedChat.messages) || []);
        }
        scrollToBottom();
    }, [filteredChats, selectedUuid]);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    // Inside ChatMessages.tsx, modify the socket message handler:
    (0, react_1.useEffect)(() => {
        if (tenantId) {
            socketClient_1.socket.connect();
            allUuids.forEach((uuid) => {
                socketClient_1.socket.emit("join-room", { room: uuid, username: tenantId, role: "admin" });
            });
            const handleNewMessage = (data) => {
                const { room, message } = data;
                // Update unread messages count
                setUnreadMessages((prev) => (Object.assign(Object.assign({}, prev), { [room]: (prev[room] || 0) + 1 })));
                if (tenantId) {
                    const newMessage = {
                        question: message,
                        answer: "",
                        timestamp: new Date().toISOString(),
                    };
                    // Notify the parent component (ChatComponent) about the new message
                    onNewMessage(newMessage, room);
                }
            };
            socketClient_1.socket.on("message", handleNewMessage);
            return () => {
                socketClient_1.socket.off("message", handleNewMessage);
            };
        }
    }, [tenantId, allUuids, selectedUuid]);
    const toggleRealTimeMode = () => {
        if (tenantId && selectedUuid) {
            const newMode = !realTimeMode;
            const statusMessage = newMode ? "Talking with Human" : "Talking with AI";
            socketClient_1.socket.emit("message", {
                room: selectedUuid,
                message: statusMessage,
                sender: tenantId,
            });
            const statusUpdate = {
                question: statusMessage,
                answer: statusMessage,
                timestamp: new Date().toISOString(),
                isSystemMessage: true,
            };
            onNewMessage(statusUpdate, selectedUuid);
            setRealTimeMode(newMode);
        }
    };
    const handleNewMessage = (message) => {
        if (tenantId && selectedUuid) {
            const newMessage = {
                question: "",
                answer: message,
                timestamp: new Date().toISOString(),
                isUserMessage: true,
            };
            // Emit the message to the socket
            socketClient_1.socket.emit("message", {
                room: selectedUuid,
                message,
                sender: tenantId,
                role: "admin",
            });
            // Notify the parent component (ChatComponent) about the new message
            onNewMessage(newMessage, selectedUuid);
            scrollToBottom();
        }
    };
    return (<div className="flex flex-col h-full bg-gray-100">
      {selectedUuid ? (<>
          <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-800">Chat with {selectedUuid}</h3>
            <button className={`px-4 py-2 text-sm rounded shadow-md ${realTimeMode ? "bg-red-400" : "bg-green-400"} text-white`} onClick={toggleRealTimeMode}>
              {realTimeMode ? "Disable Realtime" : "Go Realtime"}
            </button>
          </div>

          <MessageDisplay_1.default messages={messages}/>

          {realTimeMode && (<div className="p-4 border-t border-gray-300 bg-white shadow-md">
              <MessageInput_1.default selectedUuid={selectedUuid} tenantId={tenantId} onSendMessage={handleNewMessage}/>
            </div>)}
          <div ref={messagesEndRef}/>
        </>) : (<div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to view messages
        </div>)}
    </div>);
};
exports.default = ChatMessages;
