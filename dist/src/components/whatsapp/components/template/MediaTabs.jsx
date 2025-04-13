"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fa_1 = require("react-icons/fa");
const MediaTabs = ({ activeMediaTab, setActiveMediaTab, }) => {
    return (<div className="flex flex-wrap gap-2 mb-6">
      {["text", "image", "video", "document"].map((tab) => (<button key={tab} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 ${activeMediaTab === tab
                ? "bg-[#41b658] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => {
                setActiveMediaTab(tab);
            }}>
          {tab === "text" && <span className="text-xs sm:text-sm">T</span>}
          {tab === "image" && <fa_1.FaImage className="text-xs sm:text-sm"/>}
          {tab === "video" && <fa_1.FaVideo className="text-xs sm:text-sm"/>}
          {tab === "document" && <fa_1.FaFile className="text-xs sm:text-sm"/>}
          <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
        </button>))}
    </div>);
};
exports.default = MediaTabs;
