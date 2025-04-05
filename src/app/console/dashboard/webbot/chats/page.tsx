'use client';

import { Input } from '@/components/ui/input';
import { ChatHeader } from '@/components/webbot/chat/ChatHeader';
import { MessageInput } from '@/components/webbot/chat/MessageInput';
import { MessageList } from '@/components/webbot/chat/MessageList';
import { Message, User, UserList } from '@/components/webbot/chat/UserList';
import { useState } from 'react';

// Demo data with Indian names
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    avatar: '',
    status: 'online',
    lastMessage: 'Hi, I need help with my order.',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    avatar: '',
    status: 'offline',
    lastMessage: 'Can you check the status of my refund?',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Rahul Singh',
    avatar: '',
    status: 'online',
    lastMessage: 'The product I received is damaged.',
    lastMessageTime: '2 hours ago',
    unreadCount: 3,
  },
  {
    id: '4',
    name: 'Ananya Gupta',
    avatar: '',
    status: 'online',
    lastMessage: 'I have a question about my subscription.',
    lastMessageTime: '5 minutes ago',
    unreadCount: 0,
  },
  {
    id: '5',
    name: 'Vikram Joshi',
    avatar: '',
    status: 'online',
    lastMessage: 'Can you help me reset my password?',
    lastMessageTime: 'Just now',
    unreadCount: 1,
  },
];

// Initial messages for each user
const initialMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Hi, I need help with my order.',
      timestamp: '10:30 AM',
      senderId: '1',
      type: 'text',
    },
    {
      id: '2',
      content: 'Sure, Aarav! Could you provide your order number?',
      timestamp: '10:32 AM',
      senderId: 'support',
      type: 'text',
    },
    {
      id: '3',
      content: 'My order number is #12345.',
      timestamp: '10:33 AM',
      senderId: '1',
      type: 'text',
    },
  ],
  '2': [
    {
      id: '4',
      content: 'Can you check the status of my refund?',
      timestamp: 'Yesterday',
      senderId: '2',
      type: 'text',
    },
    {
      id: '5',
      content: 'Hi Priya, I see your refund is being processed. It should take 5-7 business days.',
      timestamp: 'Yesterday',
      senderId: 'support',
      type: 'text',
    },
  ],
  '3': [
    {
      id: '6',
      content: 'The product I received is damaged.',
      timestamp: '2 hours ago',
      senderId: '3',
      type: 'text',
    },
    {
      id: '7',
      content: 'I’m sorry to hear that, Rahul. Could you send a photo of the damaged product?',
      timestamp: '2 hours ago',
      senderId: 'support',
      type: 'text',
    },
  ],
  '4': [
    {
      id: '8',
      content: 'I have a question about my subscription.',
      timestamp: '5 minutes ago',
      senderId: '4',
      type: 'text',
    },
    {
      id: '9',
      content: 'Of course, Ananya! What would you like to know?',
      timestamp: '4 minutes ago',
      senderId: 'support',
      type: 'text',
    },
  ],
  '5': [
    {
      id: '10',
      content: 'Can you help me reset my password?',
      timestamp: 'Just now',
      senderId: '5',
      type: 'text',
    },
    {
      id: '11',
      content: 'Sure, Vikram! I’ll send you a password reset link.',
      timestamp: 'Just now',
      senderId: 'support',
      type: 'text',
    },
  ],
};

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const currentUserId = 'current-user-id'; // In a real app, this would come from auth

  const selectedUser = demoUsers.find((user) => user.id === selectedUserId);

  const handleSendMessage = (content: string) => {
    if (!selectedUserId) return;

    const newMessage: Message = {
      id: String(Date.now()), // Unique ID for the message
      content,
      timestamp: new Date().toLocaleTimeString(),
      senderId: currentUserId,
      type: 'text',
    };

    // Add the new message to the selected user's conversation
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedUserId]: [...(prevMessages[selectedUserId] || []), newMessage],
    }));

    // Simulate a bot reply
    setTimeout(() => {
      const botReply: Message = {
        id: String(Date.now()),
        content: `Thank you for your message, ${selectedUser?.name}! We will get back to you shortly.`,
        timestamp: new Date().toLocaleTimeString(),
        senderId: 'support',
        type: 'text',
      };

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUserId]: [...(prevMessages[selectedUserId] || []), botReply],
      }));
    }, 1000); // Simulate a 1-second delay for the bot reply
  };

  return (
    <>
      {/* Sidebar */}
      <div className="max-w-56 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Messages</h1>
          {/* Add the search bar below the Chats heading */}
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Search chats..."
              className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-2">
          <UserList
            users={demoUsers}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <ChatHeader user={selectedUser} />
            <MessageList
              messages={messages[selectedUserId] || []}
              currentUserId={currentUserId}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Select a conversation
              </h2>
              <p className="text-gray-500 mt-1">
                Choose a user from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}