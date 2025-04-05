import React, { useEffect, useRef } from 'react';
import UrlRenderer from './UrlRenderer'; // Import the UrlRenderer component

interface MessageDisplayProps {
  messages: Array<{
    question: string;
    answer: string;
    timestamp?: string;
    isUserMessage?: boolean;
    isSystemMessage?: boolean;
  }>;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: "0.5rem", overflowX: "hidden" }}>
      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message, index) => {
            if (message.isSystemMessage) {
              return (
                <div key={index} className="flex justify-center">
                  <div className="p-3 rounded-3xl shadow-md bg-gray-800 text-white text-center max-w-xs">
                    <p className="text-sm break-words">{message.answer || message.question}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col space-y-2">
                {message.question && !message.isUserMessage && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-3xl shadow-md bg-gray-200 text-gray-800 max-w-xs">
                      <p className="text-xs text-gray-500 mb-1">BOT</p>
                      {isUrl(message.question) ? (
                        <UrlRenderer url={message.question} />
                      ) : (
                        <p className="text-sm break-words">{message.question}</p>
                      )}
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {new Date(message.timestamp || "").toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {message.answer && !message.isSystemMessage && (
                  <div className="flex justify-end">
                    <div className="p-3 rounded-3xl shadow-md bg-blue-500 text-white max-w-xs">
                      <p className="text-xs text-gray-200 mb-1">YOU</p>
                      {isUrl(message.answer) ? (
                        <UrlRenderer url={message.answer} />
                      ) : (
                        <p className="text-sm break-words">{message.answer}</p>
                      )}
                      <p className="text-xs text-gray-200 text-right mt-1">
                        {new Date(message.timestamp || "").toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} style={{ height: "1px" }} />
        </div>
      ) : (
        <div className="text-center text-gray-500">No messages available for this chat.</div>
      )}
    </div>
  );
};

export default MessageDisplay;