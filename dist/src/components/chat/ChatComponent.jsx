"use strict";
"use client";
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
const socketClient_1 = require("@/lib/socketClient");
const react_1 = __importStar(require("react"));
const ChatDashboardHeader_1 = __importDefault(require("./ChatDashboardHeader"));
const ChatMessages_1 = __importDefault(require("./ChatMessages"));
const ChatSidebar_1 = __importDefault(require("./ChatSidebar"));
const reorderUuidsByLatestMessage = (chats) => {
    return chats
        .sort((a, b) => {
        var _a, _b;
        const aLatestMessage = ((_a = a.messages[a.messages.length - 1]) === null || _a === void 0 ? void 0 : _a.timestamp) || "";
        const bLatestMessage = ((_b = b.messages[b.messages.length - 1]) === null || _b === void 0 ? void 0 : _b.timestamp) || "";
        return new Date(bLatestMessage).getTime() - new Date(aLatestMessage).getTime();
    })
        .map((chat) => chat.uuid);
};
const saveToLocalStorage = (tenantId, chats) => {
    try {
        localStorage.setItem(`chat_cache_${tenantId}`, JSON.stringify(chats));
    }
    catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};
const loadFromLocalStorage = (tenantId) => {
    try {
        const cached = localStorage.getItem(`chat_cache_${tenantId}`);
        return cached ? JSON.parse(cached) : [];
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return [];
    }
};
const ChatComponent = ({ tenantId }) => {
    const [realTimeMode, setRealTimeMode] = (0, react_1.useState)(false);
    const [uniqueUuids, setUniqueUuids] = (0, react_1.useState)([]);
    const [selectedUuid, setSelectedUuid] = (0, react_1.useState)(null);
    const [filteredChats, setFilteredChats] = (0, react_1.useState)([]);
    const [unreadMessages, setUnreadMessages] = (0, react_1.useState)({});
    const chatCache = (0, react_1.useRef)({});
    const isInitialMount = (0, react_1.useRef)(true);
    const fetchChats = async () => {
        if (!tenantId) {
            console.error("Tenant ID is missing");
            return;
        }
        const cachedChats = loadFromLocalStorage(tenantId);
        if (cachedChats.length > 0) {
            chatCache.current[tenantId] = cachedChats;
            updateChatData(cachedChats);
        }
        try {
            const response = await fetch(`/api/chat?tenantId=${tenantId}`);
            if (!response.ok)
                throw new Error(`Failed to fetch chats: ${response.status}`);
            const result = await response.json();
            const apiData = result.data;
            const mergedChats = mergeChats(cachedChats, apiData);
            chatCache.current[tenantId] = mergedChats;
            saveToLocalStorage(tenantId, mergedChats);
            updateChatData(mergedChats);
        }
        catch (error) {
            console.error("Error fetching chats:", error);
        }
    };
    const mergeChats = (cached, fetched) => {
        const fetchedMap = new Map(fetched.map(chat => [chat.uuid, chat]));
        const merged = [...fetched];
        cached.forEach(chat => {
            if (!fetchedMap.has(chat.uuid)) {
                merged.push(chat);
            }
        });
        return merged;
    };
    const updateChatData = (chats) => {
        const uuids = reorderUuidsByLatestMessage(chats);
        setUniqueUuids(uuids);
        if (selectedUuid) {
            const filtered = chats.filter((chat) => chat.uuid === selectedUuid);
            setFilteredChats(filtered);
        }
        else {
            setFilteredChats(chats);
        }
    };
    const handleNewUserEvent = (event) => {
        var _a;
        console.log("New user event received:", event);
        if (event.sender === tenantId) {
            const uuidExists = (_a = chatCache.current[tenantId]) === null || _a === void 0 ? void 0 : _a.some(chat => chat.uuid === event.uuid);
            if (uuidExists)
                return;
            const firstMessage = {
                question: event.message,
                answer: '',
                timestamp: new Date().toISOString(),
                isUserMessage: false
            };
            const newChat = {
                _id: Math.random().toString(),
                tenantId: tenantId,
                uuid: event.uuid,
                messages: [firstMessage]
            };
            const updatedChats = [...(chatCache.current[tenantId] || []), newChat];
            chatCache.current[tenantId] = updatedChats;
            saveToLocalStorage(tenantId, updatedChats);
            const newUuids = reorderUuidsByLatestMessage(updatedChats);
            setUniqueUuids(newUuids);
            if (selectedUuid !== event.uuid) {
                setUnreadMessages((prevUnread) => (Object.assign(Object.assign({}, prevUnread), { [event.uuid]: (prevUnread[event.uuid] || 0) + 1 })));
            }
            if (selectedUuid === event.uuid) {
                setFilteredChats([newChat]);
            }
        }
    };
    const handleNewMessage = (message, uuid) => {
        console.log("New message received:", message, uuid);
        const cachedChats = chatCache.current[tenantId] || [];
        const chatIndex = cachedChats.findIndex((chat) => chat.uuid === uuid);
        if (chatIndex !== -1) {
            const chat = cachedChats[chatIndex];
            const messageExists = chat.messages.some((msg) => msg.timestamp === message.timestamp && msg.question === message.question);
            if (!messageExists) {
                const updatedChat = Object.assign(Object.assign({}, chat), { messages: [...chat.messages, message] });
                const updatedChats = [...cachedChats];
                updatedChats[chatIndex] = updatedChat;
                chatCache.current[tenantId] = updatedChats;
                saveToLocalStorage(tenantId, updatedChats);
                console.log("Updated chat cache:", updatedChats);
                setFilteredChats((prevChats) => prevChats.map((chat) => chat.uuid === uuid ? updatedChat : chat));
                const newUuids = reorderUuidsByLatestMessage(updatedChats);
                setUniqueUuids(newUuids);
                if (selectedUuid !== uuid) {
                    setUnreadMessages((prevUnread) => (Object.assign(Object.assign({}, prevUnread), { [uuid]: (prevUnread[uuid] || 0) + 1 })));
                }
            }
        }
        else {
            console.error("Chat not found in cache for UUID:", uuid);
        }
    };
    (0, react_1.useEffect)(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchChats();
        }
    }, [tenantId]);
    (0, react_1.useEffect)(() => {
        socketClient_1.socket.on("new-user", handleNewUserEvent);
        return () => {
            socketClient_1.socket.off("new-user", handleNewUserEvent);
        };
    }, [tenantId, selectedUuid]);
    (0, react_1.useEffect)(() => {
        if (selectedUuid) {
            setUnreadMessages((prevUnread) => (Object.assign(Object.assign({}, prevUnread), { [selectedUuid]: 0 })));
            if (chatCache.current[tenantId]) {
                const filtered = chatCache.current[tenantId].filter((chat) => chat.uuid === selectedUuid);
                setFilteredChats(filtered);
            }
        }
    }, [selectedUuid, tenantId]);
    return (<div className="flex flex-col h-screen bg-gray-900 text-white">
      <ChatDashboardHeader_1.default realTimeMode={realTimeMode} setRealTimeMode={setRealTimeMode}/>
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar_1.default uniqueUuids={uniqueUuids} selectedUuid={selectedUuid} setSelectedUuid={setSelectedUuid} unreadMessages={unreadMessages}/>
        <div className="flex flex-col flex-1">
          <ChatMessages_1.default filteredChats={filteredChats} selectedUuid={selectedUuid} tenantId={tenantId} chatCache={chatCache} onNewMessage={handleNewMessage} setUniqueUuids={setUniqueUuids} setUnreadMessages={setUnreadMessages} allUuids={uniqueUuids}/>
        </div>
      </div>
    </div>);
};
exports.default = ChatComponent;
