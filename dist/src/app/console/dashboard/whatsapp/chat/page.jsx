"use strict";
'use client';
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
exports.default = WhatsappPage;
const Chat_1 = __importDefault(require("@/components/whatsapp/Chat"));
const Sidebar_1 = __importDefault(require("@/components/whatsapp/Sidebar"));
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const react_1 = __importStar(require("react"));
function WhatsappPage() {
    const { tenantConfig } = (0, TenantConfigContext_1.useTenantConfig)();
    const [chats, setChats] = (0, react_1.useState)([]);
    const [users, setUsers] = (0, react_1.useState)([]);
    const [messages, setMessages] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [tempPhoneNumber, setTempPhoneNumber] = (0, react_1.useState)(''); // Temporary state
    const [businessPhoneNumber, setBusinessPhoneNumber] = (0, react_1.useState)(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.displayPhoneNumber); // Actual state
    const [selectedUserId, setSelectedUserId] = (0, react_1.useState)(null);
    const [isStarted, setIsStarted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!businessPhoneNumber)
            return;
        console.log("Tenant Config in Chat", tenantConfig);
        setBusinessPhoneNumber(tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.displayPhoneNumber);
        console.log("Business Phone Number in Whatsapp Page", businessPhoneNumber);
        const fetchChats = async () => {
            try {
                const response = await fetch(`/api/Whatsapp/data/${businessPhoneNumber}`);
                if (!response.ok)
                    throw new Error('Failed to fetch chats');
                const result = await response.json();
                console.log("Response in chats", result);
                if (result.success) {
                    const chatData = result.data;
                    const usersData = chatData.map((chat) => {
                        var _a, _b, _c, _d;
                        const lastInteraction = chat.messages[chat.messages.length - 1];
                        const lastMessage = ((_a = lastInteraction === null || lastInteraction === void 0 ? void 0 : lastInteraction.response) === null || _a === void 0 ? void 0 : _a.message) || ((_b = lastInteraction === null || lastInteraction === void 0 ? void 0 : lastInteraction.user) === null || _b === void 0 ? void 0 : _b.message) || '';
                        const lastTime = ((_c = lastInteraction === null || lastInteraction === void 0 ? void 0 : lastInteraction.response) === null || _c === void 0 ? void 0 : _c.timestamp) || ((_d = lastInteraction === null || lastInteraction === void 0 ? void 0 : lastInteraction.user) === null || _d === void 0 ? void 0 : _d.timestamp) || '';
                        return {
                            id: chat.wa_id,
                            name: chat.wa_id,
                            message: lastMessage,
                            time: new Date(lastTime).toLocaleTimeString(),
                            alert: chat.alert, // Include the alert field here
                        };
                    });
                    const messagesData = chatData.reduce((acc, chat) => {
                        acc[chat.wa_id] = chat.messages.flatMap((msg, index) => [
                            {
                                id: index * 2 + 1,
                                text: msg.user.message,
                                timestamp: new Date(msg.user.timestamp).toLocaleTimeString(),
                                fromSelf: true,
                            },
                            {
                                id: index * 2 + 2,
                                text: msg.response.message,
                                timestamp: new Date(msg.response.timestamp).toLocaleTimeString(),
                                fromSelf: false,
                            },
                        ]);
                        return acc;
                    }, {});
                    setUsers((prevUsers) => {
                        if (JSON.stringify(prevUsers) !== JSON.stringify(usersData)) {
                            return usersData;
                        }
                        return prevUsers;
                    });
                    setMessages((prevMessages) => {
                        const hasChanges = Object.keys(messagesData).some((key) => JSON.stringify(prevMessages[key]) !== JSON.stringify(messagesData[key]));
                        if (hasChanges) {
                            return messagesData;
                        }
                        return prevMessages;
                    });
                    setChats(chatData);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        // Poll every 5 seconds
        const interval = setInterval(fetchChats, 10000);
        // Initial fetch
        fetchChats();
        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [businessPhoneNumber]);
    const updateResponseMode = async (waId, mode) => {
        console.log("Update Result WaID", waId);
        console.log("Update Result WaID", mode);
        console.log("Update Result WaID", businessPhoneNumber);
        try {
            const response = await fetch('/api/Whatsapp/update-response-mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ waId, responseMode: mode, businessPhoneNumber }),
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error updating response mode:', errorDetails);
                return;
            }
            // Define the agent message based on the mode
            const agentMessage = mode === "manual"
                ? "Agent at your service...."
                : "Continue with our AI";
            console.log("WaId before Sending Message", waId);
            const msg = await fetch("/api/Whatsapp/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    waId: waId,
                    phoneNumberId: tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.phoneNumberId,
                    businessPhoneNumber: businessPhoneNumber,
                    message: agentMessage,
                }),
            });
            if (!msg.ok) {
                const errorDetails = await msg.json();
                console.error("Error sending message:", errorDetails);
                return;
            }
            console.log(`Response mode updated to ${mode} for user ${waId}`);
        }
        catch (error) {
            console.error('Error updating response mode:', error);
        }
    };
    const handleToggleRealTime = async (isRealTime) => {
        if (selectedUserId) {
            const newMode = isRealTime ? 'manual' : 'auto';
            await updateResponseMode(selectedUserId, newMode);
        }
    };
    const selectedMessages = selectedUserId ? messages[selectedUserId] || [] : [];
    const selectedUser = users.find((user) => user.id === selectedUserId);
    return (<div className="flex min-h-screen w-full">
      <Sidebar_1.default users={users} onSelectUser={(id) => {
            console.log('Selected user waId:', id);
            setSelectedUserId(id);
        }} businessPhoneNumber={businessPhoneNumber}/>
      <Chat_1.default messages={selectedMessages} userName={selectedUser ? selectedUser.name : null} waId={selectedUserId || ''} businessPhoneNumber={businessPhoneNumber} onToggleRealTime={handleToggleRealTime}/>
    </div>);
}
