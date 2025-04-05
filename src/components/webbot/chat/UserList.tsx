import { UserCircle } from 'lucide-react';
import Image from 'next/image';

interface UserListProps {
  users: User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  type: 'text' | 'image' | 'file';
}

export function UserList({ users, selectedUserId, onSelectUser }: UserListProps) {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={`w-full p-2 flex items-center space-x-3 rounded-lg transition-colors ${
            selectedUserId === user.id
              ? 'bg-blue-500 text-white'
              : 'hover:bg-blue-600/5 text-gray-700'
          }`}
        >
          <div className="relative flex-shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="w-9 h-9" />
            )}
          </div>
          <div className="flex-1 text-left min-w-0"> {/* Add min-w-0 to prevent flex overflow */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{user.name}</h3> {/* Truncate name if too long */}
            </div>
            {user.lastMessage && (
              <p className="text-sm truncate">{user.lastMessage}</p>
            )}
          </div>
          
        </button>
      ))}
    </div>
  );
}