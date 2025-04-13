"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const navigation_1 = require("next/navigation");
const SidebarItem = ({ icon, label, path, isCollapsed, pathname, onClick }) => {
    const router = (0, navigation_1.useRouter)();
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        else {
            router.push(`/${path}`);
        }
    };
    return (<li onClick={handleClick} className={`flex items-center space-x-3 py-2 px-4 rounded-lg cursor-pointer ${pathname === `/${path}` ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'hover:bg-gray-100 text-gray-800'}`}>
      <div className="text-gray-600">{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </li>);
};
exports.default = SidebarItem;
