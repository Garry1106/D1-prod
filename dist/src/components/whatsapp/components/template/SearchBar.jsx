"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SearchBar = ({ searchQuery, onSearchChange, }) => {
    return (<div className="relative w-full md:w-auto">
      <input type="text" placeholder="Search templates..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"/>
    </div>);
};
exports.default = SearchBar;
