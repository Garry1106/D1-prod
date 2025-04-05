'use client';
import React, { useState } from 'react';

interface SidebarDropdownProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  items: { label: string; path: string }[];
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ icon, label, isCollapsed, items }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <li className="flex flex-col">
      <div
        onClick={toggleDropdown}
        className="flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-600">{icon}</div>
          {!isCollapsed && <span className="text-gray-800">{label}</span>}
        </div>
        {!isCollapsed && (
          <div
            className={`text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            ▼
          </div>
        )}
      </div>
      {!isCollapsed && isOpen && (
        <ul className="pl-10 mt-2 space-y-2">
          {items.map((item) => (
            <li
              key={item.path}
              onClick={() => window.location.pathname = `/${item.path}`}
              className="text-gray-800 cursor-pointer hover:text-indigo-600"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarDropdown;
