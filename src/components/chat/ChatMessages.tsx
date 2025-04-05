// ChatMessages.tsx
import { socket } from "@/lib/socketClient";
import React, { useEffect, useRef, useState } from "react";
import MessageDisplay from "./MessageDisplay";
import MessageInput from "./MessageInput";

interface ChatMessage {
  question: string;
  answer: string;
  timestamp?: string;
  isUserMessage?: boolean;
  isSystemMessage?: boolean;
}

interface Chat {
  _id: string;
  tenantId: string;
  uuid: string;
  messages: ChatMessage[];
}

interface Props {
  filteredChats: Chat[];
  selectedUuid: string | null;
  tenantId: string | null;
  chatCache: React.MutableRefObject<{ [key: string]: Chat[] }>;
  allUuids: string[];
  onNewMessage: (newMessage: ChatMessage, uuid: string) => void;
  setUniqueUuids: React.Dispatch<React.SetStateAction<string[]>>;
  setUnreadMessages: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const ChatMessages: React.FC<Props> = ({
  filteredChats,
  selectedUuid,
  tenantId,
  chatCache,
  onNewMessage,
  setUniqueUuids,
  setUnreadMessages,
  allUuids,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUuid) {
      const selectedChat = filteredChats.find((chat) => chat.uuid === selectedUuid);
      setMessages(selectedChat?.messages || []);
    }
    scrollToBottom();
  }, [filteredChats, selectedUuid]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

// Inside ChatMessages.tsx, modify the socket message handler:

useEffect(() => {
  if (tenantId) {
    socket.connect();

    allUuids.forEach((uuid) => {
      socket.emit("join-room", { room: uuid, username: tenantId, role: "admin" });
    });

    const handleNewMessage = (data: any) => {
      const { room, message } = data;

      // Update unread messages count
      setUnreadMessages((prev) => ({
        ...prev,
        [room]: (prev[room] || 0) + 1,
      }));

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

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }
}, [tenantId, allUuids, selectedUuid]);

  const toggleRealTimeMode = () => {
    if (tenantId && selectedUuid) {
      const newMode = !realTimeMode;
      const statusMessage = newMode ? "Talking with Human" : "Talking with AI";

      socket.emit("message", {
        room: selectedUuid,
        message: statusMessage,
        sender: tenantId,
      });

      const statusUpdate: ChatMessage = {
        question: statusMessage,
        answer: statusMessage,
        timestamp: new Date().toISOString(),
        isSystemMessage: true,
      };

  

      onNewMessage(statusUpdate, selectedUuid);
      setRealTimeMode(newMode);
    }
  };

  const handleNewMessage = (message: string) => {
    if (tenantId && selectedUuid) {
      const newMessage: ChatMessage = {
        question: "",
        answer: message,
        timestamp: new Date().toISOString(),
        isUserMessage: true,
      };
  
      // Emit the message to the socket
      socket.emit("message", {
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

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {selectedUuid ? (
        <>
          <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-800">Chat with {selectedUuid}</h3>
            <button
              className={`px-4 py-2 text-sm rounded shadow-md ${realTimeMode ? "bg-red-400" : "bg-green-400"} text-white`}
              onClick={toggleRealTimeMode}
            >
              {realTimeMode ? "Disable Realtime" : "Go Realtime"}
            </button>
          </div>

          <MessageDisplay messages={messages} />

          {realTimeMode && (
            <div className="p-4 border-t border-gray-300 bg-white shadow-md">
              <MessageInput selectedUuid={selectedUuid} tenantId={tenantId} onSendMessage={handleNewMessage} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to view messages
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
