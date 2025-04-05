  // hooks/useChats.ts
  'use client'
  import { useState, useEffect } from 'react';

  interface Message {
    id: number;
    text: string;
    timestamp: string;
    fromSelf: boolean;
  }

  interface User {
    id: string;
    name: string;
    message: string;
    time: string;
    alert: boolean;
    avatarUrl?: string;
  }

  export const useChats = (businessPhoneNumber: string) => {
    const [chats, setChats] = useState<any[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

    useEffect(() => {
      if (!businessPhoneNumber) return;

      const fetchChats = async () => {
        try {
          const response = await fetch(`/api/Whatsapp/data/${businessPhoneNumber}`);
          console.log(response)
          if (!response.ok) throw new Error('Failed to fetch chats');

          const result = await response.json();
          if (result.success) {
            const chatData = result.data;

            const usersData = chatData.map((chat: any) => {
              const lastInteraction = chat.messages[chat.messages.length - 1];
              const lastMessage =
                lastInteraction?.response?.message || lastInteraction?.user?.message || '';
              const lastTime =
                lastInteraction?.response?.timestamp || lastInteraction?.user?.timestamp || '';

              return {
                id: chat.wa_id,
                name: chat.wa_id,
                message: lastMessage,
                time: new Date(lastTime).toLocaleTimeString(),
                alert: chat.alert,
              };
            });

            const messagesData = chatData.reduce((acc: Record<string, Message[]>, chat: any) => {
              acc[chat.wa_id] = chat.messages.flatMap((msg: any, index: number) => [
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
        } catch (error) {
          console.error(error);
        }
      };

      const interval = setInterval(fetchChats, 8000);
      fetchChats();

      return () => clearInterval(interval);
    }, [businessPhoneNumber]);

    const updateResponseMode = async (waId: string, mode: 'manual' | 'auto') => {
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
      } catch (error) {
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
