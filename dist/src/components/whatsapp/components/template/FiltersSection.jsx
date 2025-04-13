"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Filters_1 = __importDefault(require("./Filters"));
const FiltersSection = ({ selectedCategory, onCategoryChange, selectedLanguage, onLanguageChange, }) => {
    return (<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <Filters_1.default selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange}/>
    </div>);
};
exports.default = FiltersSection;
