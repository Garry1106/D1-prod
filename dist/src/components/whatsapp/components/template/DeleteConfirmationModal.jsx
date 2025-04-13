"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@headlessui/react");
const DeleteConfirmationModal = ({ isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteTemplate, }) => {
    return (<react_2.Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <react_2.Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md border border-gray-300">
        <react_2.Dialog.Title className="text-lg font-bold text-black">
          Delete Template
        </react_2.Dialog.Title>
        <react_2.Dialog.Description className="mt-2 text-gray-700">
          Are you sure you want to delete this template? This action cannot be
          undone.
        </react_2.Dialog.Description>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
            Cancel
          </button>
          <button onClick={handleDeleteTemplate} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      </react_2.Dialog.Panel>
    </react_2.Dialog>);
};
exports.default = DeleteConfirmationModal;
