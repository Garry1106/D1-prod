'use client';

import { UserCircle } from 'lucide-react';
import { User } from './UserList';
import Image from 'next/image';
import { useState } from 'react';

interface ChatHeaderProps {
  user: User;
}

export function ChatHeader({ user }: ChatHeaderProps) {
  // State to manage the real-time toggle
  const [isRealTime, setIsRealTime] = useState<boolean>(false);

  // Handle toggle change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRealTime(event.target.checked);
    console.log(`Real-time mode: ${event.target.checked ? 'ON' : 'OFF'}`);
    // Add your real-time functionality here
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <UserCircle className="w-10 h-10 text-gray-400" />
        )}
        <div>
          <div className="font-medium">{user.name}</div>
        </div>
      </div>

      {/* Checkbox Toggle Switch */}
      <div className="flex items-center space-x-2">
        <label htmlFor="real-time-toggle" className="text-sm font-medium text-gray-700">
          Go Real Time
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="real-time-toggle"
            checked={isRealTime}
            onChange={handleToggleChange}
            className="sr-only peer"
          />
          {/* Toggle Track */}
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">
            {/* Toggle Circle */}
            <div
              className={`absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                isRealTime ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </div>
        </label>
      </div>
    </div>
  );
}