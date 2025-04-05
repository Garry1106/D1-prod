import React from "react";
import { Dialog } from "@headlessui/react";

interface DeleteConfirmationModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  handleDeleteTemplate: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDeleteTemplate,
}) => {
  return (
    <Dialog
      open={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md border border-gray-300">
        <Dialog.Title className="text-lg font-bold text-black">
          Delete Template
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-gray-700">
          Are you sure you want to delete this template? This action cannot be
          undone.
        </Dialog.Description>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTemplate}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
