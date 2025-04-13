"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TemplateDetails = ({ selectedCategory, templateLanguage, }) => {
    return (<div className="mb-6">
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
    </div>);
};
exports.default = TemplateDetails;
