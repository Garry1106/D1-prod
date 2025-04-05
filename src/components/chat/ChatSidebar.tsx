import React, { useState } from "react";

interface Props {
  uniqueUuids: string[];
  selectedUuid: string | null;
  setSelectedUuid: (uuid: string | null) => void;
  unreadMessages: { [key: string]: number }; // Add this line
}

const ChatSidebar: React.FC<Props> = ({
  uniqueUuids,
  selectedUuid,
  setSelectedUuid,
  unreadMessages,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredUuids = uniqueUuids.filter((uuid) =>
    uuid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="flex-shrink-0 w-1/4 min-w-[200px] max-w-[300px] bg-gradient-to-b from-white via-green-50 to-green-100 text-gray-700 h-full flex flex-col shadow-lg rounded-lg border border-green-200">
      {/* Sidebar Header */}
      <h2 className="p-4 text-xl font-semibold border-b border-green-200 text-gray-800 bg-green-50 rounded-t-lg">
        Chats
      </h2>

      {/* Search Bar */}
      <div className="p-4 border-b border-green-200 bg-green-50">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
        />
      </div>

      {/* Chat List */}
      <ul className="flex-1 overflow-y-auto bg-white rounded-b-lg">
        {filteredUuids.length > 0 ? (
          filteredUuids.map((uuid) => (
            <li
              key={uuid}
              onClick={() => setSelectedUuid(uuid)}
              className={`p-4 cursor-pointer ${
                selectedUuid === uuid
                  ? "bg-green-200 text-gray-800"
                  : "hover:bg-green-100 text-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{uuid}</span>
                {unreadMessages[uuid] > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages[uuid]}
                  </span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No chats found</li>
        )}
      </ul>
    </aside>
  );
};


export default ChatSidebar;