'use client';

import { useState } from 'react';
import { Home, MessageCircle, Settings, Users, ChevronLeft, ChevronRight, Layout, CalendarCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (isCollapsed) {
      console.log('Logout clicked while sidebar is collapsed');
    }
  };

  // Function to determine if a link is active based on the last segment of the URL
  const isActive = (href: string) => {
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment === href.split('/').pop();
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-blue-600">DuneFox</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/console/dashboard/webbot"
              className={`flex items-center p-2 text-gray-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors ${
                isActive('/webbot') ? 'bg-blue-600 text-white' : ''
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5">
                <Home className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="ml-3">Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/console/dashboard/webbot/chats"
              className={`flex items-center p-2 text-gray-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors ${
                isActive('chats') ? 'bg-blue-600 text-white' : ''
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5">
                <MessageCircle className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="ml-3">Chats</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/console/dashboard/whatsapp/settings"
              className={`flex items-center p-2 text-gray-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors ${
                isActive('settings') ? 'bg-blue-600 text-white' : ''
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5">
                <Settings className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;