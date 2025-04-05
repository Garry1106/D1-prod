import React from "react";

interface Props {
  realTimeMode: boolean;
  setRealTimeMode: (value: boolean) => void;
}

const ChatDashboardHeader: React.FC<Props> = ({ realTimeMode, setRealTimeMode }) => (
  <header className="p-4 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 border-b border-blue-200 flex items-center justify-center shadow-md rounded-lg">
    <h1 className="text-2xl font-semibold text-white">Chat Dashboard</h1>
  </header>
);

export default ChatDashboardHeader;
