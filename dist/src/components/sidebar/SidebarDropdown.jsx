"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const SidebarDropdown = ({ icon, label, isCollapsed, items }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(true);
    const toggleDropdown = () => setIsOpen(!isOpen);
    return (<li className="flex flex-col">
      <div onClick={toggleDropdown} className="flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-100">
        <div className="flex items-center space-x-3">
          <div className="text-gray-600">{icon}</div>
          {!isCollapsed && <span className="text-gray-800">{label}</span>}
        </div>
        {!isCollapsed && (<div className={`text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>)}
      </div>
      {!isCollapsed && isOpen && (<ul className="pl-10 mt-2 space-y-2">
          {items.map((item) => (<li key={item.path} onClick={() => window.location.pathname = `/${item.path}`} className="text-gray-800 cursor-pointer hover:text-indigo-600">
              {item.label}
            </li>))}
        </ul>)}
    </li>);
};
exports.default = SidebarDropdown;
