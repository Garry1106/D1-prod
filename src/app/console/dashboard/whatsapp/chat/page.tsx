'use client'

import Chat from '@/components/whatsapp/Chat';
import Sidebar from '@/components/whatsapp/Sidebar';
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';

// MongoChangeStream Context
interface MongoChangeStreamContextType {
  data: any[];
  loading: boolean;
  error: string | null;
}

const defaultContext: MongoChangeStreamContextType = {
  data: [],
  loading: true,
  error: null,
};

const MongoChangeStreamContext = createContext<MongoChangeStreamContextType>(defaultContext);

export const useMongoChangeStream = () => useContext(MongoChangeStreamContext);

interface MongoChangeStreamProviderProps {
  children: ReactNode;
  businessPhoneNumber: string;
  pollingInterval?: number; // Fallback polling interval in ms
}

const MongoChangeStreamProvider: React.FC<MongoChangeStreamProviderProps> = ({
  children,
  businessPhoneNumber,
  pollingInterval = 10000, // Match the existing polling interval
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const fetchData = useCallback(async () => {
    if (!businessPhoneNumber) return;

    try {
      const response = await fetch(`/api/Whatsapp/data/${businessPhoneNumber}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [businessPhoneNumber]);

  // Setup EventSource for SSE (Server-Sent Events)
  useEffect(() => {
    if (!businessPhoneNumber) return;

    // Close any existing connection
    if (eventSource) {
      eventSource.close();
    }

    // Fetch initial data
    fetchData();

    // Setup SSE connection
    const newEventSource = new EventSource(`/api/Whatsapp/stream/${businessPhoneNumber}`);
    
    newEventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        if (Array.isArray(newData)) {
          setData(newData);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    newEventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      newEventSource.close();
      
      // Fall back to polling if SSE fails
      const intervalId = setInterval(fetchData, pollingInterval);
      return () => clearInterval(intervalId);
    };

    setEventSource(newEventSource);

    // Cleanup function
    return () => {
      newEventSource.close();
      setEventSource(null);
    };
  }, [businessPhoneNumber, fetchData, pollingInterval]);

  return (
    <MongoChangeStreamContext.Provider value={{ data, loading, error }}>
      {children}
    </MongoChangeStreamContext.Provider>
  );
};

// Message and User interfaces
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

// Main WhatsappPage Component
export default function WhatsappPage() {
  const { tenantConfig } = useTenantConfig();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState<any>(tenantConfig?.displayPhoneNumber);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userResponseModes, setUserResponseModes] = useState<Record<string, string>>({});
  
  // Use refs to track the previous chats data to avoid unnecessary updates
  const prevChatsRef = useRef<any[]>([]);

  // Create a wrapper component that uses the MongoChangeStream context
  const WhatsAppContent = () => {
    const { data: chats, loading: streamLoading, error: streamError } = useMongoChangeStream();
    
    useEffect(() => {
      if (chats.length > 0) {
        console.log("Received chats from MongoChangeStream:", chats);
        
        // Check if the data has actually changed before updating state
        const isDataChanged = JSON.stringify(prevChatsRef.current) !== JSON.stringify(chats);
        
        if (isDataChanged) {
          // Only update state if the data has changed
          prevChatsRef.current = chats;
          
          const usersData = chats.map((chat: any) => {
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

          const messagesData = chats.reduce((acc: Record<string, Message[]>, chat: any) => {
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

          // Extract response modes for each user
          const responseModesData = chats.reduce((acc: Record<string, string>, chat: any) => {
            acc[chat.wa_id] = chat.responseMode || 'auto';
            return acc;
          }, {});

          // Batch the state updates to reduce re-renders
          setUsers(usersData);
          setMessages(messagesData);
          setUserResponseModes(responseModesData);
          setLoading(false);
        }
      }
    }, [chats]);

    if (streamLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chats...</p>
          </div>
        </div>
      );
    }

    if (streamError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="text-center bg-red-50 p-6 rounded-lg shadow-md">
            <p className="text-red-600 font-semibold">Error loading chats</p>
            <p className="text-gray-700 mt-2">{streamError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen w-full">
        <Sidebar
          users={users}
          onSelectUser={(id: string) => {
            console.log('Selected user waId:', id);
            setSelectedUserId(id);
          }}
          businessPhoneNumber={businessPhoneNumber}
        />
        <Chat
          messages={selectedMessages}
          userName={selectedUser ? selectedUser.name : null}
          waId={selectedUserId || ''}
          businessPhoneNumber={businessPhoneNumber}
          onToggleRealTime={handleToggleRealTime}
          initialRealTimeMode={selectedUserResponseMode === 'manual'}
        />
      </div>
    );
  };

  // Update businessPhoneNumber when tenantConfig changes
  useEffect(() => {
    if (tenantConfig?.displayPhoneNumber) {
      console.log("Tenant Config in Chat", tenantConfig);
      setBusinessPhoneNumber(tenantConfig.displayPhoneNumber);
      console.log("Business Phone Number in Whatsapp Page", tenantConfig.displayPhoneNumber);
    }
  }, [tenantConfig]);

  const updateResponseMode = async (waId: string, mode: 'manual' | 'auto') => {
    console.log("Update Result WaID", waId);
    console.log("Update Result Mode", mode);
    console.log("Update Result BusinessPhoneNumber", businessPhoneNumber);

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

      // Update the local state
      setUserResponseModes(prev => ({
        ...prev,
        [waId]: mode
      }));

      // Define the agent message based on the mode
      const agentMessage =
        mode === "manual"
          ? "Agent at your service...."
          : "Continue with our AI";

      console.log("WaId before Sending Message", waId);

      const msg = await fetch("/api/Whatsapp/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waId: waId,
          phoneNumberId: tenantConfig?.phoneNumberId,
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
    } catch (error) {
      console.error('Error updating response mode:', error);
    }
  };

  const handleToggleRealTime = async (isRealTime: boolean) => {
    if (selectedUserId) {
      const newMode = isRealTime ? 'manual' : 'auto';
      await updateResponseMode(selectedUserId, newMode);
    }
  };

  // Compute derived data
  const selectedMessages = selectedUserId ? messages[selectedUserId] || [] : [];
  const selectedUser = users.find((user) => user.id === selectedUserId);
  const selectedUserResponseMode = selectedUserId ? userResponseModes[selectedUserId] : 'auto';

  // If there's no business phone number yet, we don't render anything
  if (!businessPhoneNumber) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tenant configuration...</p>
        </div>
      </div>
    );
  }

  // Wrap the content with the MongoChangeStreamProvider
  return (
    <MongoChangeStreamProvider businessPhoneNumber={businessPhoneNumber}>
      <WhatsAppContent />
    </MongoChangeStreamProvider>
  );
}