"use client";

import { socket } from "@/lib/socketClient";
import React, { useEffect, useRef, useState } from "react";
import ChatDashboardHeader from "./ChatDashboardHeader";
import ChatMessages from "./ChatMessages";
import ChatSidebar from "./ChatSidebar";

interface ChatMessage {
  question: string;
  answer: string;
  timestamp?: string;
  isUserMessage?: boolean;
}

interface Chat {
  _id: string;
  tenantId: string;
  uuid: string;
  messages: ChatMessage[];
}

interface ChatComponentProps {
  tenantId: string;
}

interface NewUserEvent {
  uuid: string;
  sender: string;
  message: string;
  role: string;
  type: string;
}

const reorderUuidsByLatestMessage = (chats: Chat[]): string[] => {
  return chats
    .sort((a, b) => {
      const aLatestMessage = a.messages[a.messages.length - 1]?.timestamp || "";
      const bLatestMessage = b.messages[b.messages.length - 1]?.timestamp || "";
      return new Date(bLatestMessage).getTime() - new Date(aLatestMessage).getTime();
    })
    .map((chat) => chat.uuid);
};

const saveToLocalStorage = (tenantId: string, chats: Chat[]) => {
  try {
    localStorage.setItem(`chat_cache_${tenantId}`, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = (tenantId: string): Chat[] => {
  try {
    const cached = localStorage.getItem(`chat_cache_${tenantId}`);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return [];
  }
};

const ChatComponent: React.FC<ChatComponentProps> = ({ tenantId }) => {
  const [realTimeMode, setRealTimeMode] = useState<boolean>(false);
  const [uniqueUuids, setUniqueUuids] = useState<string[]>([]);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});
  const chatCache = useRef<{ [key: string]: Chat[] }>({});
  const isInitialMount = useRef(true);

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
      if (!response.ok) throw new Error(`Failed to fetch chats: ${response.status}`);
      const result = await response.json();
      const apiData: Chat[] = result.data;

      const mergedChats = mergeChats(cachedChats, apiData);
      chatCache.current[tenantId] = mergedChats;
      saveToLocalStorage(tenantId, mergedChats);
      updateChatData(mergedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const mergeChats = (cached: Chat[], fetched: Chat[]): Chat[] => {
    const fetchedMap = new Map(fetched.map(chat => [chat.uuid, chat]));
    const merged = [...fetched];

    cached.forEach(chat => {
      if (!fetchedMap.has(chat.uuid)) {
        merged.push(chat);
      }
    });

    return merged;
  };

  const updateChatData = (chats: Chat[]) => {
    const uuids = reorderUuidsByLatestMessage(chats);
    setUniqueUuids(uuids);
  
    if (selectedUuid) {
      const filtered = chats.filter((chat) => chat.uuid === selectedUuid);
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  };
  const handleNewUserEvent = (event: NewUserEvent) => {
    console.log("New user event received:", event);
  
    if (event.sender === tenantId) {
      const uuidExists = chatCache.current[tenantId]?.some(chat => chat.uuid === event.uuid);
      if (uuidExists) return;
  
      const firstMessage: ChatMessage = {
        question: event.message,
        answer: '',
        timestamp: new Date().toISOString(),
        isUserMessage: false
      };
  
      const newChat: Chat = {
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
        setUnreadMessages((prevUnread) => ({
          ...prevUnread,
          [event.uuid]: (prevUnread[event.uuid] || 0) + 1,
        }));
      }

      if (selectedUuid === event.uuid) {
        setFilteredChats([newChat]);
      }
    }
  };

  const handleNewMessage = (message: ChatMessage, uuid: string) => {
    console.log("New message received:", message, uuid);
  
    const cachedChats = chatCache.current[tenantId] || [];
    const chatIndex = cachedChats.findIndex((chat) => chat.uuid === uuid);
  
    if (chatIndex !== -1) {
      const chat = cachedChats[chatIndex];
      const messageExists = chat.messages.some(
        (msg) => msg.timestamp === message.timestamp && msg.question === message.question
      );
  
      if (!messageExists) {
        const updatedChat = { ...chat, messages: [...chat.messages, message] };
        const updatedChats = [...cachedChats];
        updatedChats[chatIndex] = updatedChat;
        chatCache.current[tenantId] = updatedChats;
        saveToLocalStorage(tenantId, updatedChats);
  
        console.log("Updated chat cache:", updatedChats);
  
        setFilteredChats((prevChats) =>
          prevChats.map((chat) =>
            chat.uuid === uuid ? updatedChat : chat
          )
        );
  
        const newUuids = reorderUuidsByLatestMessage(updatedChats);
        setUniqueUuids(newUuids);
  
        if (selectedUuid !== uuid) {
          setUnreadMessages((prevUnread) => ({
            ...prevUnread,
            [uuid]: (prevUnread[uuid] || 0) + 1,
          }));
        }
      }
    } else {
      console.error("Chat not found in cache for UUID:", uuid);
    }
  };
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchChats();
    }
  }, [tenantId]);

  useEffect(() => {
    socket.on("new-user", handleNewUserEvent);
    return () => {
      socket.off("new-user", handleNewUserEvent);
    };
  }, [tenantId, selectedUuid]);

  useEffect(() => {
    if (selectedUuid) {
      setUnreadMessages((prevUnread) => ({
        ...prevUnread,
        [selectedUuid]: 0,
      }));

      if (chatCache.current[tenantId]) {
        const filtered = chatCache.current[tenantId].filter((chat) => chat.uuid === selectedUuid);
        setFilteredChats(filtered);
      }
    }
  }, [selectedUuid, tenantId]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <ChatDashboardHeader realTimeMode={realTimeMode} setRealTimeMode={setRealTimeMode} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          uniqueUuids={uniqueUuids}
          selectedUuid={selectedUuid}
          setSelectedUuid={setSelectedUuid}
          unreadMessages={unreadMessages}
        />
        <div className="flex flex-col flex-1">
          <ChatMessages
            filteredChats={filteredChats}
            selectedUuid={selectedUuid}
            tenantId={tenantId}
            chatCache={chatCache}
            onNewMessage={handleNewMessage}
            setUniqueUuids={setUniqueUuids}
            setUnreadMessages={setUnreadMessages}
            allUuids={uniqueUuids}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;