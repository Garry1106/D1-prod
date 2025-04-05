import React from "react";

interface TemplateDetailsProps {
  selectedCategory: string;
  templateLanguage: string;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({
  selectedCategory,
  templateLanguage,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Template Details
      </h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p>
          <strong>Category:</strong> {selectedCategory}
        </p>
        <p>
          <strong>Language:</strong> {templateLanguage}
        </p>
      </div>
    </div>
  );
};

export default TemplateDetails;
