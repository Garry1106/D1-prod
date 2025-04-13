"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const fa_1 = require("react-icons/fa");
const SearchBar_1 = __importDefault(require("./SearchBar"));
const HeaderSection = ({ searchQuery, onSearchChange, }) => {
    return (<div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 className="text-2xl font-bold text-black">Templates</h1>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        <link_1.default href="/console/dashboard/whatsapp/create-template">
          <button className="bg-[#41b658] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#41b658]/80 transition-colors w-full md:w-auto">
            <fa_1.FaPlus className="mr-2"/>
            Create Template
          </button>
        </link_1.default>
        <SearchBar_1.default searchQuery={searchQuery} onSearchChange={onSearchChange}/>
      </div>
    </div>);
};
exports.default = HeaderSection;
