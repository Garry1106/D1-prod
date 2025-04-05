'use client'
import React from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import SearchBar from "./SearchBar";

interface HeaderSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 className="text-2xl font-bold text-black">Templates</h1>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        <Link href="/console/dashboard/whatsapp/create-template">
          <button className="bg-[#41b658] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#41b658]/80 transition-colors w-full md:w-auto">
            <FaPlus className="mr-2" />
            Create Template
          </button>
        </Link>
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>
    </div>
  );
};

export default HeaderSection;
