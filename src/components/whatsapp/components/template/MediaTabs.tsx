import React from "react";
import { FaImage, FaVideo, FaFile } from "react-icons/fa";

interface MediaTabsProps {
  activeMediaTab: "text" | "image" | "video" | "document";
  setActiveMediaTab: (tab: "text" | "image" | "video" | "document") => void;
}

const MediaTabs: React.FC<MediaTabsProps> = ({
  activeMediaTab,
  setActiveMediaTab,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {["text", "image", "video", "document"].map((tab) => (
        <button
          key={tab}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 ${
            activeMediaTab === tab
              ? "bg-[#41b658] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => {
            setActiveMediaTab(tab as typeof activeMediaTab);
          }}
        >
          {tab === "text" && <span className="text-xs sm:text-sm">T</span>}
          {tab === "image" && <FaImage className="text-xs sm:text-sm" />}
          {tab === "video" && <FaVideo className="text-xs sm:text-sm" />}
          {tab === "document" && <FaFile className="text-xs sm:text-sm" />}
          <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
        </button>
      ))}
    </div>
  );
};

export default MediaTabs;
