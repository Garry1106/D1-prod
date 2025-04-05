import React from "react";

interface ButtonsReviewProps {
  buttons: {
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }[];
}

const ButtonsReview: React.FC<ButtonsReviewProps> = ({ buttons }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Buttons</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {buttons.map((button, index) => (
          <div key={index} className="mb-2">
            <p>
              <strong>Type:</strong> {button.type}
            </p>
            <p>
              <strong>Text:</strong> {button.text}
            </p>
            {button.type === "url" && (
              <p>
                <strong>URL:</strong> {button.url}
              </p>
            )}
            {button.type === "phone_number" && (
              <p>
                <strong>Phone Number:</strong> {button.phone_number}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonsReview;
