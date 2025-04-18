"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Filters = ({ selectedCategory, onCategoryChange, selectedLanguage, onLanguageChange, }) => {
    return (<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      {/* Category Filter */}
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent">
        <option value="">All Categories</option>
        <option value="MARKETING">Marketing</option>
        <option value="UTILITY">Utility</option>
      </select>

      {/* Language Filter */}
      <select value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent">
        <option value="en_US">English (US)</option>
        <option value="en_GB">English (UK)</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
      </select>
    </div>);
};
exports.default = Filters;
