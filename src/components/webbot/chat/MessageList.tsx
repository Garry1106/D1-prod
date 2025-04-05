"use client";

import { Message } from "./UserList";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.senderId === "support" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg px-4 py-2 ${
              message.senderId === "support"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p>{message.content}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {message.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}