"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ChatDashboardHeader = ({ realTimeMode, setRealTimeMode }) => (<header className="p-4 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 border-b border-blue-200 flex items-center justify-center shadow-md rounded-lg">
    <h1 className="text-2xl font-semibold text-white">Chat Dashboard</h1>
  </header>);
exports.default = ChatDashboardHeader;
