'use client'

import React from "react";
import { FaSpinner } from "react-icons/fa";
import TemplateRow from "./TemplateRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import shadcn table components

interface TemplatesTableProps {
  loading: boolean;
  filteredTemplates: any[];
  setSelectedTemplate: (templateName: string) => void;
  setTemplateToDelete: (templateName: string | null) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

const TemplatesTable: React.FC<TemplatesTableProps> = ({
  loading,
  filteredTemplates,
  setSelectedTemplate,
  setTemplateToDelete,
  setIsDeleteModalOpen,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="py-3 px-4 text-left text-black font-semibold">
              Template name
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-black font-semibold">
              Category
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-black font-semibold">
              Language
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-black font-semibold">
              Status
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-black font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <FaSpinner className="animate-spin text-whatsapp-green" />
                  <span className="text-black">Loading templates...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredTemplates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-4 text-center text-black">
                No templates found.
              </TableCell>
            </TableRow>
          ) : (
            filteredTemplates.map((template) => (
              <TemplateRow
                key={template.id}
                template={template}
                setSelectedTemplate={setSelectedTemplate}
                setTemplateToDelete={setTemplateToDelete}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TemplatesTable;