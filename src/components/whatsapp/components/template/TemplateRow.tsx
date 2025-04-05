'use client'
import React from "react";

import { TableRow, TableCell } from "@/components/ui/table"; // Import shadcn table components
import { Pencil, Trash } from "lucide-react";

interface TemplateRowProps {
  template: any;
  setSelectedTemplate: (templateName: string) => void;
  setTemplateToDelete: (templateName: string | null) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

const TemplateRow: React.FC<TemplateRowProps> = ({
  template,
  setSelectedTemplate,
  setTemplateToDelete,
  setIsDeleteModalOpen,
}) => {
  return (
    <TableRow
      className="border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => setSelectedTemplate(template.name)}
    >
      {/* Template Name */}
      <TableCell className="py-3 px-4 text-black whitespace-nowrap font-normal text-base">
        {template.name}
      </TableCell>

      {/* Category */}
      <TableCell className="py-3 px-4 text-black whitespace-nowrap">
        {template.category}
      </TableCell>

      {/* Language */}
      <TableCell className="py-3 px-4 text-black whitespace-nowrap">
        {template.language}
      </TableCell>

      {/* Status */}
      <TableCell className="py-3 px-4 text-black whitespace-nowrap">
        <span
          className={
            template.status === "APPROVED"
              ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              : template.status === "PENDING"
              ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
              : template.status === "REJECTED"
              ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
              : "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          }
        >
          {template.status}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3 px-4 text-black whitespace-nowrap">
        <button
          className="text-orange hover:text-orange-600 mr-2"
          onClick={(e) => {
            e.stopPropagation();
            // Handle edit action
          }}
        >
          <Pencil className="w-5 h-5"/>
        </button>
        <button
          className="text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            setTemplateToDelete(template.name);
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash className="w-5 h-5"/>
        </button>
      </TableCell>
    </TableRow>
  );
};

export default TemplateRow;