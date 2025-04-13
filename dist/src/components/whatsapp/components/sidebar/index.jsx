"use strict";
'use client'; // Mark this as a Client Component
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation"); // Import usePathname
const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const pathname = (0, navigation_1.usePathname)(); // Get the current path
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleLogout = () => {
        if (isCollapsed) {
            console.log('Logout clicked while sidebar is collapsed');
        }
        // signOut(); // Call the signOut function from NextAuth
    };
    // Function to determine if a link is active based on the last segment of the URL
    const isActive = (href) => {
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1];
        return lastSegment === href.split('/').pop();
    };
    return (<div className={`flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (<h1 className="text-xl font-semibold text-[#41b658]">DuneFox</h1>)}
        <button onClick={toggleSidebar} className="p-2 text-[#41b658] hover:bg-[#41b658] hover:text-white rounded-lg transition-colors">
          {isCollapsed ? <lucide_react_1.ChevronRight className="w-5 h-5"/> : <lucide_react_1.ChevronLeft className="w-5 h-5"/>}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <link_1.default href="/console/dashboard/whatsapp" className={`flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors ${isActive('/console/dashboard/whatsapp') ? 'bg-[#41b658] text-white' : ''}`}>
              <div className="flex items-center justify-center w-5 h-5">
                <lucide_react_1.Home className="w-5 h-5"/>
              </div>
              {!isCollapsed && <span className="ml-3">Home</span>}
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/console/dashboard/whatsapp/chat" className={`flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors ${isActive('/console/dashboard/whatsapp/chat') ? 'bg-[#41b658] text-white' : ''}`}>
              <div className="flex items-center justify-center w-5 h-5">
                <lucide_react_1.MessageCircle className="w-5 h-5"/>
              </div>
              {!isCollapsed && <span className="ml-3">Chats</span>}
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/console/dashboard/whatsapp/templates" className={`flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors ${isActive('/console/dashboard/whatsapp/templates') ? 'bg-[#41b658] text-white' : ''}`}>
              <div className="flex items-center justify-center w-5 h-5">
                <lucide_react_1.Layout className="w-5 h-5"/>
              </div>
              {!isCollapsed && <span className="ml-3">Template</span>}
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/console/dashboard/whatsapp/group" className={`flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors ${isActive('/console/dashboard/whatsapp/group') ? 'bg-[#41b658] text-white' : ''}`}>
              <div className="flex items-center justify-center w-5 h-5">
                <lucide_react_1.Users className="w-5 h-5"/>
              </div>
              {!isCollapsed && <span className="ml-3">Groups</span>}
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/console/dashboard/whatsapp/campaign" className={`flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors ${isActive('/console/dashboard/whatsapp/campaign') ? 'bg-[#41b658] text-white' : ''}`}>
              <div className="flex items-center justify-center w-5 h-5">
                <lucide_react_1.CalendarCheck className="w-5 h-5"/>
              </div>
              {!isCollapsed && <span className="ml-3">Campaigns</span>}
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/console/dashboard/whatsapp/profile" className={`flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors ${isActive('/console/dashboard/whatsapp/profile') ? 'bg-[#41b658] text-white' : ''}`}>
              <div className="flex items-center justify-center w-5 h-5">
                <lucide_react_1.User className="w-5 h-5"/>
              </div>
              {!isCollapsed && <span className="ml-3">Profile</span>}
            </link_1.default>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout} className="flex items-center p-2 text-gray-700 hover:bg-[#41b658] hover:text-white rounded-lg transition-colors w-full">
          <div className="flex items-center justify-center w-5 h-5">
            <lucide_react_1.LogOut className="w-5 h-5"/>
          </div>
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>);
};
exports.default = Sidebar;
