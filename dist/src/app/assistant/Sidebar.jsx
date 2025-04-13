"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const link_1 = __importDefault(require("next/link"));
function Sidebar({ tenantId, onChatsClick }) {
    return (<div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 p-6">
            <h1 className="text-2xl font-bold mb-8">Chatbot App</h1>
            <ul className="space-y-4">
                <li>
                    <link_1.default href="/dashboard" className="hover:text-blue-500 transition">
                        Dashboard
                    </link_1.default>
                </li>
                <li>
                    <link_1.default href="/about-us" className="hover:text-blue-500 transition">
                        About Us
                    </link_1.default>
                </li>
                <li>
                    <button onClick={onChatsClick} className="hover:text-blue-500 transition">
                        Chats
                    </button>
                </li>
            </ul>
        </div>);
}
