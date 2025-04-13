"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const table_1 = require("@/components/ui/table"); // Import shadcn table components
const lucide_react_1 = require("lucide-react");
const TemplateRow = ({ template, setSelectedTemplate, setTemplateToDelete, setIsDeleteModalOpen, }) => {
    return (<table_1.TableRow className="border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedTemplate(template.name)}>
      {/* Template Name */}
      <table_1.TableCell className="py-3 px-4 text-black whitespace-nowrap font-normal text-base">
        {template.name}
      </table_1.TableCell>

      {/* Category */}
      <table_1.TableCell className="py-3 px-4 text-black whitespace-nowrap">
        {template.category}
      </table_1.TableCell>

      {/* Language */}
      <table_1.TableCell className="py-3 px-4 text-black whitespace-nowrap">
        {template.language}
      </table_1.TableCell>

      {/* Status */}
      <table_1.TableCell className="py-3 px-4 text-black whitespace-nowrap">
        <span className={template.status === "APPROVED"
            ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            : template.status === "PENDING"
                ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                : template.status === "REJECTED"
                    ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                    : "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"}>
          {template.status}
        </span>
      </table_1.TableCell>

      {/* Actions */}
      <table_1.TableCell className="py-3 px-4 text-black whitespace-nowrap">
        <button className="text-orange hover:text-orange-600 mr-2" onClick={(e) => {
            e.stopPropagation();
            // Handle edit action
        }}>
          <lucide_react_1.Pencil className="w-5 h-5"/>
        </button>
        <button className="text-red-500 hover:text-red-600" onClick={(e) => {
            e.stopPropagation();
            setTemplateToDelete(template.name);
            setIsDeleteModalOpen(true);
        }}>
          <lucide_react_1.Trash className="w-5 h-5"/>
        </button>
      </table_1.TableCell>
    </table_1.TableRow>);
};
exports.default = TemplateRow;
