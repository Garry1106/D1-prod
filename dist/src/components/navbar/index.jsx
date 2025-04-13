"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// components/Navbar.tsx
const react_1 = __importDefault(require("react"));
const Navbar = ({ userName }) => {
    return (<div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="text-2xl font-medium text-gray-700">
        Welcome, {userName}!
      </div>
    </div>);
};
exports.default = Navbar;
