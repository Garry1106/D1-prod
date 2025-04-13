"use strict";
// hooks/useChats.ts
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChats = void 0;
const react_1 = require("react");
const useChats = (businessPhoneNumber) => {
    const [chats, setChats] = (0, react_1.useState)([]);
    const [users, setUsers] = (0, react_1.useState)([]);
    const [messages, setMessages] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [phoneNumberError, setPhoneNumberError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!businessPhoneNumber)
            return;
        const fetchChats = async () => {
            try {
                const response = await fetch(`/api/Whatsapp/data/${businessPhoneNumber}`);
                console.log(response);
                if (!response.ok)
                    throw new Error('Failed to fetch chats');
                const result = await response.json();
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
                            alert: chat.alert,
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
                    setUsers(usersData);
                    setMessages(messagesData);
                    setChats(chatData);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        const interval = setInterval(fetchChats, 8000);
        fetchChats();
        return () => clearInterval(interval);
    }, [businessPhoneNumber]);
    const updateResponseMode = async (waId, mode) => {
        try {
            const response = await fetch('/api/whatsapp/update-response-mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ waId, responseMode: mode, businessPhoneNumber }),
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error updating response mode:', errorDetails);
                return;
            }
            console.log(`Response mode updated to ${mode} for user ${waId}`);
        }
        catch (error) {
            console.error('Error updating response mode:', error);
        }
    };
    return {
        chats,
        users,
        messages,
        loading,
        error,
        phoneNumberError,
        updateResponseMode,
    };
};
exports.useChats = useChats;
