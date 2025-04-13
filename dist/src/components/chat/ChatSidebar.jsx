"use strict";
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
const ChatSidebar = ({ uniqueUuids, selectedUuid, setSelectedUuid, unreadMessages, }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const filteredUuids = uniqueUuids.filter((uuid) => uuid.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<aside className="flex-shrink-0 w-1/4 min-w-[200px] max-w-[300px] bg-gradient-to-b from-white via-green-50 to-green-100 text-gray-700 h-full flex flex-col shadow-lg rounded-lg border border-green-200">
      {/* Sidebar Header */}
      <h2 className="p-4 text-xl font-semibold border-b border-green-200 text-gray-800 bg-green-50 rounded-t-lg">
        Chats
      </h2>

      {/* Search Bar */}
      <div className="p-4 border-b border-green-200 bg-green-50">
        <input type="text" placeholder="Search chats..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 rounded bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"/>
      </div>

      {/* Chat List */}
      <ul className="flex-1 overflow-y-auto bg-white rounded-b-lg">
        {filteredUuids.length > 0 ? (filteredUuids.map((uuid) => (<li key={uuid} onClick={() => setSelectedUuid(uuid)} className={`p-4 cursor-pointer ${selectedUuid === uuid
                ? "bg-green-200 text-gray-800"
                : "hover:bg-green-100 text-gray-600"}`}>
              <div className="flex items-center justify-between">
                <span>{uuid}</span>
                {unreadMessages[uuid] > 0 && (<span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages[uuid]}
                  </span>)}
              </div>
            </li>))) : (<li className="p-4 text-center text-gray-500">No chats found</li>)}
      </ul>
    </aside>);
};
exports.default = ChatSidebar;
