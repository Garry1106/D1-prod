"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHeader = ChatHeader;
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
const react_1 = require("react");
function ChatHeader({ user }) {
    // State to manage the real-time toggle
    const [isRealTime, setIsRealTime] = (0, react_1.useState)(false);
    // Handle toggle change
    const handleToggleChange = (event) => {
        setIsRealTime(event.target.checked);
        console.log(`Real-time mode: ${event.target.checked ? 'ON' : 'OFF'}`);
        // Add your real-time functionality here
    };
    return (<div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {user.avatar ? (<image_1.default src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full"/>) : (<lucide_react_1.UserCircle className="w-10 h-10 text-gray-400"/>)}
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
          <input type="checkbox" id="real-time-toggle" checked={isRealTime} onChange={handleToggleChange} className="sr-only peer"/>
          {/* Toggle Track */}
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">
            {/* Toggle Circle */}
            <div className={`absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isRealTime ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>
    </div>);
}
