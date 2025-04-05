import React from "react";
import Filters from "./Filters";

interface FiltersSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <Filters
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};

export default FiltersSection;
