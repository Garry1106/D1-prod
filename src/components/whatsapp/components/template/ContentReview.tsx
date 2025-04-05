import React from "react";

interface ContentReviewProps {
  headerText: string;
  bodyText: string;
  footerText: string;
}

const ContentReview: React.FC<ContentReviewProps> = ({
  headerText,
  bodyText,
  footerText,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Content</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {headerText && (
          <p>
            <strong>Header:</strong> {headerText}
          </p>
        )}
        <p>
          <strong>Body:</strong> {bodyText}
        </p>
        {footerText && (
          <p>
            <strong>Footer:</strong> {footerText}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentReview;
