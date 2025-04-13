'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

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

export const MongoChangeStreamProvider: React.FC<MongoChangeStreamProviderProps> = ({
  children,
  businessPhoneNumber,
  pollingInterval = 6000, // Default polling interval
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

export default MongoChangeStreamProvider;