'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isCollapsed: boolean;
  pathname?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, isCollapsed, pathname, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/${path}`);
    }
  };

  return (
    <li
      onClick={handleClick}
      className={`flex items-center space-x-3 py-2 px-4 rounded-lg cursor-pointer ${
        pathname === `/${path}` ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'hover:bg-gray-100 text-gray-800'
      }`}
    >
      <div className="text-gray-600">{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </li>
  );
};

export default SidebarItem;
